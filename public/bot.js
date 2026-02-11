/* ═══════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — bot.js
   AI Bot Players Module
   Three difficulty levels: easy, medium, hard
   Runs on HOST client only — host decides for all bots,
   then broadcasts state updates to other clients.
   ═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────── */
var BOT_NAMES = ['Bot Alice', 'Bot Bob', 'Bot Carol', 'Bot Dave', 'Bot Eve'];

var BOT_DELAY_MIN = 1000;  // ms
var BOT_DELAY_MAX = 3000;

// Max physical houses/hotels in standard Monopoly
var MAX_HOUSES_GLOBAL = 32;
var MAX_HOTELS_GLOBAL = 12;

// Positions of railroads and utilities
var RAILROAD_POSITIONS = [5, 15, 25, 35];
var UTILITY_POSITIONS  = [12, 28];

// High-ROI groups (orange and red land on most often statistically)
var HIGH_ROI_GROUPS = ['orange', 'red'];
var MEDIUM_ROI_GROUPS = ['yellow', 'darkblue', 'lightblue'];

// Property value tiers for evaluation
var GROUP_PRIORITY = {
  orange:    10,
  red:        9,
  yellow:     8,
  darkblue:   8,
  green:      7,
  pink:       6,
  lightblue:  5,
  brown:      3
};

/* ──────────────────────────────────────
   HELPERS
   ────────────────────────────────────── */
function botDelay(minMs, maxMs) {
  var mn = minMs || BOT_DELAY_MIN;
  var mx = maxMs || BOT_DELAY_MAX;
  return mn + Math.floor(Math.random() * (mx - mn));
}

function botRandom() {
  return Math.random();
}

function botPick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function botLog(msg) {
  if (typeof console !== 'undefined') {
    console.log('[BOT] ' + msg);
  }
}

/* ──────────────────────────────────────
   MonopolyBot — AI decision maker
   ────────────────────────────────────── */
function MonopolyBot(seatIndex, difficulty, engine) {
  this.seatIndex = seatIndex;
  this.difficulty = difficulty || 'easy'; // 'easy', 'medium', 'hard'
  this.engine = engine;
  this.name = '';
  this.characterId = null;
  this._tradeProposedThisTurn = false;
  this._lastTradeTarget = null;
  this._tradeCooldown = 0; // turns until next trade attempt
}

/* ── Get the player object for this bot ── */
MonopolyBot.prototype.getPlayer = function() {
  return this.engine.getPlayer(this.seatIndex);
};

/* ── Calculate money remaining after a hypothetical purchase ── */
MonopolyBot.prototype.moneyAfterPurchase = function(price) {
  var p = this.getPlayer();
  return p ? p.money - price : 0;
};

/* ── Calculate fraction of money remaining after purchase ── */
MonopolyBot.prototype.moneyFractionAfter = function(price) {
  var p = this.getPlayer();
  if (!p || p.money <= 0) return 0;
  return (p.money - price) / p.money;
};

/* ── Check how many properties in a group this bot owns ── */
MonopolyBot.prototype.groupOwnership = function(group) {
  var positions = COLOR_GROUPS[group];
  if (!positions) return { owned: 0, total: 0, missing: 0, missingPositions: [] };
  var owned = 0;
  var missingPositions = [];
  for (var i = 0; i < positions.length; i++) {
    if (this.engine.getPropertyOwner(positions[i]) === this.seatIndex) {
      owned++;
    } else {
      missingPositions.push(positions[i]);
    }
  }
  return {
    owned: owned,
    total: positions.length,
    missing: positions.length - owned,
    missingPositions: missingPositions
  };
};

/* ── Would buying this property complete a group? ── */
MonopolyBot.prototype.wouldCompleteGroup = function(pos) {
  var space = BOARD_DATA[pos];
  if (!space || !space.group) return false;
  var info = this.groupOwnership(space.group);
  return info.missing === 1;
};

/* ── Count properties owned by this bot in the same group as pos ── */
MonopolyBot.prototype.groupProgressForPos = function(pos) {
  var space = BOARD_DATA[pos];
  if (!space || !space.group) return 0;
  return this.groupOwnership(space.group).owned;
};

/* ── Calculate expected rent income from a property ── */
MonopolyBot.prototype.expectedROI = function(pos) {
  var space = BOARD_DATA[pos];
  if (!space || !space.price) return 0;
  // Simple ROI: base rent / price
  // If we'd have full group, double the base rent
  var baseRent = 0;
  if (space.type === 'property' && space.rent) {
    baseRent = space.rent[0];
    if (this.wouldCompleteGroup(pos)) baseRent *= 2;
  } else if (space.type === 'railroad') {
    var rrCount = this.engine.getOwnedRailroadCount(this.seatIndex) + 1;
    baseRent = [0, 25, 50, 100, 200][rrCount] || 25;
  } else if (space.type === 'utility') {
    var utCount = this.engine.getOwnedUtilityCount(this.seatIndex) + 1;
    baseRent = (utCount >= 2 ? 10 : 4) * 7; // avg dice = 7
  }
  return baseRent / space.price;
};

/* ── Calculate board danger (expected rent if we move) ── */
MonopolyBot.prototype.boardDanger = function() {
  var totalDanger = 0;
  var dangerCount = 0;
  for (var pos = 0; pos < 40; pos++) {
    var ps = this.engine.propertyState[pos];
    if (!ps || ps.owner === null || ps.owner === undefined) continue;
    if (ps.owner === this.seatIndex) continue;
    if (ps.mortgaged) continue;
    var rent = this.engine.calculateRent(pos, 7);
    totalDanger += rent;
    dangerCount++;
  }
  return { total: totalDanger, count: dangerCount, avg: dangerCount > 0 ? totalDanger / dangerCount : 0 };
};

/* ── Get properties sorted by value (ascending) for mortgage priority ── */
MonopolyBot.prototype.propertiesByMortgageValue = function() {
  var p = this.getPlayer();
  if (!p) return [];
  var props = [];
  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    var space = BOARD_DATA[pos];
    var ps = this.engine.propertyState[pos];
    if (!ps || ps.mortgaged) continue;
    if ((ps.houses || 0) > 0) continue;

    // Score: lower = should mortgage first
    var score = space.mortgage || 0;
    // Boost score for group properties where we own multiple
    var groupInfo = this.groupOwnership(space.group || '');
    if (groupInfo.owned === groupInfo.total) score += 1000; // never mortgage monopoly if possible
    else score += groupInfo.owned * 50;

    // Railroads get moderate priority
    if (space.type === 'railroad') {
      var rrCount = this.engine.getOwnedRailroadCount(this.seatIndex);
      score += rrCount * 40;
    }

    props.push({ pos: pos, space: space, score: score, mortgage: space.mortgage });
  }
  // Sort ascending by score (lowest value = mortgage first)
  props.sort(function(a, b) { return a.score - b.score; });
  return props;
};

/* ── Determine how many of a group are owned by opponents ── */
MonopolyBot.prototype.opponentGroupProgress = function(group) {
  var positions = COLOR_GROUPS[group];
  if (!positions) return {};
  var owners = {};
  for (var i = 0; i < positions.length; i++) {
    var owner = this.engine.getPropertyOwner(positions[i]);
    if (owner !== null && owner !== this.seatIndex) {
      owners[owner] = (owners[owner] || 0) + 1;
    }
  }
  return owners;
};

/* ── Can an opponent complete a group if they get a specific position? ── */
MonopolyBot.prototype.blockingValue = function(pos) {
  var space = BOARD_DATA[pos];
  if (!space || !space.group) return 0;
  var opp = this.opponentGroupProgress(space.group);
  var groupSize = (COLOR_GROUPS[space.group] || []).length;
  var maxOpp = 0;
  for (var seat in opp) {
    if (opp.hasOwnProperty(seat) && opp[seat] > maxOpp) maxOpp = opp[seat];
  }
  // If opponent is 1 away from monopoly, high blocking value
  if (maxOpp === groupSize - 1) return 10;
  if (maxOpp >= 1) return 3;
  return 0;
};

/* ══════════════════════════════════════
   BUYING DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideBuy = function(pos) {
  var space = BOARD_DATA[pos];
  var p = this.getPlayer();
  if (!p || !space || !space.price) return false;
  if (p.money < space.price) return false;

  var difficulty = this.difficulty;

  /* ── EASY ── */
  if (difficulty === 'easy') {
    // Buy if has >60% of price left after purchase; random skip 30%
    if (botRandom() < 0.30) {
      botLog(p.name + ' randomly passes on ' + space.name);
      return false;
    }
    var fractionLeft = this.moneyFractionAfter(space.price);
    return fractionLeft > 0.40; // >40% of current money remains (i.e. price < 60% of money)
  }

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    // Always buy if completing a group
    if (this.wouldCompleteGroup(pos)) {
      botLog(p.name + ' buys ' + space.name + ' to complete group!');
      return true;
    }
    // Buy if has >40% remaining
    var frac = this.moneyFractionAfter(space.price);
    if (frac > 0.40) return true;
    // Even if tight, buy if good group progress
    var progress = this.groupProgressForPos(pos);
    if (progress >= 1 && frac > 0.20) return true;
    // Buy railroads if we already own one
    if (space.type === 'railroad' && this.engine.getOwnedRailroadCount(this.seatIndex) >= 1 && frac > 0.15) return true;
    return false;
  }

  /* ── HARD ── */
  // Always buy if completing group
  if (this.wouldCompleteGroup(pos)) {
    botLog(p.name + ' buys ' + space.name + ' to complete group! (hard)');
    return true;
  }

  // Evaluate ROI
  var roi = this.expectedROI(pos);
  var blocking = this.blockingValue(pos);
  var remaining = this.moneyAfterPurchase(space.price);
  var frac2 = this.moneyFractionAfter(space.price);

  // Consider game position
  var myAssets = this.engine.totalAssets(this.seatIndex);
  var active = this.engine.activePlayers();
  var avgAssets = 0;
  for (var i = 0; i < active.length; i++) {
    avgAssets += this.engine.totalAssets(active[i].seatIndex);
  }
  avgAssets = active.length > 0 ? avgAssets / active.length : 1500;
  var positionStrength = myAssets / avgAssets; // >1 means ahead

  // High blocking value = always buy if affordable
  if (blocking >= 10 && remaining > 100) return true;

  // Good ROI + affordable
  if (roi > 0.05 && frac2 > 0.25) return true;

  // Group progress matters
  var progress2 = this.groupProgressForPos(pos);
  if (progress2 >= 1 && frac2 > 0.15) return true;

  // Buy railroads aggressively
  if (space.type === 'railroad') {
    var rrCount = this.engine.getOwnedRailroadCount(this.seatIndex);
    if (rrCount >= 1 && frac2 > 0.10) return true;
    if (frac2 > 0.30) return true;
  }

  // Utility - buy if we own one already or cheap enough
  if (space.type === 'utility') {
    if (this.engine.getOwnedUtilityCount(this.seatIndex) >= 1 && frac2 > 0.10) return true;
    if (frac2 > 0.40) return true;
  }

  // If we're ahead, be more aggressive
  if (positionStrength > 1.2 && frac2 > 0.15) return true;

  // Default: buy if plenty of cash
  if (frac2 > 0.50) return true;

  return false;
};

/* ══════════════════════════════════════
   BUILDING DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideBuild = function() {
  var p = this.getPlayer();
  if (!p) return [];
  var builds = []; // array of positions to build on (in order)
  var difficulty = this.difficulty;

  // Collect all buildable properties
  var buildable = [];
  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    if (this.engine.canBuildOn(this.seatIndex, pos)) {
      var space = BOARD_DATA[pos];
      var ps = this.engine.propertyState[pos];
      var houses = ps ? (ps.houses || 0) : 0;
      buildable.push({ pos: pos, space: space, houses: houses });
    }
  }

  if (buildable.length === 0) return [];

  /* ── EASY ── */
  if (difficulty === 'easy') {
    // Build randomly, max 3 houses per property
    var shuffled = buildable.filter(function(b) { return b.houses < 3; });
    if (shuffled.length === 0) return [];
    // Build on 1-2 random properties
    var count = Math.min(shuffled.length, 1 + Math.floor(botRandom() * 2));
    for (var e = 0; e < count; e++) {
      var pick = botPick(shuffled);
      if (pick && p.money > pick.space.houseCost + 100) {
        builds.push(pick.pos);
      }
    }
    return builds;
  }

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    // Prioritize orange and red groups
    // Build evenly within groups
    // Go to hotels on best groups
    var byGroup = {};
    for (var m = 0; m < buildable.length; m++) {
      var b = buildable[m];
      var grp = b.space.group;
      if (!byGroup[grp]) byGroup[grp] = [];
      byGroup[grp].push(b);
    }

    // Sort groups by priority
    var groupOrder = Object.keys(byGroup);
    groupOrder.sort(function(a, b) {
      return (GROUP_PRIORITY[b] || 0) - (GROUP_PRIORITY[a] || 0);
    });

    for (var gi = 0; gi < groupOrder.length; gi++) {
      var grpName = groupOrder[gi];
      var grpProps = byGroup[grpName];
      // Build evenly: find the one with fewest houses
      grpProps.sort(function(a, b) { return a.houses - b.houses; });
      for (var gp = 0; gp < grpProps.length; gp++) {
        var prop = grpProps[gp];
        // Keep $200 reserve
        if (p.money - prop.space.houseCost > 200) {
          builds.push(prop.pos);
          p.money -= prop.space.houseCost; // Simulate deduction for next check
          // Only build a few per turn to not over-commit
          if (builds.length >= 3) break;
        }
      }
      if (builds.length >= 3) break;
    }
    // Undo simulated deductions (engine hasn't actually deducted)
    // These deductions are only for planning; the actual build calls handle money
    for (var undo = 0; undo < builds.length; undo++) {
      p.money += BOARD_DATA[builds[undo]].houseCost;
    }
    return builds;
  }

  /* ── HARD ── */
  // Strategic building:
  // 1. Build to 3-house sweet spot first (rent jumps significantly at 3 houses)
  // 2. Block house supply when advantageous (only 32 houses total)
  // 3. Manage cash flow - keep enough for rent exposure

  var danger = this.boardDanger();
  var cashReserve = Math.max(200, danger.avg * 2); // Keep enough to survive avg rent hit

  // Group buildable by group
  var byGroup2 = {};
  for (var h = 0; h < buildable.length; h++) {
    var bh = buildable[h];
    var grp2 = bh.space.group;
    if (!byGroup2[grp2]) byGroup2[grp2] = [];
    byGroup2[grp2].push(bh);
  }

  // Priority: get to 3 houses first on high-value groups
  var groupOrder2 = Object.keys(byGroup2);
  groupOrder2.sort(function(a, b) {
    return (GROUP_PRIORITY[b] || 0) - (GROUP_PRIORITY[a] || 0);
  });

  var simMoney = p.money;

  // Phase 1: Build to 3 houses on all monopolies
  for (var g1 = 0; g1 < groupOrder2.length; g1++) {
    var gName = groupOrder2[g1];
    var gProps = byGroup2[gName];
    gProps.sort(function(a, b) { return a.houses - b.houses; });

    for (var p1 = 0; p1 < gProps.length; p1++) {
      var pr = gProps[p1];
      if (pr.houses < 3 && simMoney - pr.space.houseCost > cashReserve) {
        builds.push(pr.pos);
        simMoney -= pr.space.houseCost;
        pr.houses++; // track for even-building logic
        // Re-sort to maintain even building
        if (p1 < gProps.length - 1) {
          p1 = -1; // restart this group
          gProps.sort(function(a, b) { return a.houses - b.houses; });
          // Stop if lowest is now >= 3
          if (gProps[0].houses >= 3) break;
        }
      }
    }
  }

  // Phase 2: If houses are scarce, hoard them (build to 4 but not hotel)
  var housesLeft = this.engine.housesAvailable;
  if (housesLeft < 10) {
    for (var g2 = 0; g2 < groupOrder2.length; g2++) {
      var gN2 = groupOrder2[g2];
      var gP2 = byGroup2[gN2];
      gP2.sort(function(a, b) { return a.houses - b.houses; });
      for (var p2 = 0; p2 < gP2.length; p2++) {
        var pr2 = gP2[p2];
        if (pr2.houses >= 3 && pr2.houses < 4 && simMoney - pr2.space.houseCost > cashReserve) {
          builds.push(pr2.pos);
          simMoney -= pr2.space.houseCost;
        }
      }
    }
  }

  // Phase 3: Build hotels on best groups if flush with cash
  if (simMoney > cashReserve * 2) {
    for (var g3 = 0; g3 < groupOrder2.length; g3++) {
      var gN3 = groupOrder2[g3];
      if (!HIGH_ROI_GROUPS.indexOf(gN3) === -1 && !MEDIUM_ROI_GROUPS.indexOf(gN3) === -1) continue;
      var gP3 = byGroup2[gN3];
      for (var p3 = 0; p3 < gP3.length; p3++) {
        var pr3 = gP3[p3];
        if (pr3.houses === 4 && simMoney - pr3.space.houseCost > cashReserve) {
          builds.push(pr3.pos);
          simMoney -= pr3.space.houseCost;
        }
      }
    }
  }

  return builds;
};

/* ══════════════════════════════════════
   JAIL DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideJail = function() {
  // Returns: 'roll', 'pay', 'card'
  var p = this.getPlayer();
  if (!p || !p.inJail) return 'roll';
  var difficulty = this.difficulty;

  /* ── EASY ── */
  if (difficulty === 'easy') {
    return 'roll'; // Always try doubles
  }

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    var turnNumber = this.engine.turnNumber || 1;
    if (turnNumber < 20) {
      // Early game: pay to get out and buy properties
      if (p.getOutOfJailCards > 0) return 'card';
      if (p.money >= 50) return 'pay';
      return 'roll';
    }
    // Late game: stay in jail (roll for doubles, it's safer)
    return 'roll';
  }

  /* ── HARD ── */
  var danger = this.boardDanger();
  var turnNum = this.engine.turnNumber || 1;
  var avgRentExposure = danger.avg;

  // If board is very dangerous (avg rent > $150), stay in jail
  if (avgRentExposure > 150 && p.jailTurns < 2) {
    return 'roll'; // Try to stay by rolling (hoping for no doubles)
  }

  // Early game (<15 turns) or board is safe: get out ASAP
  if (turnNum < 15 || avgRentExposure < 80) {
    if (p.getOutOfJailCards > 0) return 'card';
    if (p.money >= 150) return 'pay'; // Only pay if we have decent cash
    return 'roll';
  }

  // Mid game: use card if we have one (save money), otherwise roll
  if (p.getOutOfJailCards > 0 && p.jailTurns >= 2) {
    return 'card'; // Use card on last turn to avoid forced $50
  }

  // On turn 3 in jail, we'll be forced to pay anyway
  if (p.jailTurns >= 2 && p.getOutOfJailCards > 0) {
    return 'card';
  }

  return 'roll';
};

/* ══════════════════════════════════════
   MORTGAGE / UNMORTGAGE DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideMortgage = function(neededCash) {
  // Returns array of positions to mortgage (in order) to raise neededCash
  var p = this.getPlayer();
  if (!p) return [];
  if (p.money >= neededCash) return [];

  var toMortgage = [];
  var props = this.propertiesByMortgageValue();
  var currentMoney = p.money;

  for (var i = 0; i < props.length; i++) {
    if (currentMoney >= neededCash) break;
    var prop = props[i];
    if (this.engine.canMortgage(this.seatIndex, prop.pos)) {
      toMortgage.push(prop.pos);
      currentMoney += prop.mortgage;
    }
  }
  return toMortgage;
};

MonopolyBot.prototype.decideUnmortgage = function() {
  // Returns array of positions to unmortgage
  var p = this.getPlayer();
  if (!p) return [];
  var toUnmortgage = [];

  // Sort by group completion potential (unmortgage group-completing ones first)
  var mortgaged = [];
  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    var ps = this.engine.propertyState[pos];
    if (ps && ps.mortgaged) {
      var space = BOARD_DATA[pos];
      var cost = Math.floor(space.mortgage * 1.1);
      var groupInfo = this.groupOwnership(space.group || '');
      var priority = 0;
      // High priority: unmortgaging would restore a monopoly
      if (groupInfo.total > 0 && groupInfo.missing === 0) priority = 100;
      else if (groupInfo.owned > 1) priority = 50;
      priority += (GROUP_PRIORITY[space.group] || 0);
      mortgaged.push({ pos: pos, cost: cost, priority: priority });
    }
  }

  mortgaged.sort(function(a, b) { return b.priority - a.priority; });

  var cashReserve = 200;
  var available = p.money;

  // Easy: unmortgage when we have plenty of cash
  // Medium/Hard: unmortgage strategically, keeping reserve
  if (this.difficulty === 'easy') cashReserve = 300;
  if (this.difficulty === 'hard') cashReserve = Math.max(150, this.boardDanger().avg);

  for (var j = 0; j < mortgaged.length; j++) {
    var m = mortgaged[j];
    if (available - m.cost > cashReserve) {
      toUnmortgage.push(m.pos);
      available -= m.cost;
    }
  }
  return toUnmortgage;
};

/* ══════════════════════════════════════
   SELL HOUSES (when needing cash)
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideSellHouses = function(neededCash) {
  var p = this.getPlayer();
  if (!p) return [];
  if (p.money >= neededCash) return [];

  var toSell = [];
  var currentMoney = p.money;

  // Gather sellable houses, sorted by lowest value first
  var sellable = [];
  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    if (this.engine.canSellHouseOn(this.seatIndex, pos)) {
      var space = BOARD_DATA[pos];
      var refund = Math.floor(space.houseCost / 2);
      var priority = GROUP_PRIORITY[space.group] || 0;
      sellable.push({ pos: pos, refund: refund, priority: priority });
    }
  }

  // Sell from lowest priority groups first
  sellable.sort(function(a, b) { return a.priority - b.priority; });

  for (var j = 0; j < sellable.length; j++) {
    if (currentMoney >= neededCash) break;
    toSell.push(sellable[j].pos);
    currentMoney += sellable[j].refund;
  }
  return toSell;
};

/* ══════════════════════════════════════
   AUCTION DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideAuctionBid = function(pos, currentBid) {
  var space = BOARD_DATA[pos];
  var p = this.getPlayer();
  if (!p || !space || !space.price) return 0;

  var difficulty = this.difficulty;
  var maxAffordable = Math.max(0, p.money - 100); // Keep $100 reserve

  /* ── EASY ── */
  if (difficulty === 'easy') {
    var ceiling = Math.floor(space.price * 0.60);
    if (currentBid >= ceiling || currentBid >= maxAffordable) return 0; // pass
    return Math.min(currentBid + 10, ceiling, maxAffordable);
  }

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    var completesGroup = this.wouldCompleteGroup(pos);
    var cap = completesGroup ? Math.floor(space.price * 0.80) : Math.floor(space.price * 0.50);
    if (currentBid >= cap || currentBid >= maxAffordable) return 0;
    var increment = completesGroup ? 25 : 10;
    return Math.min(currentBid + increment, cap, maxAffordable);
  }

  /* ── HARD ── */
  // Factor in: group completion, blocking opponents, game position
  var completesGroup2 = this.wouldCompleteGroup(pos);
  var blocking = this.blockingValue(pos);
  var groupProg = this.groupProgressForPos(pos);

  var valueMult = 0.50; // base: bid up to 50% of property value
  if (completesGroup2) valueMult = 1.20; // Overpay for monopoly
  else if (blocking >= 10) valueMult = 1.00; // Block opponent monopoly
  else if (groupProg >= 1) valueMult = 0.70;
  else if (space.type === 'railroad' && this.engine.getOwnedRailroadCount(this.seatIndex) >= 2) valueMult = 0.80;

  var cap2 = Math.floor(space.price * valueMult);
  if (currentBid >= cap2 || currentBid >= maxAffordable) return 0;

  // Smart increment: bid just enough
  var increment2 = Math.max(10, Math.floor((cap2 - currentBid) * 0.3));
  return Math.min(currentBid + increment2, cap2, maxAffordable);
};

/* ══════════════════════════════════════
   TRADING DECISIONS
   ══════════════════════════════════════ */
MonopolyBot.prototype.decideTrade = function() {
  // Returns: null (no trade) or { receiver, offererProps, receiverProps, offererCash, receiverCash }
  var p = this.getPlayer();
  if (!p) return null;
  var difficulty = this.difficulty;

  /* ── EASY ── */
  if (difficulty === 'easy') return null; // Doesn't trade

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    if (this._tradeCooldown > 0) { this._tradeCooldown--; return null; }
    // Look for simple 1-for-1 trades that would complete a group
    return this._findSimpleTrade();
  }

  /* ── HARD ── */
  if (this._tradeCooldown > 0) { this._tradeCooldown--; return null; }
  // Try complex trades with cash + multiple properties
  var trade = this._findComplexTrade();
  if (trade) return trade;
  return this._findSimpleTrade();
};

MonopolyBot.prototype._findSimpleTrade = function() {
  var p = this.getPlayer();
  if (!p) return null;

  // For each group where we're 1 away from monopoly
  for (var grp in COLOR_GROUPS) {
    if (!COLOR_GROUPS.hasOwnProperty(grp)) continue;
    var info = this.groupOwnership(grp);
    if (info.missing !== 1 || info.owned === 0) continue;

    // Find who owns the missing property
    var missingPos = info.missingPositions[0];
    var owner = this.engine.getPropertyOwner(missingPos);
    if (owner === null || owner === this.seatIndex) continue;

    var ownerPlayer = this.engine.getPlayer(owner);
    if (!ownerPlayer || ownerPlayer.bankrupt) continue;

    // Check if the missing property has houses (can't trade with houses)
    var ps = this.engine.propertyState[missingPos];
    if (ps && (ps.houses || 0) > 0) continue;

    // What can we offer? A property the other player might want
    var offer = this._findPropertyToOffer(owner, grp);
    if (offer) {
      this._tradeCooldown = 5; // Wait 5 turns before trying again
      return {
        receiver: owner,
        offererProps: [offer.pos],
        receiverProps: [missingPos],
        offererCash: offer.cashSweetener || 0,
        receiverCash: 0
      };
    }

    // Offer cash for the property
    var spaceVal = BOARD_DATA[missingPos];
    var cashOffer = Math.floor(spaceVal.price * 1.5);
    if (p.money > cashOffer + 200) {
      this._tradeCooldown = 5;
      return {
        receiver: owner,
        offererProps: [],
        receiverProps: [missingPos],
        offererCash: cashOffer,
        receiverCash: 0
      };
    }
  }
  return null;
};

MonopolyBot.prototype._findPropertyToOffer = function(targetSeat, excludeGroup) {
  var p = this.getPlayer();
  if (!p) return null;

  // Find a property we own that helps the target player
  var targetPlayer = this.engine.getPlayer(targetSeat);
  if (!targetPlayer) return null;

  var bestOffer = null;
  var bestScore = -1;

  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    var space = BOARD_DATA[pos];
    var ps = this.engine.propertyState[pos];

    // Skip: can't trade properties with houses, or from the group we're completing
    if (ps && (ps.houses || 0) > 0) continue;
    if (space.group === excludeGroup) continue;
    if (space.type !== 'property') continue;

    // Check if this property helps the target complete a group
    var targetGroupInfo = { owned: 0, total: 0 };
    if (space.group && COLOR_GROUPS[space.group]) {
      var positions = COLOR_GROUPS[space.group];
      targetGroupInfo.total = positions.length;
      for (var j = 0; j < positions.length; j++) {
        if (this.engine.getPropertyOwner(positions[j]) === targetSeat) {
          targetGroupInfo.owned++;
        }
      }
    }

    var score = targetGroupInfo.owned;
    // Don't give away properties where we have group progress (unless we have 0 or 1)
    var myInfo = this.groupOwnership(space.group || '');
    if (myInfo.total > 0 && myInfo.owned >= myInfo.total - 1) continue; // Don't give away near-monopoly

    if (score > bestScore) {
      bestScore = score;
      var sweetener = 0;
      // If the property doesn't help them much, add cash
      if (score === 0) sweetener = Math.floor(space.price * 0.5);
      bestOffer = { pos: pos, cashSweetener: sweetener };
    }
  }
  return bestOffer;
};

MonopolyBot.prototype._findComplexTrade = function() {
  var p = this.getPlayer();
  if (!p) return null;

  // Hard bot: evaluate multi-property trades
  // Look for trades where we give 2+ properties for one monopoly-completing one
  for (var grp in COLOR_GROUPS) {
    if (!COLOR_GROUPS.hasOwnProperty(grp)) continue;
    var info = this.groupOwnership(grp);
    if (info.missing !== 1 || info.owned === 0) continue;

    var missingPos = info.missingPositions[0];
    var owner = this.engine.getPropertyOwner(missingPos);
    if (owner === null || owner === this.seatIndex) continue;

    var ownerPlayer = this.engine.getPlayer(owner);
    if (!ownerPlayer || ownerPlayer.bankrupt) continue;

    var ps = this.engine.propertyState[missingPos];
    if (ps && (ps.houses || 0) > 0) continue;

    // What does the owner want? Find properties that help them
    var offerings = [];
    var totalOfferValue = 0;
    var targetValue = BOARD_DATA[missingPos].price;

    for (var i = 0; i < p.properties.length; i++) {
      var pos = p.properties[i];
      var space = BOARD_DATA[pos];
      var pps = this.engine.propertyState[pos];
      if (pps && (pps.houses || 0) > 0) continue;
      if (space.group === grp) continue;

      // Don't offer properties from groups where we have 2+ of 3
      var myGrp = this.groupOwnership(space.group || '');
      if (myGrp.total >= 3 && myGrp.owned >= 2) continue;
      if (myGrp.total === 2 && myGrp.owned >= 2) continue;

      offerings.push({ pos: pos, value: space.price });
    }

    if (offerings.length === 0) continue;

    // Sort by value ascending (offer cheapest first)
    offerings.sort(function(a, b) { return a.value - b.value; });

    // Build an offer: properties + cash to match ~1.3x target value
    var offerProps = [];
    var offerValue = 0;
    var targetTotal = Math.floor(targetValue * 1.3);

    for (var j = 0; j < offerings.length && j < 2; j++) {
      offerProps.push(offerings[j].pos);
      offerValue += offerings[j].value;
    }

    var cashOffer = Math.max(0, targetTotal - offerValue);
    if (cashOffer > p.money - 300) {
      // Can't afford that much cash
      cashOffer = Math.max(0, p.money - 300);
    }

    if (offerProps.length > 0 || cashOffer > 0) {
      this._tradeCooldown = 4;
      return {
        receiver: owner,
        offererProps: offerProps,
        receiverProps: [missingPos],
        offererCash: cashOffer,
        receiverCash: 0
      };
    }
  }
  return null;
};

/* ── Evaluate incoming trade offer ── */
MonopolyBot.prototype.evaluateTradeOffer = function(offer) {
  // Returns true to accept, false to reject
  var p = this.getPlayer();
  if (!p) return false;
  var difficulty = this.difficulty;

  /* ── EASY ── */
  if (difficulty === 'easy') {
    // Accept trades that give us more cash value than we give up
    var offerValue = offer.offererCash || 0;
    var wantValue = offer.receiverCash || 0;
    for (var i = 0; i < (offer.offererProps || []).length; i++) {
      offerValue += (BOARD_DATA[offer.offererProps[i]].price || 0);
    }
    for (var j = 0; j < (offer.receiverProps || []).length; j++) {
      wantValue += (BOARD_DATA[offer.receiverProps[j]].price || 0);
    }
    return offerValue >= wantValue * 0.8; // Accept if value roughly equal
  }

  /* ── MEDIUM ── */
  if (difficulty === 'medium') {
    // Accept if we complete a group
    var completesMyGroup = false;
    for (var m = 0; m < (offer.offererProps || []).length; m++) {
      var pp = offer.offererProps[m];
      var sp = BOARD_DATA[pp];
      if (sp.group) {
        var gInfo = this.groupOwnership(sp.group);
        if (gInfo.missing === 1) {
          completesMyGroup = true;
          break;
        }
      }
    }
    if (completesMyGroup) return true;

    // Don't give away monopoly-completing properties
    for (var r = 0; r < (offer.receiverProps || []).length; r++) {
      var rp = offer.receiverProps[r];
      var rsp = BOARD_DATA[rp];
      if (rsp.group && this.engine.ownsFullGroup(this.seatIndex, rsp.group)) {
        return false; // Never break up a monopoly
      }
    }

    // Simple value check
    var myGain = (offer.offererCash || 0) - (offer.receiverCash || 0);
    for (var a = 0; a < (offer.offererProps || []).length; a++) {
      myGain += (BOARD_DATA[offer.offererProps[a]].price || 0);
    }
    for (var b = 0; b < (offer.receiverProps || []).length; b++) {
      myGain -= (BOARD_DATA[offer.receiverProps[b]].price || 0);
    }
    return myGain >= -50; // Accept slightly unfavorable trades
  }

  /* ── HARD ── */
  // Evaluate monopoly potential for both sides
  var myMonopolyGain = false;
  var theirMonopolyGain = false;

  // Check if I gain a monopoly
  for (var h1 = 0; h1 < (offer.offererProps || []).length; h1++) {
    var hp = offer.offererProps[h1];
    var hsp = BOARD_DATA[hp];
    if (hsp.group) {
      var hInfo = this.groupOwnership(hsp.group);
      if (hInfo.missing === 1) myMonopolyGain = true;
    }
  }

  // Check if they gain a monopoly from what I'm giving
  for (var h2 = 0; h2 < (offer.receiverProps || []).length; h2++) {
    var hp2 = offer.receiverProps[h2];
    var hsp2 = BOARD_DATA[hp2];
    if (hsp2.group) {
      // Check if offerer would complete their group
      var offSeat = offer.offerer;
      var positions = COLOR_GROUPS[hsp2.group] || [];
      var offOwned = 0;
      for (var ci = 0; ci < positions.length; ci++) {
        var po = this.engine.getPropertyOwner(positions[ci]);
        if (po === offSeat) offOwned++;
      }
      // They already own N, and this trade gives them this one
      if (offOwned + 1 >= positions.length) theirMonopolyGain = true;
    }
  }

  // Never give opponent a monopoly unless we get one too
  if (theirMonopolyGain && !myMonopolyGain) return false;

  // If we both gain monopoly, accept if ours is more valuable
  if (theirMonopolyGain && myMonopolyGain) {
    // Compare group priorities
    var myBestGroup = '';
    for (var h3 = 0; h3 < (offer.offererProps || []).length; h3++) {
      var sg = BOARD_DATA[offer.offererProps[h3]].group;
      if (sg && (!myBestGroup || (GROUP_PRIORITY[sg] || 0) > (GROUP_PRIORITY[myBestGroup] || 0))) {
        myBestGroup = sg;
      }
    }
    var theirBestGroup = '';
    for (var h4 = 0; h4 < (offer.receiverProps || []).length; h4++) {
      var sg2 = BOARD_DATA[offer.receiverProps[h4]].group;
      if (sg2 && (!theirBestGroup || (GROUP_PRIORITY[sg2] || 0) > (GROUP_PRIORITY[theirBestGroup] || 0))) {
        theirBestGroup = sg2;
      }
    }
    return (GROUP_PRIORITY[myBestGroup] || 0) >= (GROUP_PRIORITY[theirBestGroup] || 0);
  }

  // If I gain monopoly and they don't, accept
  if (myMonopolyGain) return true;

  // Never break up our own monopoly
  for (var h5 = 0; h5 < (offer.receiverProps || []).length; h5++) {
    var rp2 = offer.receiverProps[h5];
    var rsp2 = BOARD_DATA[rp2];
    if (rsp2.group && this.engine.ownsFullGroup(this.seatIndex, rsp2.group)) {
      return false;
    }
  }

  // Value-based analysis with strategic weight
  var myNetGain = (offer.offererCash || 0) - (offer.receiverCash || 0);
  for (var va = 0; va < (offer.offererProps || []).length; va++) {
    myNetGain += (BOARD_DATA[offer.offererProps[va]].price || 0) * 0.9;
  }
  for (var vb = 0; vb < (offer.receiverProps || []).length; vb++) {
    var lostProp = offer.receiverProps[vb];
    var lostSpace = BOARD_DATA[lostProp];
    var lostGroupInfo = this.groupOwnership(lostSpace.group || '');
    var multiplier = 1.0;
    if (lostGroupInfo.owned >= 2) multiplier = 1.5; // Our group progress makes it more valuable
    myNetGain -= (lostSpace.price || 0) * multiplier;
  }

  return myNetGain >= 0;
};


/* ═══════════════════════════════════════════════════════════════
   BotManager — orchestrates all bots in a game
   ═══════════════════════════════════════════════════════════════ */
function BotManager(engine, client) {
  this.engine = engine;
  this.client = client;
  this.bots = {};        // seatIndex -> MonopolyBot
  this._processing = {};  // seatIndex -> true if currently processing
  this._tickInterval = null;
  this._turnNumber = 0;
}

/* ── Add a bot to the game ── */
BotManager.prototype.addBot = function(seatIndex, difficulty, name) {
  var bot = new MonopolyBot(seatIndex, difficulty || 'easy', this.engine);
  bot.name = name || BOT_NAMES[Object.keys(this.bots).length % BOT_NAMES.length];

  // Assign character from remaining CHARACTERS
  var usedChars = {};
  var players = this.engine.players;
  for (var i = 0; i < players.length; i++) {
    if (players[i].characterId) usedChars[players[i].characterId] = true;
  }
  for (var seat in this.bots) {
    if (this.bots.hasOwnProperty(seat) && this.bots[seat].characterId) {
      usedChars[this.bots[seat].characterId] = true;
    }
  }
  for (var c = 0; c < CHARACTERS.length; c++) {
    if (!usedChars[CHARACTERS[c].id]) {
      bot.characterId = CHARACTERS[c].id;
      break;
    }
  }

  this.bots[seatIndex] = bot;
  botLog('Added ' + bot.name + ' (seat ' + seatIndex + ', ' + difficulty + ') char=' + bot.characterId);
  return bot;
};

/* ── Remove a bot ── */
BotManager.prototype.removeBot = function(seatIndex) {
  if (this.bots[seatIndex]) {
    botLog('Removed bot at seat ' + seatIndex);
    delete this.bots[seatIndex];
    delete this._processing[seatIndex];
  }
};

/* ── Check if a seat is a bot ── */
BotManager.prototype.isBot = function(seatIndex) {
  return !!this.bots[seatIndex];
};

/* ── Get all bots ── */
BotManager.prototype.getBots = function() {
  var list = [];
  for (var seat in this.bots) {
    if (this.bots.hasOwnProperty(seat)) {
      list.push(this.bots[seat]);
    }
  }
  return list;
};

/* ── Start the tick loop ── */
BotManager.prototype.startTicking = function() {
  if (this._tickInterval) return;
  var self = this;
  this._tickInterval = setInterval(function() {
    self.tickBots();
  }, 1000);
  botLog('Bot tick loop started');
};

/* ── Stop the tick loop ── */
BotManager.prototype.stopTicking = function() {
  if (this._tickInterval) {
    clearInterval(this._tickInterval);
    this._tickInterval = null;
    botLog('Bot tick loop stopped');
  }
};

/* ── Main tick — called every second ── */
BotManager.prototype.tickBots = function() {
  var currentTurn = this.engine.currentTurn;
  var phase = this.engine.gamePhase;

  // Only act if it's a bot's turn and not already processing
  if (!this.isBot(currentTurn)) return;
  if (this._processing[currentTurn]) return;

  var player = this.engine.getPlayer(currentTurn);
  if (!player || player.bankrupt) return;

  // Check if game is over
  var winner = this.engine.checkWinner();
  if (winner) return;

  var self = this;

  if (phase === 'rolling') {
    this._processing[currentTurn] = true;
    setTimeout(function() {
      self.handleBotTurn(currentTurn);
    }, botDelay());
  } else if (phase === 'action') {
    // Bot can build, unmortgage, trade, or end turn
    this._processing[currentTurn] = true;
    setTimeout(function() {
      self._handleBotPostRoll(currentTurn);
    }, botDelay(800, 2000));
  }
};

/* ══════════════════════════════════════
   FULL TURN LOGIC
   ══════════════════════════════════════ */
BotManager.prototype.handleBotTurn = function(seatIndex) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player || player.bankrupt) {
    this._processing[seatIndex] = false;
    return;
  }

  var self = this;

  // Handle jail
  if (player.inJail) {
    this.handleBotJail(seatIndex);
    return;
  }

  // Roll dice (via server)
  botLog(player.name + ' rolling dice...');
  this.client.socket.emit('game-action', { action: 'roll-dice' });
  // The dice result comes back through _onDiceRolled which calls handleMyRoll
  // We intercept this in _onBotDiceRolled
};

/* ── Handle dice result for a bot ── */
BotManager.prototype.handleBotDiceResult = function(seatIndex, data) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player) {
    this._processing[seatIndex] = false;
    return;
  }

  var self = this;
  var d1 = data.die1;
  var d2 = data.die2;
  var total = d1 + d2;

  this.engine.lastDice = { die1: d1, die2: d2, total: total, doubles: d1 === d2 };

  // Jail roll
  if (player.inJail) {
    var jailResult = this.engine.tryJailRoll(seatIndex, d1, d2);
    if (jailResult.freed) {
      if (jailResult.forcePay) {
        this._botLog(seatIndex, player.name + ' failed 3 jail rolls, paid $50');
      } else {
        this._botLog(seatIndex, player.name + ' rolled doubles and escaped jail!');
      }
      var mr = this.engine.movePlayer(seatIndex, total);
      if (mr.passedGo) this._botLog(seatIndex, player.name + ' passed GO! +$200');
      this._syncAndRender();
      // Handle landing after delay
      setTimeout(function() {
        self.handleBotLanding(seatIndex, mr.newPos);
      }, botDelay(500, 1200));
    } else {
      this._botLog(seatIndex, player.name + ' failed to escape jail (' + d1 + '+' + d2 + ')');
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      setTimeout(function() {
        self._botEndTurn(seatIndex);
      }, botDelay(500, 1000));
    }
    return;
  }

  // Doubles logic
  if (d1 === d2) {
    this.engine.doublesCount++;
    if (this.engine.doublesCount >= 3) {
      this._botLog(seatIndex, player.name + ' rolled 3 doubles! Go to Jail!');
      this.engine.sendToJail(seatIndex);
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      setTimeout(function() {
        self._botEndTurn(seatIndex);
      }, botDelay(500, 1000));
      return;
    }
  }

  // Normal move
  var mr2 = this.engine.movePlayer(seatIndex, total);
  if (mr2.passedGo) this._botLog(seatIndex, player.name + ' passed GO! +$200');
  this._botLog(seatIndex, player.name + ' rolled ' + d1 + '+' + d2 + '=' + total + ', landed on ' + BOARD_DATA[mr2.newPos].name);
  this._syncAndRender();

  // Handle landing after a short delay
  setTimeout(function() {
    self.handleBotLanding(seatIndex, mr2.newPos);
  }, botDelay(500, 1500));
};

/* ══════════════════════════════════════
   JAIL HANDLING
   ══════════════════════════════════════ */
BotManager.prototype.handleBotJail = function(seatIndex) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player) {
    this._processing[seatIndex] = false;
    return;
  }

  var self = this;
  var decision = bot.decideJail();
  botLog(player.name + ' jail decision: ' + decision);

  if (decision === 'card' && player.getOutOfJailCards > 0) {
    this.engine.useJailCard(seatIndex);
    this._botLog(seatIndex, player.name + ' used Get Out of Jail card');
    this.client.broadcastAction('jail-action', { seat: seatIndex, type: 'use-card' });
    this._syncAndRender();
    this.engine.gamePhase = 'rolling';
    // Now roll normally
    setTimeout(function() {
      self._processing[seatIndex] = false; // Allow tick to pick up rolling phase
    }, botDelay(500, 1000));
    return;
  }

  if (decision === 'pay' && player.money >= 50) {
    this.engine.payJailFine(seatIndex);
    this._botLog(seatIndex, player.name + ' paid $50 jail fine');
    this.client.broadcastAction('jail-action', { seat: seatIndex, type: 'pay-fine' });
    this._syncAndRender();
    this.engine.gamePhase = 'rolling';
    setTimeout(function() {
      self._processing[seatIndex] = false;
    }, botDelay(500, 1000));
    return;
  }

  // Roll for doubles
  botLog(player.name + ' rolling for doubles in jail...');
  this.client.socket.emit('game-action', { action: 'roll-dice' });
  // Result handled in handleBotDiceResult
};

/* ══════════════════════════════════════
   LANDING HANDLING
   ══════════════════════════════════════ */
BotManager.prototype.handleBotLanding = function(seatIndex, pos) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player) {
    this._processing[seatIndex] = false;
    return;
  }

  var self = this;
  var space = BOARD_DATA[pos];
  this.engine.gamePhase = 'landed';

  switch (space.type) {
    case 'property':
    case 'railroad':
    case 'utility':
      var owner = this.engine.getPropertyOwner(pos);
      if (owner === null) {
        // Unowned - decide to buy
        if (player.money >= space.price && bot.decideBuy(pos)) {
          var ok = this.engine.buyProperty(seatIndex, pos);
          if (ok) {
            this._botLog(seatIndex, player.name + ' bought ' + space.name + ' for $' + space.price);
            this.client.broadcastAction('property-bought', { seat: seatIndex, pos: pos });
          }
        } else {
          this._botLog(seatIndex, player.name + ' passed on ' + space.name);
        }
        this.engine.gamePhase = 'action';
        this._syncAndRender();
      } else if (owner !== seatIndex) {
        // Pay rent
        var ps = this.engine.propertyState[pos];
        var ownerPlayer = this.engine.getPlayer(owner);
        if (ps && ps.mortgaged) {
          this._botLog(seatIndex, space.name + ' is mortgaged, no rent');
        } else if (ownerPlayer && ownerPlayer.inJail) {
          this._botLog(seatIndex, space.name + ' owner is in jail, no rent');
        } else {
          var rent = this.engine.calculateRent(pos, this.engine.lastDice.total);
          // Handle insufficient funds
          if (player.money < rent) {
            this._botRaiseCash(seatIndex, rent);
          }
          player.money -= rent;
          if (ownerPlayer) ownerPlayer.money += rent;
          this._botLog(seatIndex, player.name + ' paid $' + rent + ' rent to ' + (ownerPlayer ? ownerPlayer.name : 'bank'));
          this.client.broadcastAction('rent-paid', { seat: seatIndex, creditor: owner, amount: rent, pos: pos });

          // Check bankruptcy
          if (player.money < 0 && this.engine.isBankrupt(seatIndex)) {
            this._botGoBankrupt(seatIndex, owner);
            return;
          }
        }
        this.engine.gamePhase = 'action';
        this._syncAndRender();
      } else {
        // Own property
        this.engine.gamePhase = 'action';
        this._syncAndRender();
      }
      break;

    case 'tax':
      var taxAmount = space.price;
      if (player.money < taxAmount) {
        this._botRaiseCash(seatIndex, taxAmount);
      }
      this.engine.payTax(seatIndex, pos);
      this._botLog(seatIndex, player.name + ' paid $' + taxAmount + ' tax');
      if (player.money < 0 && this.engine.isBankrupt(seatIndex)) {
        this._botGoBankrupt(seatIndex, null);
        return;
      }
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      break;

    case 'chance':
      var chCard = this.engine.drawChance();
      this._botLog(seatIndex, player.name + ' drew Chance: ' + chCard.text);
      var chResult = this.engine.executeCard(seatIndex, chCard);
      this.client.broadcastAction('drew-card', { seat: seatIndex, cardType: 'chance', card: chCard, result: chResult });

      if (chCard.action === 'go-to-jail') {
        this.engine.gamePhase = 'action';
        this._syncAndRender();
        setTimeout(function() { self._botEndTurn(seatIndex); }, botDelay(500, 1000));
        return;
      }
      if (chCard.action === 'move-to' || chCard.action === 'move-back' ||
          chCard.action === 'nearest-railroad' || chCard.action === 'nearest-utility') {
        this._syncAndRender();
        setTimeout(function() {
          self.handleBotLanding(seatIndex, player.position);
        }, botDelay(500, 1200));
        return;
      }
      // Pay/collect/repairs - check bankruptcy
      if (player.money < 0) {
        if (this.engine.isBankrupt(seatIndex)) {
          this._botGoBankrupt(seatIndex, null);
          return;
        }
        this._botRaiseCash(seatIndex, 0);
      }
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      break;

    case 'chest':
      var ccCard = this.engine.drawChest();
      this._botLog(seatIndex, player.name + ' drew Community Chest: ' + ccCard.text);
      var ccResult = this.engine.executeCard(seatIndex, ccCard);
      this.client.broadcastAction('drew-card', { seat: seatIndex, cardType: 'chest', card: ccCard, result: ccResult });

      if (ccCard.action === 'go-to-jail') {
        this.engine.gamePhase = 'action';
        this._syncAndRender();
        setTimeout(function() { self._botEndTurn(seatIndex); }, botDelay(500, 1000));
        return;
      }
      if (ccCard.action === 'move-to' || ccCard.action === 'move-back') {
        this._syncAndRender();
        setTimeout(function() {
          self.handleBotLanding(seatIndex, player.position);
        }, botDelay(500, 1200));
        return;
      }
      if (player.money < 0) {
        if (this.engine.isBankrupt(seatIndex)) {
          this._botGoBankrupt(seatIndex, null);
          return;
        }
        this._botRaiseCash(seatIndex, 0);
      }
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      break;

    case 'go-to-jail':
      this.engine.sendToJail(seatIndex);
      this._botLog(seatIndex, player.name + ' was sent to Jail!');
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      setTimeout(function() { self._botEndTurn(seatIndex); }, botDelay(500, 1000));
      return;

    case 'free-parking':
      var fpAmount = this.engine.collectFreeParking(seatIndex);
      if (fpAmount > 0) {
        this._botLog(seatIndex, player.name + ' collected $' + fpAmount + ' from Free Parking!');
        this.client.broadcastAction('free-parking', { seat: seatIndex, amount: fpAmount });
      }
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      break;

    case 'go':
    case 'jail':
    default:
      this.engine.gamePhase = 'action';
      this._syncAndRender();
      break;
  }

  // After landing resolution, proceed to post-roll actions
  if (this.engine.gamePhase === 'action') {
    setTimeout(function() {
      self._handleBotPostRoll(seatIndex);
    }, botDelay(800, 2000));
  }
};

/* ══════════════════════════════════════
   POST-ROLL ACTIONS (build, unmortgage, trade, end turn)
   ══════════════════════════════════════ */
BotManager.prototype._handleBotPostRoll = function(seatIndex) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player || player.bankrupt) {
    this._processing[seatIndex] = false;
    this._botEndTurn(seatIndex);
    return;
  }

  var self = this;
  var actionsLeft = [];

  // 1. Unmortgage properties if affordable
  var unmortgages = bot.decideUnmortgage();
  if (unmortgages.length > 0) {
    for (var u = 0; u < unmortgages.length; u++) {
      var uPos = unmortgages[u];
      if (this.engine.unmortgageProperty(seatIndex, uPos)) {
        this._botLog(seatIndex, player.name + ' unmortgaged ' + BOARD_DATA[uPos].name);
        this.client.broadcastAction('mortgage-action', { seat: seatIndex, pos: uPos, type: 'unmortgage' });
      }
    }
    this._syncAndRender();
  }

  // 2. Build houses
  var builds = bot.decideBuild();
  if (builds.length > 0) {
    actionsLeft.push({ type: 'build', positions: builds, idx: 0 });
  }

  // 3. Trade (medium/hard only)
  var tradeOffer = bot.decideTrade();
  if (tradeOffer) {
    actionsLeft.push({ type: 'trade', offer: tradeOffer });
  }

  // Execute actions sequentially with delays
  this._executeBotActions(seatIndex, actionsLeft, 0);
};

BotManager.prototype._executeBotActions = function(seatIndex, actions, idx) {
  var self = this;
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);

  if (!bot || !player || idx >= actions.length) {
    // All actions done, end turn
    setTimeout(function() {
      self._botEndTurn(seatIndex);
    }, botDelay(500, 1500));
    return;
  }

  var action = actions[idx];

  if (action.type === 'build') {
    this._executeBotBuilds(seatIndex, action.positions, 0, function() {
      self._executeBotActions(seatIndex, actions, idx + 1);
    });
    return;
  }

  if (action.type === 'trade') {
    this._executeBotTrade(seatIndex, action.offer, function() {
      self._executeBotActions(seatIndex, actions, idx + 1);
    });
    return;
  }

  // Unknown action type, skip
  this._executeBotActions(seatIndex, actions, idx + 1);
};

BotManager.prototype._executeBotBuilds = function(seatIndex, positions, idx, callback) {
  var self = this;
  var player = this.engine.getPlayer(seatIndex);

  if (!player || idx >= positions.length) {
    if (callback) callback();
    return;
  }

  var pos = positions[idx];
  setTimeout(function() {
    if (self.engine.canBuildOn(seatIndex, pos)) {
      if (self.engine.buildHouse(seatIndex, pos)) {
        self._botLog(seatIndex, player.name + ' built on ' + BOARD_DATA[pos].name);
        self.client.broadcastAction('built-house', { seat: seatIndex, pos: pos });
        self._syncAndRender();
      }
    }
    self._executeBotBuilds(seatIndex, positions, idx + 1, callback);
  }, botDelay(400, 800));
};

BotManager.prototype._executeBotTrade = function(seatIndex, offer, callback) {
  var self = this;
  var player = this.engine.getPlayer(seatIndex);
  if (!player) { if (callback) callback(); return; }

  var receiverSeat = offer.receiver;

  // If receiver is also a bot, auto-evaluate
  if (this.isBot(receiverSeat)) {
    var receiverBot = this.bots[receiverSeat];
    var tradeData = {
      offerer: seatIndex,
      receiver: receiverSeat,
      offererCash: offer.offererCash || 0,
      receiverCash: offer.receiverCash || 0,
      offererProps: offer.offererProps || [],
      receiverProps: offer.receiverProps || []
    };

    setTimeout(function() {
      var accepted = receiverBot.evaluateTradeOffer(tradeData);
      if (accepted) {
        self.engine.executeTrade(
          tradeData.offerer, tradeData.receiver,
          tradeData.offererCash, tradeData.receiverCash,
          tradeData.offererProps, tradeData.receiverProps
        );
        self._botLog(seatIndex, player.name + ' traded with ' + self.engine.getPlayer(receiverSeat).name + ' — accepted!');
        self.client.broadcastAction('trade-accepted', tradeData);
        self._syncAndRender();
      } else {
        self._botLog(seatIndex, player.name + ' trade with ' + self.engine.getPlayer(receiverSeat).name + ' — rejected');
        self.client.broadcastAction('trade-rejected', tradeData);
      }
      if (callback) callback();
    }, botDelay(1000, 2000));
    return;
  }

  // Receiver is a human - send trade offer through normal system
  var tradePayload = {
    offerer: seatIndex,
    receiver: receiverSeat,
    offererCash: offer.offererCash || 0,
    receiverCash: offer.receiverCash || 0,
    offererProps: offer.offererProps || [],
    receiverProps: offer.receiverProps || [],
    offererName: player.name
  };
  this._botLog(seatIndex, player.name + ' sent trade offer to ' + (this.engine.getPlayer(receiverSeat) || {}).name);
  this.client.broadcastAction('trade-offer', tradePayload);

  // Don't wait for response — continue turn
  if (callback) setTimeout(callback, botDelay(500, 1000));
};

/* ══════════════════════════════════════
   AUCTION HANDLING
   ══════════════════════════════════════ */
BotManager.prototype.handleBotAuction = function(seatIndex, pos, currentBid) {
  var bot = this.bots[seatIndex];
  if (!bot) return 0;
  return bot.decideAuctionBid(pos, currentBid);
};

/* ══════════════════════════════════════
   CASH MANAGEMENT (sell houses, mortgage to raise cash)
   ══════════════════════════════════════ */
BotManager.prototype._botRaiseCash = function(seatIndex, neededCash) {
  var bot = this.bots[seatIndex];
  var player = this.engine.getPlayer(seatIndex);
  if (!bot || !player) return;

  var target = Math.max(neededCash, 0);

  // First sell houses
  var sellList = bot.decideSellHouses(target);
  for (var s = 0; s < sellList.length; s++) {
    if (player.money >= target) break;
    if (this.engine.sellHouse(seatIndex, sellList[s])) {
      this._botLog(seatIndex, player.name + ' sold house on ' + BOARD_DATA[sellList[s]].name);
      this.client.broadcastAction('sold-house', { seat: seatIndex, pos: sellList[s] });
    }
  }

  // Then mortgage properties
  if (player.money < target) {
    var mortgageList = bot.decideMortgage(target);
    for (var m = 0; m < mortgageList.length; m++) {
      if (player.money >= target) break;
      if (this.engine.mortgageProperty(seatIndex, mortgageList[m])) {
        this._botLog(seatIndex, player.name + ' mortgaged ' + BOARD_DATA[mortgageList[m]].name);
        this.client.broadcastAction('mortgage-action', { seat: seatIndex, pos: mortgageList[m], type: 'mortgage' });
      }
    }
  }

  this._syncAndRender();
};

/* ══════════════════════════════════════
   BANKRUPTCY
   ══════════════════════════════════════ */
BotManager.prototype._botGoBankrupt = function(seatIndex, creditorSeat) {
  var player = this.engine.getPlayer(seatIndex);
  this.engine.declareBankruptcy(seatIndex, creditorSeat);
  this._botLog(seatIndex, (player ? player.name : 'Bot') + ' went bankrupt!');
  this.client.broadcastAction('went-bankrupt', { seat: seatIndex, creditor: creditorSeat });
  this._syncAndRender();

  var winner = this.engine.checkWinner();
  if (winner) {
    this.client.showGameOverModal(winner);
  } else {
    this._botEndTurn(seatIndex);
  }
};

/* ══════════════════════════════════════
   END TURN
   ══════════════════════════════════════ */
BotManager.prototype._botEndTurn = function(seatIndex) {
  this._processing[seatIndex] = false;

  // Check for doubles (roll again)
  if (this.engine.lastDice.doubles && !this.engine.currentPlayer().inJail &&
      this.engine.doublesCount < 3 && this.engine.doublesCount > 0) {
    this.engine.gamePhase = 'rolling';
    this._botLog(seatIndex, 'Doubles! Rolling again.');
    this._syncAndRender();
    return; // Tick loop will pick it up
  }

  // End turn via server
  this.client.socket.emit('game-action', { action: 'end-turn', payload: { seat: seatIndex } });
  this.engine.gamePhase = 'waiting';
  this._syncAndRender();
};

/* ══════════════════════════════════════
   UTILITY METHODS
   ══════════════════════════════════════ */
BotManager.prototype._syncAndRender = function() {
  this.client.syncState();
  this.client.renderGame();
};

BotManager.prototype._botLog = function(seatIndex, msg) {
  botLog(msg);
  if (this.client && this.client.addLog) {
    this.client.addLog(msg);
  }
};

/* ══════════════════════════════════════
   INTEGRATION HOOK: Handle trade offers directed at bots
   Call this from the client's game-action handler for 'trade-offer'
   ══════════════════════════════════════ */
BotManager.prototype.handleIncomingTradeForBot = function(offer) {
  var receiverSeat = offer.receiver;
  if (!this.isBot(receiverSeat)) return false;

  var bot = this.bots[receiverSeat];
  var self = this;

  // Deliberate with delay
  setTimeout(function() {
    var accepted = bot.evaluateTradeOffer(offer);
    if (accepted) {
      self.engine.executeTrade(
        offer.offerer, offer.receiver,
        offer.offererCash, offer.receiverCash,
        offer.offererProps, offer.receiverProps
      );
      self._botLog(receiverSeat, bot.name + ' accepted the trade!');
      self.client.broadcastAction('trade-accepted', offer);
      self._syncAndRender();
    } else {
      self._botLog(receiverSeat, bot.name + ' rejected the trade.');
      self.client.broadcastAction('trade-rejected', {
        offerer: offer.offerer,
        receiver: offer.receiver
      });
    }
  }, botDelay(1500, 3000));

  return true; // Indicates we handled it
};

/* ══════════════════════════════════════
   DICE INTEGRATION HOOK
   Called when dice-rolled event fires for a bot seat.
   The host intercepts the normal dice handler and routes here instead.
   ══════════════════════════════════════ */
BotManager.prototype.handleDiceRolledForBot = function(data) {
  var seatIndex = data.seatIndex;
  if (!this.isBot(seatIndex)) return false;

  var self = this;

  // Animate dice on host screen, then process
  this.client.animateDice(data.die1, data.die2, function() {
    self.handleBotDiceResult(seatIndex, data);
  });

  return true; // Indicates we handled it
};


/* ──────────────────────────────────────
   GLOBAL EXPORTS
   ────────────────────────────────────── */
window.MonopolyBot = MonopolyBot;
window.BotManager = BotManager;
