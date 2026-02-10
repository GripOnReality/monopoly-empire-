/* ============================================================
   MONOPOLY GAME CLIENT - game.js
   Complete multiplayer Monopoly with Socket.IO state sync
   ============================================================ */

// --- DOM Helpers ---
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// --- Session Persistence ---
function saveSession(data) {
  try { localStorage.setItem('monopoly_session', JSON.stringify(data)); } catch (e) { /* ignore */ }
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem('monopoly_session')); } catch (e) { return null; }
}
function clearSession() {
  try { localStorage.removeItem('monopoly_session'); } catch (e) { /* ignore */ }
}

// --- Toast ---
function showToast(msg, duration) {
  if (duration === undefined) duration = 3000;
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
    background: '#222', color: '#fff', padding: '10px 24px', borderRadius: '8px',
    zIndex: '10000', fontSize: '14px', boxShadow: '0 4px 16px rgba(0,0,0,.3)',
    pointerEvents: 'none', transition: 'opacity .3s'
  });
  document.body.appendChild(t);
  setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, duration);
}

// --- Screen Switcher ---
function showScreen(id) {
  $$('.screen').forEach(function (s) { s.classList.remove('active'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// --- Player Colors & Tokens ---
var PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

function makeToken(seatIndex, small) {
  var d = document.createElement('div');
  d.className = 'player-token' + (small ? ' token-small' : '');
  var sz = small ? 18 : 24;
  Object.assign(d.style, {
    width: sz + 'px', height: sz + 'px', borderRadius: '50%',
    background: PLAYER_COLORS[seatIndex] || '#888',
    color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: (small ? 10 : 12) + 'px', fontWeight: 'bold',
    border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.4)',
    lineHeight: '1', flexShrink: '0', margin: '1px'
  });
  d.textContent = String(seatIndex + 1);
  d.dataset.seat = seatIndex;
  return d;
}

// --- HTML escape helper ---
function escHtml(str) {
  var d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// ================================================================
//  BOARD DATA (Standard US Monopoly – 40 spaces)
// ================================================================
var BOARD_DATA = [
  { pos: 0,  name: 'GO',                    type: 'go' },
  { pos: 1,  name: 'Mediterranean Avenue',  type: 'property', group: 'brown',     price: 60,  rent: [2,10,30,90,160,250],     houseCost: 50,  mortgage: 30 },
  { pos: 2,  name: 'Community Chest',       type: 'chest' },
  { pos: 3,  name: 'Baltic Avenue',         type: 'property', group: 'brown',     price: 60,  rent: [4,20,60,180,320,450],     houseCost: 50,  mortgage: 30 },
  { pos: 4,  name: 'Income Tax',            type: 'tax', amount: 200 },
  { pos: 5,  name: 'Reading Railroad',      type: 'railroad', price: 200, mortgage: 100 },
  { pos: 6,  name: 'Oriental Avenue',       type: 'property', group: 'lightblue', price: 100, rent: [6,30,90,270,400,550],     houseCost: 50,  mortgage: 50 },
  { pos: 7,  name: 'Chance',                type: 'chance' },
  { pos: 8,  name: 'Vermont Avenue',        type: 'property', group: 'lightblue', price: 100, rent: [6,30,90,270,400,550],     houseCost: 50,  mortgage: 50 },
  { pos: 9,  name: 'Connecticut Avenue',    type: 'property', group: 'lightblue', price: 120, rent: [8,40,100,300,450,600],    houseCost: 50,  mortgage: 60 },
  { pos: 10, name: 'Jail / Just Visiting',  type: 'jail' },
  { pos: 11, name: 'St. Charles Place',     type: 'property', group: 'pink',      price: 140, rent: [10,50,150,450,625,750],   houseCost: 100, mortgage: 70 },
  { pos: 12, name: 'Electric Company',      type: 'utility',  price: 150, mortgage: 75 },
  { pos: 13, name: 'States Avenue',         type: 'property', group: 'pink',      price: 140, rent: [10,50,150,450,625,750],   houseCost: 100, mortgage: 70 },
  { pos: 14, name: 'Virginia Avenue',       type: 'property', group: 'pink',      price: 160, rent: [12,60,180,500,700,900],   houseCost: 100, mortgage: 80 },
  { pos: 15, name: 'Pennsylvania Railroad', type: 'railroad', price: 200, mortgage: 100 },
  { pos: 16, name: 'St. James Place',       type: 'property', group: 'orange',    price: 180, rent: [14,70,200,550,750,950],   houseCost: 100, mortgage: 90 },
  { pos: 17, name: 'Community Chest',       type: 'chest' },
  { pos: 18, name: 'Tennessee Avenue',      type: 'property', group: 'orange',    price: 180, rent: [14,70,200,550,750,950],   houseCost: 100, mortgage: 90 },
  { pos: 19, name: 'New York Avenue',       type: 'property', group: 'orange',    price: 200, rent: [16,80,220,600,800,1000],  houseCost: 100, mortgage: 100 },
  { pos: 20, name: 'Free Parking',          type: 'free-parking' },
  { pos: 21, name: 'Kentucky Avenue',       type: 'property', group: 'red',       price: 220, rent: [18,90,250,700,875,1050],  houseCost: 150, mortgage: 110 },
  { pos: 22, name: 'Chance',                type: 'chance' },
  { pos: 23, name: 'Indiana Avenue',        type: 'property', group: 'red',       price: 220, rent: [18,90,250,700,875,1050],  houseCost: 150, mortgage: 110 },
  { pos: 24, name: 'Illinois Avenue',       type: 'property', group: 'red',       price: 240, rent: [20,100,300,750,925,1100], houseCost: 150, mortgage: 120 },
  { pos: 25, name: 'B&O Railroad',          type: 'railroad', price: 200, mortgage: 100 },
  { pos: 26, name: 'Atlantic Avenue',       type: 'property', group: 'yellow',    price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgage: 130 },
  { pos: 27, name: 'Ventnor Avenue',        type: 'property', group: 'yellow',    price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgage: 130 },
  { pos: 28, name: 'Water Works',           type: 'utility',  price: 150, mortgage: 75 },
  { pos: 29, name: 'Marvin Gardens',        type: 'property', group: 'yellow',    price: 280, rent: [24,120,360,850,1025,1200],houseCost: 150, mortgage: 140 },
  { pos: 30, name: 'Go To Jail',            type: 'go-to-jail' },
  { pos: 31, name: 'Pacific Avenue',        type: 'property', group: 'green',     price: 300, rent: [26,130,390,900,1100,1275],houseCost: 200, mortgage: 150 },
  { pos: 32, name: 'North Carolina Avenue', type: 'property', group: 'green',     price: 300, rent: [26,130,390,900,1100,1275],houseCost: 200, mortgage: 150 },
  { pos: 33, name: 'Community Chest',       type: 'chest' },
  { pos: 34, name: 'Pennsylvania Avenue',   type: 'property', group: 'green',     price: 320, rent: [28,150,450,1000,1200,1400],houseCost: 200,mortgage: 160 },
  { pos: 35, name: 'Short Line',            type: 'railroad', price: 200, mortgage: 100 },
  { pos: 36, name: 'Chance',                type: 'chance' },
  { pos: 37, name: 'Park Place',            type: 'property', group: 'darkblue',  price: 350, rent: [35,175,500,1100,1300,1500],houseCost: 200,mortgage: 175 },
  { pos: 38, name: 'Luxury Tax',            type: 'tax', amount: 100 },
  { pos: 39, name: 'Boardwalk',             type: 'property', group: 'darkblue',  price: 400, rent: [50,200,600,1400,1700,2000],houseCost: 200,mortgage: 200 }
];

// Color-group membership lookup
var COLOR_GROUPS = {};
BOARD_DATA.forEach(function (s) {
  if (s.group) {
    if (!COLOR_GROUPS[s.group]) COLOR_GROUPS[s.group] = [];
    COLOR_GROUPS[s.group].push(s.pos);
  }
});
var RAILROAD_POSITIONS = [5, 15, 25, 35];
var UTILITY_POSITIONS  = [12, 28];

// ================================================================
//  CHANCE CARDS
// ================================================================
var CHANCE_CARDS = [
  { text: 'Advance to Boardwalk.', action: { type: 'move-to', dest: 39 } },
  { text: 'Advance to Go. Collect $200.', action: { type: 'move-to', dest: 0 } },
  { text: 'Advance to Illinois Avenue. If you pass Go, collect $200.', action: { type: 'move-to', dest: 24 } },
  { text: 'Advance to St. Charles Place. If you pass Go, collect $200.', action: { type: 'move-to', dest: 11 } },
  { text: 'Advance to the nearest Railroad. Pay owner twice the rental.', action: { type: 'nearest-railroad-2x' } },
  { text: 'Advance to the nearest Railroad. Pay owner twice the rental.', action: { type: 'nearest-railroad-2x' } },
  { text: 'Advance to the nearest Utility. If unowned you may buy it; if owned throw dice and pay owner 10\u00d7 the amount thrown.', action: { type: 'nearest-utility-10x' } },
  { text: 'Bank pays you dividend of $50.', action: { type: 'collect', amount: 50 } },
  { text: 'Get Out of Jail Free.', action: { type: 'get-out-of-jail' } },
  { text: 'Go Back 3 Spaces.', action: { type: 'move-back', spaces: 3 } },
  { text: 'Go to Jail. Do not pass Go, do not collect $200.', action: { type: 'go-to-jail' } },
  { text: 'Make general repairs on all your property: $25 per house, $100 per hotel.', action: { type: 'repairs', perHouse: 25, perHotel: 100 } },
  { text: 'Speeding fine $15.', action: { type: 'pay', amount: 15 } },
  { text: 'Take a trip to Reading Railroad. If you pass Go, collect $200.', action: { type: 'move-to', dest: 5 } },
  { text: 'You have been elected Chairman of the Board. Pay each player $50.', action: { type: 'pay-each', amount: 50 } },
  { text: 'Your building loan matures. Collect $150.', action: { type: 'collect', amount: 150 } }
];

// ================================================================
//  COMMUNITY CHEST CARDS
// ================================================================
var COMMUNITY_CHEST = [
  { text: 'Advance to Go. Collect $200.', action: { type: 'move-to', dest: 0 } },
  { text: 'Bank error in your favor. Collect $200.', action: { type: 'collect', amount: 200 } },
  { text: "Doctor\u2019s fees. Pay $50.", action: { type: 'pay', amount: 50 } },
  { text: 'From sale of stock you get $50.', action: { type: 'collect', amount: 50 } },
  { text: 'Get Out of Jail Free.', action: { type: 'get-out-of-jail' } },
  { text: 'Go to Jail. Do not pass Go, do not collect $200.', action: { type: 'go-to-jail' } },
  { text: 'Holiday fund matures. Receive $100.', action: { type: 'collect', amount: 100 } },
  { text: 'Income tax refund. Collect $20.', action: { type: 'collect', amount: 20 } },
  { text: 'It is your birthday. Collect $10 from every player.', action: { type: 'collect-each', amount: 10 } },
  { text: 'Life insurance matures. Collect $100.', action: { type: 'collect', amount: 100 } },
  { text: 'Pay hospital fees of $100.', action: { type: 'pay', amount: 100 } },
  { text: 'Pay school fees of $50.', action: { type: 'pay', amount: 50 } },
  { text: 'Receive $25 consultancy fee.', action: { type: 'collect', amount: 25 } },
  { text: 'You are assessed for street repairs: $40 per house, $115 per hotel.', action: { type: 'repairs', perHouse: 40, perHotel: 115 } },
  { text: 'You have won second prize in a beauty contest. Collect $10.', action: { type: 'collect', amount: 10 } },
  { text: 'You inherit $100.', action: { type: 'collect', amount: 100 } }
];

// --- Shuffle helper ---
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// ================================================================
//  MONOPOLY ENGINE  (runs client-side on the active-turn player)
// ================================================================
function MonopolyEngine() {
  this.reset();
}

MonopolyEngine.prototype.reset = function () {
  this.players = [];
  this.currentTurn = 0;
  this.propertyState = {};      // pos -> {owner,houses,mortgaged}
  this.housesAvailable = 32;
  this.hotelsAvailable = 12;
  this.freeParkingPot = 0;
  this.turnNumber = 0;
  this.gamePhase = 'waiting';   // waiting|rolling|animating|landed|action|end
  this.lastDice = { die1: 0, die2: 0, total: 0, doubles: false };
  this.doublesCount = 0;
  this.chanceDeck = shuffle(CHANCE_CARDS);
  this.chestDeck  = shuffle(COMMUNITY_CHEST);
  this.chanceIndex = 0;
  this.chestIndex  = 0;
};

/* ---------- state I/O ---------- */

MonopolyEngine.prototype.initFromState = function (gs) {
  if (!gs) return;
  var self = this;
  if (gs.currentTurn != null) this.currentTurn = gs.currentTurn;
  this.players = (gs.players || []).map(function (p, i) {
    return {
      id: p.id, name: p.name,
      seatIndex: p.seatIndex != null ? p.seatIndex : i,
      color: p.color || PLAYER_COLORS[i],
      position: p.position != null ? p.position : 0,
      money: p.money != null ? p.money : 1500,
      properties: p.properties ? p.properties.slice() : [],
      inJail: !!p.inJail, jailTurns: p.jailTurns || 0,
      getOutOfJailCards: p.getOutOfJailCards || 0,
      bankrupt: !!p.bankrupt,
      connected: p.connected != null ? p.connected : true
    };
  });
  if (gs.propertyState)      this.propertyState  = JSON.parse(JSON.stringify(gs.propertyState));
  if (gs.housesAvailable != null) this.housesAvailable = gs.housesAvailable;
  if (gs.hotelsAvailable != null) this.hotelsAvailable = gs.hotelsAvailable;
  if (gs.freeParkingPot  != null) this.freeParkingPot  = gs.freeParkingPot;
  if (gs.turnNumber       != null) this.turnNumber      = gs.turnNumber;
  if (gs.gamePhase)               this.gamePhase        = gs.gamePhase;
  if (gs.lastDice)                this.lastDice         = gs.lastDice;
  if (gs.doublesCount     != null) this.doublesCount     = gs.doublesCount;
  if (gs.chanceDeck) { this.chanceDeck = gs.chanceDeck; this.chanceIndex = gs.chanceIndex || 0; }
  if (gs.chestDeck)  { this.chestDeck  = gs.chestDeck;  this.chestIndex  = gs.chestIndex  || 0; }
};

MonopolyEngine.prototype.serialise = function () {
  return {
    currentTurn: this.currentTurn,
    players: this.players.map(function (p) { var o = {}; for (var k in p) o[k] = p[k]; o.properties = p.properties.slice(); return o; }),
    propertyState: JSON.parse(JSON.stringify(this.propertyState)),
    housesAvailable: this.housesAvailable, hotelsAvailable: this.hotelsAvailable,
    freeParkingPot: this.freeParkingPot, turnNumber: this.turnNumber,
    gamePhase: this.gamePhase,
    lastDice: { die1: this.lastDice.die1, die2: this.lastDice.die2, total: this.lastDice.total, doubles: this.lastDice.doubles },
    doublesCount: this.doublesCount,
    chanceDeck: this.chanceDeck, chanceIndex: this.chanceIndex,
    chestDeck: this.chestDeck,   chestIndex: this.chestIndex
  };
};

/* ---------- helpers ---------- */

MonopolyEngine.prototype.getPlayer = function (seat) {
  for (var i = 0; i < this.players.length; i++) if (this.players[i].seatIndex === seat) return this.players[i];
  return null;
};
MonopolyEngine.prototype.currentPlayer = function () { return this.getPlayer(this.currentTurn); };
MonopolyEngine.prototype.activePlayers = function () { return this.players.filter(function (p) { return !p.bankrupt; }); };

/* ---------- movement ---------- */

MonopolyEngine.prototype.movePlayer = function (seat, steps) {
  var p = this.getPlayer(seat);
  if (!p) return { passedGo: false };
  var oldPos = p.position;
  var newPos = (oldPos + steps) % 40;
  var passedGo = (oldPos + steps >= 40) && newPos !== 0;
  p.position = newPos;
  if (passedGo || (newPos === 0 && steps > 0)) p.money += 200;
  return { passedGo: passedGo || (newPos === 0 && steps > 0), newPos: newPos };
};

MonopolyEngine.prototype.movePlayerTo = function (seat, dest, collectGo) {
  var p = this.getPlayer(seat);
  if (!p) return { passedGo: false };
  var passedGo = collectGo && dest < p.position && dest !== p.position;
  p.position = dest;
  if (passedGo) p.money += 200;
  return { passedGo: passedGo };
};

MonopolyEngine.prototype.sendToJail = function (seat) {
  var p = this.getPlayer(seat); if (!p) return;
  p.position = 10; p.inJail = true; p.jailTurns = 0;
};

/* ---------- property queries ---------- */

MonopolyEngine.prototype.getPropertyOwner = function (pos) {
  var ps = this.propertyState[pos]; return ps ? ps.owner : null;
};

MonopolyEngine.prototype.ownsFullGroup = function (seat, group) {
  var positions = COLOR_GROUPS[group]; if (!positions) return false;
  var self = this;
  return positions.every(function (p) { var ps = self.propertyState[p]; return ps && ps.owner === seat; });
};

MonopolyEngine.prototype.getOwnedRailroadCount = function (seat) {
  var self = this;
  return RAILROAD_POSITIONS.filter(function (p) { var ps = self.propertyState[p]; return ps && ps.owner === seat && !ps.mortgaged; }).length;
};

MonopolyEngine.prototype.getOwnedUtilityCount = function (seat) {
  var self = this;
  return UTILITY_POSITIONS.filter(function (p) { var ps = self.propertyState[p]; return ps && ps.owner === seat && !ps.mortgaged; }).length;
};

/* ---------- rent ---------- */

MonopolyEngine.prototype.calculateRent = function (pos, diceTotal) {
  if (!diceTotal) diceTotal = 0;
  var space = BOARD_DATA[pos];
  var ps = this.propertyState[pos];
  if (!ps || ps.owner == null || ps.mortgaged) return 0;
  if (space.type === 'railroad') { var c = this.getOwnedRailroadCount(ps.owner); return [0,25,50,100,200][c] || 0; }
  if (space.type === 'utility')  { var u = this.getOwnedUtilityCount(ps.owner); return u === 1 ? diceTotal * 4 : diceTotal * 10; }
  if (space.type === 'property') {
    var h = ps.houses || 0;
    if (h > 0) return space.rent[h];
    if (this.ownsFullGroup(ps.owner, space.group)) return space.rent[0] * 2;
    return space.rent[0];
  }
  return 0;
};

/* ---------- buy ---------- */

MonopolyEngine.prototype.buyProperty = function (seat, pos) {
  var space = BOARD_DATA[pos]; var p = this.getPlayer(seat);
  if (!p || !space.price || this.propertyState[pos] || p.money < space.price) return false;
  p.money -= space.price; p.properties.push(pos);
  this.propertyState[pos] = { owner: seat, houses: 0, mortgaged: false };
  return true;
};

/* ---------- building ---------- */

MonopolyEngine.prototype.canBuildOn = function (seat, pos) {
  var space = BOARD_DATA[pos]; if (!space || space.type !== 'property') return false;
  var ps = this.propertyState[pos]; if (!ps || ps.owner !== seat || ps.mortgaged) return false;
  if (!this.ownsFullGroup(seat, space.group)) return false;
  var gp = COLOR_GROUPS[space.group]; var self = this;
  if (gp.some(function (g) { return self.propertyState[g] && self.propertyState[g].mortgaged; })) return false;
  if (ps.houses >= 5) return false;
  var min = Math.min.apply(null, gp.map(function (g) { return (self.propertyState[g] || {}).houses || 0; }));
  if (ps.houses > min) return false;
  if (ps.houses === 4) { if (this.hotelsAvailable <= 0) return false; }
  else { if (this.housesAvailable <= 0) return false; }
  var pl = this.getPlayer(seat); if (!pl || pl.money < space.houseCost) return false;
  return true;
};

MonopolyEngine.prototype.buildHouse = function (seat, pos) {
  if (!this.canBuildOn(seat, pos)) return false;
  var space = BOARD_DATA[pos]; var ps = this.propertyState[pos]; var p = this.getPlayer(seat);
  p.money -= space.houseCost;
  if (ps.houses === 4) { ps.houses = 5; this.hotelsAvailable--; this.housesAvailable += 4; }
  else { ps.houses++; this.housesAvailable--; }
  return true;
};

MonopolyEngine.prototype.canSellHouseOn = function (seat, pos) {
  var space = BOARD_DATA[pos]; if (!space || space.type !== 'property') return false;
  var ps = this.propertyState[pos]; if (!ps || ps.owner !== seat || ps.houses <= 0) return false;
  var gp = COLOR_GROUPS[space.group]; var self = this;
  var mx = Math.max.apply(null, gp.map(function (g) { return (self.propertyState[g] || {}).houses || 0; }));
  return ps.houses >= mx;
};

MonopolyEngine.prototype.sellHouse = function (seat, pos) {
  if (!this.canSellHouseOn(seat, pos)) return false;
  var space = BOARD_DATA[pos]; var ps = this.propertyState[pos]; var p = this.getPlayer(seat);
  p.money += Math.floor(space.houseCost / 2);
  if (ps.houses === 5) { ps.houses = 4; this.hotelsAvailable++; this.housesAvailable -= 4; if (this.housesAvailable < 0) this.housesAvailable = 0; }
  else { ps.houses--; this.housesAvailable++; }
  return true;
};

/* ---------- mortgage ---------- */

MonopolyEngine.prototype.canMortgage = function (seat, pos) {
  var ps = this.propertyState[pos]; if (!ps || ps.owner !== seat || ps.mortgaged) return false;
  var space = BOARD_DATA[pos];
  if (space.group) { var gp = COLOR_GROUPS[space.group]; var self = this; if (gp.some(function (g) { return (self.propertyState[g] || {}).houses > 0; })) return false; }
  return true;
};

MonopolyEngine.prototype.mortgageProperty = function (seat, pos) {
  if (!this.canMortgage(seat, pos)) return false;
  var space = BOARD_DATA[pos]; var ps = this.propertyState[pos]; var p = this.getPlayer(seat);
  ps.mortgaged = true; p.money += space.mortgage; return true;
};

MonopolyEngine.prototype.unmortgageProperty = function (seat, pos) {
  var ps = this.propertyState[pos]; if (!ps || ps.owner !== seat || !ps.mortgaged) return false;
  var space = BOARD_DATA[pos]; var cost = Math.floor(space.mortgage * 1.1);
  var p = this.getPlayer(seat); if (p.money < cost) return false;
  p.money -= cost; ps.mortgaged = false; return true;
};

/* ---------- cards ---------- */

MonopolyEngine.prototype.drawChance = function () {
  var c = this.chanceDeck[this.chanceIndex]; this.chanceIndex = (this.chanceIndex + 1) % this.chanceDeck.length; return c;
};
MonopolyEngine.prototype.drawChest = function () {
  var c = this.chestDeck[this.chestIndex]; this.chestIndex = (this.chestIndex + 1) % this.chestDeck.length; return c;
};

MonopolyEngine.prototype.executeCard = function (seat, card) {
  var p = this.getPlayer(seat); if (!p) return { type: 'none' };
  var a = card.action; var self = this;
  switch (a.type) {
    case 'move-to': this.movePlayerTo(seat, a.dest, true); return { type: 'moved', dest: a.dest, landAction: true };
    case 'move-back': p.position = (p.position - a.spaces + 40) % 40; return { type: 'moved', dest: p.position, landAction: true };
    case 'go-to-jail': this.sendToJail(seat); return { type: 'jail' };
    case 'collect': p.money += a.amount; return { type: 'collect', amount: a.amount };
    case 'pay': p.money -= a.amount; this.freeParkingPot += a.amount; return { type: 'pay', amount: a.amount };
    case 'pay-each': {
      var others = this.activePlayers().filter(function (o) { return o.seatIndex !== seat; });
      var t = others.length * a.amount; p.money -= t;
      others.forEach(function (o) { o.money += a.amount; });
      return { type: 'pay', amount: t };
    }
    case 'collect-each': {
      var others2 = this.activePlayers().filter(function (o) { return o.seatIndex !== seat; });
      var t2 = others2.length * a.amount;
      others2.forEach(function (o) { o.money -= a.amount; });
      p.money += t2;
      return { type: 'collect', amount: t2 };
    }
    case 'repairs': {
      var cost = 0;
      p.properties.forEach(function (pos) {
        var ps = self.propertyState[pos];
        if (ps && ps.houses > 0) { cost += ps.houses === 5 ? a.perHotel : ps.houses * a.perHouse; }
      });
      p.money -= cost; this.freeParkingPot += cost;
      return { type: 'pay', amount: cost };
    }
    case 'get-out-of-jail': p.getOutOfJailCards++; return { type: 'get-out-of-jail' };
    case 'nearest-railroad-2x': {
      var rr = [5,15,25,35]; var nr = null;
      for (var i = 0; i < rr.length; i++) { if (rr[i] > p.position) { nr = rr[i]; break; } }
      if (nr == null) nr = rr[0];
      this.movePlayerTo(seat, nr, true);
      return { type: 'moved', dest: nr, landAction: true, rentMultiplier: 2 };
    }
    case 'nearest-utility-10x': {
      var ut = [12,28]; var nu = null;
      for (var j = 0; j < ut.length; j++) { if (ut[j] > p.position) { nu = ut[j]; break; } }
      if (nu == null) nu = ut[0];
      this.movePlayerTo(seat, nu, true);
      return { type: 'moved', dest: nu, landAction: true, utilityMultiplier: 10 };
    }
    default: return { type: 'none' };
  }
};

/* ---------- tax ---------- */

MonopolyEngine.prototype.payTax = function (seat, pos) {
  var space = BOARD_DATA[pos]; var p = this.getPlayer(seat);
  if (!p || !space.amount) return 0;
  p.money -= space.amount; this.freeParkingPot += space.amount; return space.amount;
};

/* ---------- free parking ---------- */

MonopolyEngine.prototype.collectFreeParking = function (seat) {
  var p = this.getPlayer(seat); var pot = this.freeParkingPot;
  if (p && pot > 0) { p.money += pot; this.freeParkingPot = 0; }
  return pot;
};

/* ---------- jail ---------- */

MonopolyEngine.prototype.tryJailRoll = function (seat, d1, d2) {
  var p = this.getPlayer(seat); if (!p || !p.inJail) return { freed: false };
  p.jailTurns++;
  if (d1 === d2) { p.inJail = false; p.jailTurns = 0; return { freed: true, doubles: true }; }
  if (p.jailTurns >= 3) { p.money -= 50; p.inJail = false; p.jailTurns = 0; return { freed: true, paid: true }; }
  return { freed: false };
};

MonopolyEngine.prototype.payJailFine = function (seat) {
  var p = this.getPlayer(seat); if (!p || !p.inJail) return false;
  p.money -= 50; p.inJail = false; p.jailTurns = 0; return true;
};

MonopolyEngine.prototype.useJailCard = function (seat) {
  var p = this.getPlayer(seat); if (!p || !p.inJail || p.getOutOfJailCards <= 0) return false;
  p.getOutOfJailCards--; p.inJail = false; p.jailTurns = 0; return true;
};

/* ---------- bankruptcy ---------- */

MonopolyEngine.prototype.totalAssets = function (seat) {
  var p = this.getPlayer(seat); if (!p) return 0;
  var total = p.money; var self = this;
  p.properties.forEach(function (pos) {
    var space = BOARD_DATA[pos]; var ps = self.propertyState[pos]; if (!ps) return;
    if (!ps.mortgaged) total += space.mortgage;
    if (ps.houses > 0) { total += (ps.houses === 5 ? 5 : ps.houses) * Math.floor(space.houseCost / 2); }
  });
  return total;
};

MonopolyEngine.prototype.isBankrupt = function (seat) { return this.totalAssets(seat) < 0; };

MonopolyEngine.prototype.declareBankruptcy = function (seat, creditorSeat) {
  var p = this.getPlayer(seat); if (!p) return;
  p.bankrupt = true; var self = this;
  if (creditorSeat != null) {
    var cr = this.getPlayer(creditorSeat);
    if (cr) {
      cr.money += Math.max(0, p.money);
      p.properties.forEach(function (pos) {
        var ps = self.propertyState[pos]; if (!ps) return;
        ps.owner = creditorSeat;
        if (ps.houses > 0) {
          var hv = Math.floor(BOARD_DATA[pos].houseCost / 2);
          if (ps.houses === 5) { self.hotelsAvailable++; cr.money += hv * 5; }
          else { self.housesAvailable += ps.houses; cr.money += hv * ps.houses; }
          ps.houses = 0;
        }
        cr.properties.push(pos);
      });
    }
  } else {
    p.properties.forEach(function (pos) {
      var ps = self.propertyState[pos]; if (!ps) return;
      if (ps.houses === 5) self.hotelsAvailable++; else self.housesAvailable += ps.houses;
      delete self.propertyState[pos];
    });
  }
  p.money = 0; p.properties = [];
};

/* ---------- turn advance ---------- */

MonopolyEngine.prototype.nextTurn = function () {
  this.doublesCount = 0;
  var active = this.activePlayers(); if (active.length <= 1) return false;
  var next = this.currentTurn;
  for (var i = 0; i < this.players.length; i++) {
    next = (next + 1) % this.players.length;
    var np = this.getPlayer(next); if (np && !np.bankrupt) break;
  }
  this.currentTurn = next; this.turnNumber++; this.gamePhase = 'rolling'; return true;
};

MonopolyEngine.prototype.checkWinner = function () {
  var a = this.activePlayers(); return a.length === 1 ? a[0] : null;
};

/* ---------- trade ---------- */

MonopolyEngine.prototype.executeTrade = function (oSeat, rSeat, oCash, rCash, oProps, rProps) {
  var off = this.getPlayer(oSeat); var rec = this.getPlayer(rSeat);
  if (!off || !rec) return false; var self = this;
  off.money -= oCash; off.money += rCash; rec.money -= rCash; rec.money += oCash;
  oProps.forEach(function (pos) {
    off.properties = off.properties.filter(function (x) { return x !== pos; });
    rec.properties.push(pos);
    if (self.propertyState[pos]) self.propertyState[pos].owner = rSeat;
  });
  rProps.forEach(function (pos) {
    rec.properties = rec.properties.filter(function (x) { return x !== pos; });
    off.properties.push(pos);
    if (self.propertyState[pos]) self.propertyState[pos].owner = oSeat;
  });
  return true;
};


// ================================================================
//  MONOPOLY CLIENT  (lobby + game UI + network)
// ================================================================
function MonopolyClient() {
  this.socket = null;
  this.myId = null;
  this.mySeat = null;
  this.myName = '';
  this.roomCode = '';
  this.isHost = false;
  this.reconnectToken = null;
  this.engine = new MonopolyEngine();
  this.gameStarted = false;
  this.pendingCardAction = null;
  this.rentMultiplier = 1;
  this.utilityOverride = 0;
  this._animating = false;
  this._pendingRent = null;
  this._latestGS = null;
  this.init();
}

/* -------- init -------- */

MonopolyClient.prototype.init = function () {
  this.connectSocket();
  this.bindLobbyEvents();
  this.bindGameEvents();
  this.tryReconnect();
};

/* -------- socket -------- */

MonopolyClient.prototype.connectSocket = function () {
  var self = this;
  this.socket = io({ reconnection: true, reconnectionDelay: 1000, reconnectionAttempts: 20 });

  this.socket.on('connect', function () {
    self.setConnectionStatus(true);
    if (self.reconnectToken && self.roomCode) {
      self.socket.emit('join-room', {
        roomCode: self.roomCode, playerName: self.myName, reconnectToken: self.reconnectToken
      }, function (res) {
        if (res && res.success && res.reconnected) {
          self.mySeat = res.seatIndex;
          self.handleGameState(res.gameState);
          if (self.gameStarted) { showScreen('screen-game'); self.renderGame(); }
          showToast('Reconnected!');
        }
      });
    }
  });

  this.socket.on('disconnect', function () { self.setConnectionStatus(false); });

  this.socket.on('player-joined',       function (d) { self.onPlayerJoined(d); });
  this.socket.on('player-left',         function (d) { self.onPlayerLeft(d); });
  this.socket.on('player-disconnected', function (d) { self.onPlayerDisconnected(d); });
  this.socket.on('player-reconnected',  function (d) { self.onPlayerReconnected(d); });
  this.socket.on('player-abandoned',    function (d) { self.onPlayerAbandoned(d); });
  this.socket.on('chat-message',        function (d) { self.onChatMessage(d); });
  this.socket.on('error-message',       function (d) { showToast(d.error || 'Error'); });

  this.socket.on('game-started',       function (d) { self.onGameStarted(d); });
  this.socket.on('dice-rolled',        function (d) { self.onDiceRolled(d); });
  this.socket.on('turn-changed',       function (d) { self.onTurnChanged(d); });
  this.socket.on('game-state-update',  function (d) { self.onGameStateUpdate(d); });
  this.socket.on('game-action',        function (d) { self.onGameAction(d); });
};

MonopolyClient.prototype.setConnectionStatus = function (ok) {
  var dot = $('#connection-dot'); var lbl = $('#connection-label');
  if (dot) dot.style.background = ok ? '#2ecc71' : '#e74c3c';
  if (lbl) lbl.textContent = ok ? 'Connected' : 'Disconnected';
};

MonopolyClient.prototype.tryReconnect = function () {
  var s = loadSession(); if (!s) return;
  this.reconnectToken = s.reconnectToken; this.roomCode = s.roomCode;
  this.myName = s.playerName; this.mySeat = s.seatIndex;
  this.myId = s.playerId; this.isHost = s.isHost;
};

/* -------- sfx helper -------- */

function sfx(name) { if (typeof SFX !== 'undefined' && SFX && SFX.play) SFX.play(name); }

/* -------- lobby binding -------- */

MonopolyClient.prototype.bindLobbyEvents = function () {
  var self = this;
  var el;
  el = $('#btn-create'); if (el) el.addEventListener('click', function () { self.createRoom(); });
  el = $('#btn-join');   if (el) el.addEventListener('click', function () { self.joinRoom(); });
  el = $('#input-name'); if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var c = $('#input-code'); if (c && c.value) self.joinRoom(); } });
  el = $('#input-code'); if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.joinRoom(); });
  el = $('#btn-copy-code');  if (el) el.addEventListener('click', function () { navigator.clipboard.writeText(self.roomCode).then(function () { showToast('Code copied!'); }); });
  el = $('#btn-start-game'); if (el) el.addEventListener('click', function () { self.startGame(); });
  el = $('#btn-leave-room'); if (el) el.addEventListener('click', function () { self.leaveRoom(); });
  el = $('#btn-send-chat');  if (el) el.addEventListener('click', function () { self.sendChat(); });
  el = $('#input-chat');     if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.sendChat(); });
};

/* -------- game binding -------- */

MonopolyClient.prototype.bindGameEvents = function () {
  var self = this; var el;
  el = $('#btn-roll-dice');     if (el) el.addEventListener('click', function () { self.rollDice(); });
  el = $('#btn-buy');           if (el) el.addEventListener('click', function () { self.showBuyModal(); });
  el = $('#btn-end-turn');      if (el) el.addEventListener('click', function () { self.endTurn(); });
  el = $('#btn-build');         if (el) el.addEventListener('click', function () { self.showBuildModal(); });
  el = $('#btn-mortgage');      if (el) el.addEventListener('click', function () { self.showMortgageModal(); });
  el = $('#btn-trade');         if (el) el.addEventListener('click', function () { self.showTradeModal(); });
  el = $('#modal-buy-confirm'); if (el) el.addEventListener('click', function () { self.confirmBuy(); });
  el = $('#modal-buy-auction'); if (el) el.addEventListener('click', function () { self.auctionProperty(); });
  el = $('#modal-buy-pass');    if (el) el.addEventListener('click', function () { self.passBuy(); });
  el = $('#card-ok');           if (el) el.addEventListener('click', function () { self.cardOk(); });
  el = $('#rent-pay');          if (el) el.addEventListener('click', function () { self.payRentConfirm(); });
  el = $('#build-confirm');     if (el) el.addEventListener('click', function () { self.confirmBuild(); });
  el = $('#build-cancel');      if (el) el.addEventListener('click', function () { self.closeModal('modal-build'); });
  el = $('#mortgage-close');    if (el) el.addEventListener('click', function () { self.closeModal('modal-mortgage'); });
  el = $('#trade-send');        if (el) el.addEventListener('click', function () { self.sendTradeOffer(); });
  el = $('#trade-cancel');      if (el) el.addEventListener('click', function () { self.closeModal('modal-trade'); });
  el = $('#bankrupt-manage');   if (el) el.addEventListener('click', function () { self.closeModal('modal-bankrupt'); self.showMortgageModal(); });
  el = $('#bankrupt-declare');  if (el) el.addEventListener('click', function () { self.confirmBankruptcy(); });
  el = $('#gameover-new-game'); if (el) el.addEventListener('click', function () { self.closeModal('modal-gameover'); clearSession(); location.reload(); });
  el = $('#btn-send-game-chat'); if (el) el.addEventListener('click', function () { self.sendGameChat(); });
  el = $('#input-game-chat');    if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.sendGameChat(); });
};

/* -------- room management -------- */

MonopolyClient.prototype.createRoom = function () {
  var self = this;
  var nameEl = $('#input-name'); var name = nameEl ? nameEl.value.trim() : '';
  if (!name) { this.showLandingError('Enter your name'); return; }
  this.myName = name;
  this.socket.emit('create-room', { playerName: name }, function (res) {
    if (!res || !res.success) { self.showLandingError((res && res.error) || 'Failed to create room'); return; }
    self.roomCode = res.roomCode; self.reconnectToken = res.reconnectToken;
    self.myId = self.socket.id; self.isHost = true; self.mySeat = 0;
    saveSession({ reconnectToken: res.reconnectToken, roomCode: res.roomCode, playerName: name, seatIndex: 0, playerId: self.myId, isHost: true });
    self.handleGameState(res.gameState);
    showScreen('screen-waiting'); self.renderWaitingRoom();
  });
};

MonopolyClient.prototype.joinRoom = function () {
  var self = this;
  var nameEl = $('#input-name'); var codeEl = $('#input-code');
  var name = nameEl ? nameEl.value.trim() : '';
  var code = codeEl ? codeEl.value.trim().toUpperCase() : '';
  if (!name) { this.showLandingError('Enter your name'); return; }
  if (!code) { this.showLandingError('Enter room code'); return; }
  this.myName = name;
  this.socket.emit('join-room', { roomCode: code, playerName: name }, function (res) {
    if (!res || !res.success) { self.showLandingError((res && res.error) || 'Failed to join'); return; }
    self.roomCode = res.roomCode; self.reconnectToken = res.reconnectToken;
    self.mySeat = res.seatIndex; self.myId = self.socket.id; self.isHost = false;
    saveSession({ reconnectToken: res.reconnectToken, roomCode: res.roomCode, playerName: name, seatIndex: res.seatIndex, playerId: self.myId, isHost: false });
    self.handleGameState(res.gameState);
    if (res.gameState && res.gameState.started) { self.gameStarted = true; showScreen('screen-game'); self.renderGame(); }
    else { showScreen('screen-waiting'); self.renderWaitingRoom(); }
  });
};

MonopolyClient.prototype.handleGameState = function (gs) {
  if (!gs) return;
  this.roomCode = gs.roomCode || this.roomCode;
  var sid = this.socket ? this.socket.id : null; var mid = this.myId;
  if (gs.hostId === mid || gs.hostId === sid) this.isHost = true;
  if (gs.players) {
    var me = gs.players.find(function (p) { return p.id === sid || p.id === mid; });
    if (me) { this.mySeat = me.seatIndex; this.myId = me.id; }
  }
  if (gs.started) { this.gameStarted = true; this.engine.initFromState(gs); }
  this._latestGS = gs;
};

MonopolyClient.prototype.showLandingError = function (msg) {
  var el = $('#landing-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(function () { el.style.display = 'none'; }, 4000); }
};

MonopolyClient.prototype.leaveRoom = function () {
  this.socket.emit('leave-room'); clearSession(); showScreen('screen-landing'); this.gameStarted = false;
};

MonopolyClient.prototype.startGame = function () {
  if (!this.isHost) return;
  this.socket.emit('game-action', { action: 'start-game' });
};

/* -------- chat -------- */

MonopolyClient.prototype.sendChat = function () {
  var input = $('#input-chat'); var msg = input ? input.value.trim() : '';
  if (!msg) return; this.socket.emit('chat-message', { message: msg }); input.value = '';
};

MonopolyClient.prototype.sendGameChat = function () {
  var input = $('#input-game-chat'); var msg = input ? input.value.trim() : '';
  if (!msg) return; this.socket.emit('chat-message', { message: msg }); input.value = '';
};

/* -------- waiting room -------- */

MonopolyClient.prototype.renderWaitingRoom = function () {
  var d = $('#room-code-display'); if (d) d.textContent = this.roomCode;
  this.updatePlayerList(); this.updateWaitingUI();
};

MonopolyClient.prototype.updatePlayerList = function () {
  var gs = this._latestGS; if (!gs || !gs.players) return;
  var list = $('#player-list'); if (!list) return; list.innerHTML = '';
  gs.players.forEach(function (p, i) {
    var li = document.createElement('li'); li.className = 'player-list-item';
    li.innerHTML = '<span class="player-dot" style="background:' + PLAYER_COLORS[i] + '"></span>' +
      '<span class="player-name">' + escHtml(p.name) + '</span>' +
      (p.id === gs.hostId ? '<span class="host-badge">HOST</span>' : '') +
      (!p.connected ? '<span class="dc-badge">DISCONNECTED</span>' : '');
    list.appendChild(li);
  });
  var badge = $('#player-count-badge'); if (badge) badge.textContent = gs.players.length + '/6';
};

MonopolyClient.prototype.updateWaitingUI = function () {
  var gs = this._latestGS;
  var startBtn = $('#btn-start-game'); var waitMsg = $('#waiting-for-host'); var status = $('#waiting-status');
  if (this.isHost) {
    if (startBtn) startBtn.style.display = '';
    if (waitMsg) waitMsg.style.display = 'none';
    var ok = gs && gs.players && gs.players.length >= 2;
    if (startBtn) startBtn.disabled = !ok;
    if (status) status.textContent = ok ? 'Ready to start!' : 'Waiting for more players\u2026';
  } else {
    if (startBtn) startBtn.style.display = 'none';
    if (waitMsg) waitMsg.style.display = '';
    if (status) status.textContent = 'Waiting for host to start\u2026';
  }
  if (gs && gs.chatHistory) {
    var c = $('#chat-messages'); var self = this;
    if (c && c.children.length === 0) gs.chatHistory.forEach(function (m) { self.appendChat(m, c); });
  }
};

MonopolyClient.prototype.appendChat = function (data, container) {
  if (!container) return;
  var div = document.createElement('div'); div.className = 'chat-msg';
  div.innerHTML = '<span class="chat-name" style="color:' + (data.color || '#888') + '">' + escHtml(data.playerName) + ':</span> ' + escHtml(data.message);
  container.appendChild(div); container.scrollTop = container.scrollHeight;
};

/* ======== socket event handlers ======== */

MonopolyClient.prototype.onPlayerJoined = function (d) {
  if (d.gameState) { this._latestGS = d.gameState; this.handleGameState(d.gameState); }
  this.updatePlayerList(); this.updateWaitingUI();
  if (this.gameStarted) this.renderGame();
  showToast((d.playerName || 'Player') + ' joined');
};

MonopolyClient.prototype.onPlayerLeft = function (d) {
  if (d.gameState) { this._latestGS = d.gameState; this.handleGameState(d.gameState); }
  this.updatePlayerList(); this.updateWaitingUI();
  showToast((d.playerName || 'Player') + ' left');
};

MonopolyClient.prototype.onPlayerDisconnected = function (d) {
  if (d.gameState) { this._latestGS = d.gameState; this.handleGameState(d.gameState); }
  this.updatePlayerList();
  if (this.gameStarted) { this.addLog((d.playerName || 'Player') + ' disconnected'); this.renderGame(); }
};

MonopolyClient.prototype.onPlayerReconnected = function (d) {
  if (d.gameState) { this._latestGS = d.gameState; this.handleGameState(d.gameState); }
  this.updatePlayerList();
  if (this.gameStarted) { this.addLog((d.playerName || 'Player') + ' reconnected'); this.renderGame(); }
};

MonopolyClient.prototype.onPlayerAbandoned = function (d) {
  if (d.gameState) { this._latestGS = d.gameState; this.handleGameState(d.gameState); }
  this.updatePlayerList();
  if (this.gameStarted) {
    this.addLog((d.playerName || 'Player') + ' abandoned the game');
    var p = this.engine.players.find(function (pl) { return pl.id === d.playerId; });
    if (p && !p.bankrupt) { this.engine.declareBankruptcy(p.seatIndex); this.syncState(); }
    this.renderGame(); this.checkGameOver();
  }
};

MonopolyClient.prototype.onChatMessage = function (d) {
  this.appendChat(d, $('#chat-messages'));
  this.appendChat(d, $('#game-chat-messages'));
};

MonopolyClient.prototype.onGameStarted = function (d) {
  this.gameStarted = true; this._latestGS = d;
  this.engine.initFromState(d); this.engine.gamePhase = 'rolling';
  var sid = this.socket ? this.socket.id : null; var mid = this.myId;
  if (d.players) { var me = d.players.find(function (p) { return p.id === sid || p.id === mid; }); if (me) { this.mySeat = me.seatIndex; this.myId = me.id; } }
  if (d.hostId === sid) this.isHost = true;
  showScreen('screen-game'); this.renderGame(); this.addLog('Game started!'); sfx('go');
};

MonopolyClient.prototype.onDiceRolled = function (d) {
  var self = this;
  this.engine.lastDice = { die1: d.die1, die2: d.die2, total: d.total, doubles: d.doubles };
  this.animateDice(d.die1, d.die2, function () {
    if (d.seatIndex === self.mySeat) self.handleMyRoll(d);
    self.renderGame();
  });
};

MonopolyClient.prototype.onTurnChanged = function (d) {
  if (d.gameState) this.engine.initFromState(d.gameState);
  else { this.engine.currentTurn = d.currentTurn; this.engine.gamePhase = 'rolling'; this.engine.doublesCount = 0; }
  this.renderGame();
  var cp = this.engine.currentPlayer(); if (cp) this.addLog(cp.name + "'s turn");
};

MonopolyClient.prototype.onGameStateUpdate = function (d) {
  this.engine.initFromState(d.payload || d); this.renderGame(); this.checkGameOver();
};

MonopolyClient.prototype.onGameAction = function (d) {
  var pl = d.payload || {};
  switch (d.action) {
    case 'trade-offer':     if (pl.receiverSeat === this.mySeat) this.showIncomingTrade(pl, d.seatIndex); break;
    case 'trade-accepted':  this.addLog('Trade completed'); showToast('Trade accepted!'); break;
    case 'trade-rejected':  if (pl.offererSeat === this.mySeat) showToast('Trade was rejected'); break;
    case 'property-bought': this.addLog(pl.playerName + ' bought ' + pl.propertyName); sfx('buy'); break;
    case 'rent-paid':       this.addLog(pl.payerName + ' paid $' + pl.amount + ' rent to ' + pl.ownerName); sfx('rent'); break;
    case 'went-bankrupt':   this.addLog(pl.playerName + ' went bankrupt!'); sfx('bankrupt'); break;
    case 'built-house':     this.addLog(pl.playerName + ' built on ' + pl.propertyName); sfx('build'); break;
    case 'drew-card':       this.addLog(pl.playerName + ': ' + pl.text); sfx('card'); break;
    case 'jail':            this.addLog(pl.playerName + ' went to jail!'); sfx('jail'); break;
    case 'free-parking':    this.addLog(pl.playerName + ' collected $' + pl.amount + ' from Free Parking!'); sfx('money'); break;
  }
  this.renderGame();
};

/* -------- sync -------- */

MonopolyClient.prototype.syncState = function () {
  this.socket.emit('game-action', { action: 'update-state', payload: this.engine.serialise() });
};

MonopolyClient.prototype.broadcastAction = function (action, payload) {
  this.socket.emit('game-action', { action: action, payload: payload });
};

/* ======== dice ======== */

MonopolyClient.prototype.rollDice = function () {
  if (this.engine.currentTurn !== this.mySeat || this._animating) return;
  var p = this.engine.currentPlayer(); if (!p) return;
  if (p.inJail && this.engine.gamePhase === 'rolling') { this.showJailOptions(); return; }
  if (this.engine.gamePhase !== 'rolling') return;
  this.engine.gamePhase = 'animating'; this.updateButtons();
  this.socket.emit('game-action', { action: 'roll-dice' });
};

MonopolyClient.prototype.showJailOptions = function () {
  var p = this.engine.currentPlayer(); if (!p) return;
  var self = this;
  var html = '<div style="text-align:center;padding:20px;">' +
    '<h3 style="margin:0 0 8px;">You are in Jail!</h3>' +
    '<p style="margin:0 0 16px;">Turn ' + (p.jailTurns + 1) + ' of 3 in jail</p>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    '<button class="btn btn-primary" id="jail-roll">Roll for Doubles</button>' +
    '<button class="btn btn-warning" id="jail-pay">Pay $50 Fine</button>' +
    (p.getOutOfJailCards > 0 ? '<button class="btn btn-success" id="jail-card">Use Get Out of Jail Free Card</button>' : '') +
    '</div></div>';
  this.showCustomModal(html);

  var doRoll = function () {
    self.closeCustomModal();
    self.engine.gamePhase = 'animating'; self.updateButtons();
    self.socket.emit('game-action', { action: 'roll-dice' });
  };
  document.getElementById('jail-roll').addEventListener('click', doRoll);
  document.getElementById('jail-pay').addEventListener('click', function () {
    self.closeCustomModal();
    self.engine.payJailFine(self.mySeat);
    self.addLog(p.name + ' paid $50 jail fine'); sfx('money'); self.syncState();
    self.engine.gamePhase = 'animating'; self.updateButtons();
    self.socket.emit('game-action', { action: 'roll-dice' });
  });
  var jcBtn = document.getElementById('jail-card');
  if (jcBtn) jcBtn.addEventListener('click', function () {
    self.closeCustomModal();
    self.engine.useJailCard(self.mySeat);
    self.addLog(p.name + ' used Get Out of Jail Free card'); sfx('card'); self.syncState();
    self.engine.gamePhase = 'animating'; self.updateButtons();
    self.socket.emit('game-action', { action: 'roll-dice' });
  });
};

MonopolyClient.prototype.showCustomModal = function (html) {
  var ov = document.getElementById('custom-modal-overlay');
  if (!ov) {
    ov = document.createElement('div'); ov.id = 'custom-modal-overlay';
    Object.assign(ov.style, { position:'fixed',top:'0',left:'0',width:'100%',height:'100%',background:'rgba(0,0,0,.5)',zIndex:'9999',display:'flex',alignItems:'center',justifyContent:'center' });
    document.body.appendChild(ov);
  }
  ov.innerHTML = '<div style="background:#fff;border-radius:12px;max-width:400px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.3);">' + html + '</div>';
  ov.style.display = 'flex';
};

MonopolyClient.prototype.closeCustomModal = function () {
  var ov = document.getElementById('custom-modal-overlay'); if (ov) ov.style.display = 'none';
};

MonopolyClient.prototype.animateDice = function (d1, d2, cb) {
  var self = this; this._animating = true;
  var e1 = $('#die-1'), e2 = $('#die-2'), res = $('#dice-result');
  sfx('dice');
  if (e1) e1.className = 'die rolling';
  if (e2) e2.className = 'die rolling';
  if (res) res.textContent = '';
  setTimeout(function () {
    if (e1) e1.className = 'die show-' + d1;
    if (e2) e2.className = 'die show-' + d2;
    if (res) res.textContent = String(d1 + d2);
    self._animating = false;
    setTimeout(function () { if (cb) cb(); }, 300);
  }, 800);
};

/* ======== handle own roll ======== */

MonopolyClient.prototype.handleMyRoll = function (d) {
  var p = this.engine.currentPlayer(); if (!p) return;
  this.addLog(p.name + ' rolled ' + d.die1 + ' + ' + d.die2 + ' = ' + d.total + (d.doubles ? ' (Doubles!)' : ''));

  // --- jail roll ---
  if (p.inJail) {
    var jr = this.engine.tryJailRoll(this.mySeat, d.die1, d.die2);
    if (jr.freed) {
      if (jr.doubles) this.addLog(p.name + ' rolled doubles and is free from jail!');
      else if (jr.paid) this.addLog(p.name + ' failed 3 times, paid $50 and left jail');
      sfx('jail');
      var mr = this.engine.movePlayer(this.mySeat, d.total);
      if (mr.passedGo) { this.addLog(p.name + ' passed GO, collected $200'); sfx('go'); }
      this.engine.gamePhase = 'landed'; this.syncState(); this.handleLanding(p.position);
    } else {
      this.addLog(p.name + " didn't roll doubles, still in jail");
      this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons();
    }
    return;
  }

  // --- 3 doubles ---
  if (d.doubles) {
    this.engine.doublesCount = (this.engine.doublesCount || 0) + 1;
    if (this.engine.doublesCount >= 3) {
      this.addLog(p.name + ' rolled 3 doubles in a row \u2013 Go to Jail!');
      this.engine.sendToJail(this.mySeat); this.engine.gamePhase = 'action';
      this.broadcastAction('jail', { playerName: p.name }); sfx('jail');
      this.syncState(); this.renderGame(); return;
    }
  } else { this.engine.doublesCount = 0; }

  // --- normal move ---
  var mr2 = this.engine.movePlayer(this.mySeat, d.total);
  if (mr2.passedGo) { this.addLog(p.name + ' passed GO, collected $200'); sfx('go'); }
  this.engine.gamePhase = 'landed'; this.syncState(); this.handleLanding(p.position);
};

/* ======== landing logic ======== */

MonopolyClient.prototype.handleLanding = function (pos) {
  var space = BOARD_DATA[pos]; var p = this.engine.currentPlayer(); if (!p) return;
  this.renderGame();

  switch (space.type) {
    case 'property': case 'railroad': case 'utility': {
      var owner = this.engine.getPropertyOwner(pos);
      if (owner == null) { this.engine.gamePhase = 'landed'; this.showBuyModal(); }
      else if (owner !== this.mySeat) {
        var ps = this.engine.propertyState[pos];
        if (ps && ps.mortgaged) { this.addLog(space.name + ' is mortgaged, no rent due'); this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons(); }
        else this.showRentModal(pos);
      } else { this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons(); }
      break;
    }
    case 'tax': {
      var amt = this.engine.payTax(this.mySeat, pos);
      this.addLog(p.name + ' paid $' + amt + ' in ' + space.name); sfx('money');
      this.engine.gamePhase = 'action'; this.syncState(); this.checkBankrupt(p); this.updateButtons(); break;
    }
    case 'chance': { var c = this.engine.drawChance(); this.showCardModal('Chance', c); break; }
    case 'chest':  { var c2 = this.engine.drawChest(); this.showCardModal('Community Chest', c2); break; }
    case 'go-to-jail': {
      this.engine.sendToJail(this.mySeat);
      this.addLog(p.name + ' went to Jail!'); this.broadcastAction('jail', { playerName: p.name }); sfx('jail');
      this.engine.gamePhase = 'action'; this.syncState(); this.renderGame(); this.updateButtons(); break;
    }
    case 'free-parking': {
      var pot = this.engine.collectFreeParking(this.mySeat);
      if (pot > 0) { this.addLog(p.name + ' collected $' + pot + ' from Free Parking!'); this.broadcastAction('free-parking', { playerName: p.name, amount: pot }); sfx('money'); }
      this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons(); break;
    }
    default: this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons();
  }
};

/* ======== buy modal ======== */

MonopolyClient.prototype.showBuyModal = function () {
  var p = this.engine.currentPlayer(); if (!p) return;
  var pos = p.position; var space = BOARD_DATA[pos]; if (!space || !space.price) return;
  var colorEl = $('#buy-card-color');
  if (colorEl) colorEl.style.background = space.group ? 'var(--prop-' + space.group + ',#888)' : (space.type === 'railroad' ? '#333' : '#888');
  var ne = $('#buy-card-name'); if (ne) ne.textContent = space.name;
  var pe = $('#buy-card-price'); if (pe) pe.textContent = '$' + space.price;
  if (space.rent) {
    ['buy-rent-base','buy-rent-1h','buy-rent-2h','buy-rent-3h','buy-rent-4h','buy-rent-hotel'].forEach(function (id, i) { var e = $('#' + id); if (e) e.textContent = '$' + space.rent[i]; });
  } else {
    ['buy-rent-base','buy-rent-1h','buy-rent-2h','buy-rent-3h','buy-rent-4h','buy-rent-hotel'].forEach(function (id) { var e = $('#' + id); if (e) e.textContent = '\u2014'; });
    if (space.type === 'railroad') { var e1 = $('#buy-rent-base'); if (e1) e1.textContent = '$25\u2013$200'; }
    if (space.type === 'utility')  { var e2 = $('#buy-rent-base'); if (e2) e2.textContent = '4\u00d7/10\u00d7 dice'; }
  }
  var hc = $('#buy-house-cost'); if (hc) hc.textContent = space.houseCost ? ('$' + space.houseCost) : '\u2014';
  var cb = $('#modal-buy-confirm'); if (cb) cb.disabled = p.money < space.price;
  this.openModal('modal-buy');
};

MonopolyClient.prototype.confirmBuy = function () {
  var p = this.engine.currentPlayer(); if (!p) return;
  var pos = p.position; var space = BOARD_DATA[pos];
  if (this.engine.buyProperty(this.mySeat, pos)) {
    this.addLog(p.name + ' bought ' + space.name + ' for $' + space.price);
    this.broadcastAction('property-bought', { playerName: p.name, propertyName: space.name, price: space.price }); sfx('buy');
  }
  this.closeModal('modal-buy'); this.engine.gamePhase = 'action'; this.syncState(); this.renderGame(); this.updateButtons();
};

MonopolyClient.prototype.auctionProperty = function () {
  showToast('Auction not available \u2013 property returned to bank');
  this.closeModal('modal-buy'); this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons();
};

MonopolyClient.prototype.passBuy = function () {
  this.closeModal('modal-buy'); this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons();
};

/* ======== rent modal ======== */

MonopolyClient.prototype.showRentModal = function (pos) {
  var space = BOARD_DATA[pos]; var ps = this.engine.propertyState[pos]; if (!ps) return;
  var owner = this.engine.getPlayer(ps.owner);
  var dt = this.engine.lastDice.total || 2;
  var rent = this.engine.calculateRent(pos, dt);
  if (this.rentMultiplier > 1) { rent *= this.rentMultiplier; this.rentMultiplier = 1; }
  if (this.utilityOverride > 0) { rent = dt * this.utilityOverride; this.utilityOverride = 0; }
  var ne = $('#rent-property-name'); if (ne) ne.textContent = space.name;
  var oe = $('#rent-owner-name'); if (oe) oe.textContent = owner ? owner.name : '?';
  var ae = $('#rent-amount'); if (ae) ae.textContent = '$' + rent;
  this._pendingRent = { pos: pos, rent: rent, ownerSeat: ps.owner };
  this.openModal('modal-rent');
};

MonopolyClient.prototype.payRentConfirm = function () {
  var p = this.engine.currentPlayer(); if (!p || !this._pendingRent) return;
  var rent = this._pendingRent.rent; var os = this._pendingRent.ownerSeat;
  var owner = this.engine.getPlayer(os);
  p.money -= rent; if (owner) owner.money += rent;
  this.addLog(p.name + ' paid $' + rent + ' rent to ' + (owner ? owner.name : '?'));
  this.broadcastAction('rent-paid', { payerName: p.name, ownerName: owner ? owner.name : '?', amount: rent }); sfx('rent');
  this._pendingRent = null;
  this.closeModal('modal-rent'); this.engine.gamePhase = 'action'; this.syncState();
  this.checkBankrupt(p); this.renderGame(); this.updateButtons();
};

/* ======== card modal ======== */

MonopolyClient.prototype.showCardModal = function (type, card) {
  var te = $('#card-type'); if (te) te.textContent = type;
  var tx = $('#card-text'); if (tx) tx.textContent = card.text;
  this.pendingCardAction = card; sfx('card');
  var cp = this.engine.currentPlayer();
  this.broadcastAction('drew-card', { playerName: cp ? cp.name : '', text: card.text, type: type });
  this.openModal('modal-card');
};

MonopolyClient.prototype.cardOk = function () {
  this.closeModal('modal-card');
  var card = this.pendingCardAction; if (!card) return; this.pendingCardAction = null;
  var p = this.engine.currentPlayer(); if (!p) return;
  var r = this.engine.executeCard(this.mySeat, card);
  switch (r.type) {
    case 'moved':
      this.syncState(); this.renderGame();
      if (r.landAction) {
        if (r.rentMultiplier) this.rentMultiplier = r.rentMultiplier;
        if (r.utilityMultiplier) this.utilityOverride = r.utilityMultiplier;
        this.handleLanding(p.position);
      } else { this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons(); }
      break;
    case 'jail':
      this.broadcastAction('jail', { playerName: p.name }); sfx('jail');
      this.engine.gamePhase = 'action'; this.syncState(); this.renderGame(); this.updateButtons(); break;
    case 'collect':
      this.addLog(p.name + ' collected $' + r.amount); sfx('money');
      this.engine.gamePhase = 'action'; this.syncState(); this.renderGame(); this.updateButtons(); break;
    case 'pay':
      this.addLog(p.name + ' paid $' + r.amount); sfx('money');
      this.engine.gamePhase = 'action'; this.syncState(); this.checkBankrupt(p); this.renderGame(); this.updateButtons(); break;
    case 'get-out-of-jail':
      this.addLog(p.name + ' got a Get Out of Jail Free card');
      this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons(); break;
    default:
      this.engine.gamePhase = 'action'; this.syncState(); this.updateButtons();
  }
};

/* ======== build modal ======== */

MonopolyClient.prototype.showBuildModal = function () {
  if (this.engine.currentTurn !== this.mySeat) return;
  var p = this.engine.currentPlayer(); if (!p) return;
  var list = $('#build-list'); if (!list) return; list.innerHTML = '';
  var self = this; var any = false;

  p.properties.forEach(function (pos) {
    var space = BOARD_DATA[pos]; if (space.type !== 'property') return;
    var ps = self.engine.propertyState[pos]; if (!ps) return;
    var cb = self.engine.canBuildOn(self.mySeat, pos);
    var cs = self.engine.canSellHouseOn(self.mySeat, pos);
    if (!cb && !cs && ps.houses === 0) return;
    any = true;
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px;border-bottom:1px solid #eee;';
    var hl = ps.houses === 5 ? '\uD83C\uDFE8 Hotel' : ps.houses > 0 ? '\uD83C\uDFE0 \u00d7' + ps.houses : 'Empty';
    var btns = '';
    if (cs) btns += '<button class="btn btn-sm btn-danger build-sell" data-pos="' + pos + '">Sell</button> ';
    if (cb) btns += '<button class="btn btn-sm btn-success build-buy" data-pos="' + pos + '">Build $' + space.houseCost + '</button>';
    row.innerHTML = '<div><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:var(--prop-' + space.group + ');margin-right:6px;vertical-align:middle;"></span>' +
      '<strong>' + space.name + '</strong> <span style="margin-left:6px;font-size:12px;color:#666;">' + hl + '</span></div>' +
      '<div style="display:flex;gap:6px;">' + btns + '</div>';
    list.appendChild(row);
  });

  if (!any) list.innerHTML = '<p style="padding:16px;text-align:center;color:#888;">No buildable properties. Need complete color set with no mortgages.</p>';

  $$('.build-buy', list).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pos = parseInt(btn.dataset.pos);
      if (self.engine.buildHouse(self.mySeat, pos)) {
        var sp = BOARD_DATA[pos];
        self.addLog(p.name + ' built on ' + sp.name);
        self.broadcastAction('built-house', { playerName: p.name, propertyName: sp.name }); sfx('build');
        self.syncState(); self.renderGame(); self.showBuildModal();
      }
    });
  });
  $$('.build-sell', list).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pos = parseInt(btn.dataset.pos);
      if (self.engine.sellHouse(self.mySeat, pos)) {
        self.addLog(p.name + ' sold a building on ' + BOARD_DATA[pos].name); sfx('money');
        self.syncState(); self.renderGame(); self.showBuildModal();
      }
    });
  });
  this.openModal('modal-build');
};

MonopolyClient.prototype.confirmBuild = function () { this.closeModal('modal-build'); this.renderGame(); };

/* ======== mortgage modal ======== */

MonopolyClient.prototype.showMortgageModal = function () {
  var mp = this.engine.getPlayer(this.mySeat); if (!mp) return;
  this._showMortgageFor(mp);
};

MonopolyClient.prototype._showMortgageFor = function (p) {
  var list = $('#mortgage-list'); if (!list) return; list.innerHTML = '';
  var self = this;
  if (p.properties.length === 0) { list.innerHTML = '<p style="padding:16px;text-align:center;color:#888;">No properties.</p>'; this.openModal('modal-mortgage'); return; }

  p.properties.forEach(function (pos) {
    var space = BOARD_DATA[pos]; var ps = self.engine.propertyState[pos]; if (!ps) return;
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px;border-bottom:1px solid #eee;';
    var cm = self.engine.canMortgage(p.seatIndex, pos); var uc = Math.floor(space.mortgage * 1.1);
    var cd = space.group ? '<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:var(--prop-' + space.group + ');margin-right:6px;vertical-align:middle;"></span>' : '';
    var ab;
    if (ps.mortgaged) ab = '<button class="btn btn-sm btn-success unmort-btn" data-pos="' + pos + '"' + (p.money < uc ? ' disabled' : '') + '>Unmortgage $' + uc + '</button>';
    else if (cm) ab = '<button class="btn btn-sm btn-warning mort-btn" data-pos="' + pos + '">Mortgage $' + space.mortgage + '</button>';
    else ab = '<span style="font-size:12px;color:#aaa;">Sell houses first</span>';
    row.innerHTML = '<div>' + cd + '<strong>' + space.name + '</strong>' + (ps.mortgaged ? ' <span style="color:#e74c3c;font-size:11px;">(MORTGAGED)</span>' : '') + '</div><div>' + ab + '</div>';
    list.appendChild(row);
  });

  $$('.mort-btn', list).forEach(function (btn) { btn.addEventListener('click', function () {
    var pos = parseInt(btn.dataset.pos);
    if (self.engine.mortgageProperty(p.seatIndex, pos)) { self.addLog(p.name + ' mortgaged ' + BOARD_DATA[pos].name); sfx('money'); self.syncState(); self.renderGame(); self._showMortgageFor(p); }
  }); });
  $$('.unmort-btn', list).forEach(function (btn) { btn.addEventListener('click', function () {
    var pos = parseInt(btn.dataset.pos);
    if (self.engine.unmortgageProperty(p.seatIndex, pos)) { self.addLog(p.name + ' unmortgaged ' + BOARD_DATA[pos].name); sfx('money'); self.syncState(); self.renderGame(); self._showMortgageFor(p); }
  }); });

  this.openModal('modal-mortgage');
};

/* ======== trade modal ======== */

MonopolyClient.prototype.showTradeModal = function () {
  var me = this.engine.getPlayer(this.mySeat); if (!me) return;
  var self = this;

  // partner select
  var sel = $('#trade-partner');
  if (sel) {
    sel.innerHTML = '<option value="">Select player\u2026</option>';
    this.engine.activePlayers().forEach(function (p) {
      if (p.seatIndex !== self.mySeat) sel.innerHTML += '<option value="' + p.seatIndex + '">' + escHtml(p.name) + '</option>';
    });
    // replace to clear old listeners
    var ns = sel.cloneNode(true); sel.parentNode.replaceChild(ns, sel);
    ns.addEventListener('change', updateTheirs);
  }

  var cy = $('#trade-cash-yours'); if (cy) cy.value = 0;
  var ct = $('#trade-cash-theirs'); if (ct) ct.value = 0;

  var py = $('#trade-props-yours');
  if (py) {
    py.innerHTML = '';
    me.properties.forEach(function (pos) {
      var space = BOARD_DATA[pos]; var ps = self.engine.propertyState[pos];
      if (ps && ps.houses > 0) return;
      var lb = document.createElement('label');
      lb.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;';
      lb.innerHTML = '<input type="checkbox" value="' + pos + '">' +
        (space.group ? '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--prop-' + space.group + ')"></span>' : '') +
        escHtml(space.name) + (ps && ps.mortgaged ? ' (M)' : '');
      py.appendChild(lb);
    });
  }

  function updateTheirs() {
    var pt = $('#trade-props-theirs'); var s = $('#trade-partner');
    if (!pt || !s) return; pt.innerHTML = '';
    var seat = parseInt(s.value); if (isNaN(seat)) return;
    var partner = self.engine.getPlayer(seat); if (!partner) return;
    partner.properties.forEach(function (pos) {
      var space = BOARD_DATA[pos]; var ps = self.engine.propertyState[pos];
      if (ps && ps.houses > 0) return;
      var lb = document.createElement('label');
      lb.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;';
      lb.innerHTML = '<input type="checkbox" value="' + pos + '">' +
        (space.group ? '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--prop-' + space.group + ')"></span>' : '') +
        escHtml(space.name) + (ps && ps.mortgaged ? ' (M)' : '');
      pt.appendChild(lb);
    });
  }
  this.openModal('modal-trade');
};

MonopolyClient.prototype.sendTradeOffer = function () {
  var sel = $('#trade-partner'); var rs = parseInt(sel ? sel.value : '');
  if (isNaN(rs)) { showToast('Select a trade partner'); return; }
  var oc = parseInt($('#trade-cash-yours') ? $('#trade-cash-yours').value : '0') || 0;
  var rc = parseInt($('#trade-cash-theirs') ? $('#trade-cash-theirs').value : '0') || 0;
  var op = $$('#trade-props-yours input:checked').map(function (c) { return parseInt(c.value); });
  var rp = $$('#trade-props-theirs input:checked').map(function (c) { return parseInt(c.value); });
  if (!oc && !rc && !op.length && !rp.length) { showToast('Add something to the trade'); return; }
  var me = this.engine.getPlayer(this.mySeat);
  if (me && oc > me.money) { showToast("You don't have enough cash"); return; }
  this.closeModal('modal-trade');
  this.broadcastAction('trade-offer', { offererSeat: this.mySeat, offererName: me ? me.name : '', receiverSeat: rs, offerCash: oc, receiverCash: rc, offerProps: op, receiverProps: rp });
  showToast('Trade offer sent!');
};

MonopolyClient.prototype.showIncomingTrade = function (offer) {
  var off = this.engine.getPlayer(offer.offererSeat);
  var me  = this.engine.getPlayer(this.mySeat);
  if (!off || !me) return; var self = this;

  var h = '<div style="padding:20px;"><h3 style="margin:0 0 12px;">Trade Offer from ' + escHtml(off.name) + '</h3><div style="display:flex;gap:20px;margin:16px 0;">';
  h += '<div style="flex:1;"><h4 style="margin:0 0 6px;">They offer:</h4>';
  if (offer.offerCash > 0) h += '<p>$' + offer.offerCash + '</p>';
  offer.offerProps.forEach(function (pos) { h += '<p>' + BOARD_DATA[pos].name + '</p>'; });
  if (!offer.offerCash && !offer.offerProps.length) h += '<p style="color:#888;">Nothing</p>';
  h += '</div><div style="flex:1;"><h4 style="margin:0 0 6px;">They want:</h4>';
  if (offer.receiverCash > 0) h += '<p>$' + offer.receiverCash + '</p>';
  offer.receiverProps.forEach(function (pos) { h += '<p>' + BOARD_DATA[pos].name + '</p>'; });
  if (!offer.receiverCash && !offer.receiverProps.length) h += '<p style="color:#888;">Nothing</p>';
  h += '</div></div><div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">' +
    '<button class="btn btn-success" id="trade-accept">Accept</button>' +
    '<button class="btn btn-danger" id="trade-reject">Reject</button></div></div>';

  this.showCustomModal(h);
  document.getElementById('trade-accept').addEventListener('click', function () {
    self.closeCustomModal();
    self.engine.executeTrade(offer.offererSeat, offer.receiverSeat, offer.offerCash, offer.receiverCash, offer.offerProps, offer.receiverProps);
    self.addLog('Trade completed: ' + off.name + ' \u2194 ' + me.name); sfx('money');
    self.syncState(); self.broadcastAction('trade-accepted', { offererSeat: offer.offererSeat, receiverSeat: offer.receiverSeat }); self.renderGame();
  });
  document.getElementById('trade-reject').addEventListener('click', function () {
    self.closeCustomModal();
    self.broadcastAction('trade-rejected', { offererSeat: offer.offererSeat, receiverSeat: offer.receiverSeat });
  });
};

/* ======== bankruptcy ======== */

MonopolyClient.prototype.checkBankrupt = function (player) {
  if (!player || player.money >= 0 || player.seatIndex !== this.mySeat) return;
  this.showBankruptModal(player, this.engine.totalAssets(player.seatIndex) < 0);
};

MonopolyClient.prototype.showBankruptModal = function (player, forced) {
  var me = $('#bankrupt-message'); if (me) me.textContent = forced
    ? player.name + ' is bankrupt! Not enough assets to cover debts.'
    : player.name + ' is in debt ($' + Math.abs(player.money) + '). Sell houses or mortgage properties.';
  var ow = $('#bankrupt-owed'); if (ow) ow.textContent = '$' + Math.abs(player.money);
  var ca = $('#bankrupt-cash'); if (ca) ca.textContent = '$' + this.engine.totalAssets(player.seatIndex);
  var mg = $('#bankrupt-manage'); if (mg) mg.style.display = forced ? 'none' : '';
  this.openModal('modal-bankrupt');
};

MonopolyClient.prototype.confirmBankruptcy = function () {
  this.closeModal('modal-bankrupt');
  var p = this.engine.currentPlayer(); if (!p) return;
  var cr = this._pendingRent ? this._pendingRent.ownerSeat : null;
  this.engine.declareBankruptcy(this.mySeat, cr);
  this.addLog(p.name + ' went bankrupt!');
  this.broadcastAction('went-bankrupt', { playerName: p.name, seatIndex: this.mySeat }); sfx('bankrupt');
  this._pendingRent = null; this.syncState(); this.renderGame(); this.checkGameOver();
  if (!this.engine.checkWinner()) this.endTurn();
};

MonopolyClient.prototype.checkGameOver = function () {
  var w = this.engine.checkWinner(); if (w) this.showGameOverModal(w);
};

MonopolyClient.prototype.showGameOverModal = function (winner) {
  var we = $('#gameover-winner'); if (we) we.textContent = '\uD83C\uDF89 ' + winner.name + ' wins!';
  var se = $('#gameover-stats');
  if (se) {
    var h = '';
    this.engine.players.forEach(function (p) {
      var val = p.bankrupt ? 'BANKRUPT' : '$' + (p.money + p.properties.reduce(function (s, pos) { return s + ((BOARD_DATA[pos] || {}).price || 0); }, 0));
      h += '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:' + PLAYER_COLORS[p.seatIndex] + '">' + escHtml(p.name) + '</span><span>' + val + '</span></div>';
    });
    se.innerHTML = h;
  }
  sfx('win'); this.openModal('modal-gameover');
};

/* ======== end turn ======== */

MonopolyClient.prototype.endTurn = function () {
  if (this.engine.currentTurn !== this.mySeat) return;
  var p = this.engine.currentPlayer();
  // doubles -> roll again
  if (this.engine.lastDice.doubles && p && !p.inJail && !p.bankrupt && this.engine.doublesCount > 0 && this.engine.doublesCount < 3) {
    this.engine.gamePhase = 'rolling'; this.syncState(); this.renderGame(); this.updateButtons();
    this.addLog(p.name + ' rolled doubles \u2013 roll again!'); return;
  }
  this.engine.nextTurn(); this.syncState();
  this.socket.emit('game-action', { action: 'end-turn' });
  this.renderGame();
  var cp = this.engine.currentPlayer(); if (cp) this.addLog(cp.name + "'s turn");
};

/* ======== rendering ======== */

MonopolyClient.prototype.renderGame = function () {
  this.renderTokensOnBoard(); this.renderPlayerCards(); this.renderPropertyOwnership(); this.renderTurnBanner(); this.updateButtons();
};

MonopolyClient.prototype.renderTokensOnBoard = function () {
  $$('.player-token').forEach(function (t) { t.remove(); });
  this.engine.players.forEach(function (p) {
    if (p.bankrupt) return;
    var area = $('[data-pos="' + p.position + '"] .token-area');
    if (area) area.appendChild(makeToken(p.seatIndex));
  });
};

MonopolyClient.prototype.renderPlayerCards = function () {
  var container = $('#player-cards'); if (!container) return; container.innerHTML = '';
  var self = this;
  this.engine.players.forEach(function (p) {
    var card = document.createElement('div');
    card.className = 'player-card' + (p.bankrupt ? ' bankrupt' : '') + (p.seatIndex === self.engine.currentTurn ? ' active-turn' : '');
    card.style.borderLeft = '4px solid ' + PLAYER_COLORS[p.seatIndex];

    // group properties
    var groups = {};
    p.properties.forEach(function (pos) {
      var sp = BOARD_DATA[pos]; var g = sp.group || sp.type;
      if (!groups[g]) groups[g] = [];
      groups[g].push({ space: sp, state: self.engine.propertyState[pos] });
    });
    var ph = '';
    Object.keys(groups).forEach(function (g) {
      ph += '<div style="display:flex;gap:2px;flex-wrap:wrap;margin-top:2px;">';
      groups[g].forEach(function (item) {
        var bg = item.space.group ? 'var(--prop-' + item.space.group + ')' : item.space.type === 'railroad' ? '#333' : '#888';
        var op = item.state && item.state.mortgaged ? 'opacity:.4;' : '';
        var h = item.state ? item.state.houses || 0 : 0;
        var hi = h === 5 ? '<span style="color:red;font-size:8px;">H</span>' : h > 0 ? '<span style="font-size:8px;">' + '\u25CF'.repeat(h) + '</span>' : '';
        ph += '<div title="' + escHtml(item.space.name) + '" style="background:' + bg + ';color:#fff;font-size:9px;padding:1px 4px;border-radius:3px;' + op + 'line-height:1.2;">' + hi + '</div>';
      });
      ph += '</div>';
    });

    card.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
        '<div style="width:24px;height:24px;border-radius:50%;background:' + PLAYER_COLORS[p.seatIndex] + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;">' + (p.seatIndex + 1) + '</div>' +
        '<div><div style="font-weight:bold;font-size:13px;">' + escHtml(p.name) + (p.seatIndex === self.mySeat ? ' (You)' : '') + '</div>' +
        '<div style="font-size:12px;color:' + (p.money < 0 ? '#e74c3c' : '#27ae60') + ';">$' + p.money + '</div></div>' +
        (!p.connected ? '<span style="font-size:10px;color:#e74c3c;">\u26AB DC</span>' : '') +
        (p.inJail ? '<span style="font-size:10px;">\uD83D\uDD12 Jail</span>' : '') +
        (p.getOutOfJailCards > 0 ? '<span style="font-size:10px;">\uD83C\uDCCF\u00d7' + p.getOutOfJailCards + '</span>' : '') +
      '</div>' +
      '<div class="player-properties">' + ph + '</div>' +
      (p.bankrupt ? '<div style="color:#e74c3c;font-weight:bold;font-size:11px;">BANKRUPT</div>' : '');
    container.appendChild(card);
  });
};

MonopolyClient.prototype.renderPropertyOwnership = function () {
  $$('.space-owner-dot').forEach(function (d) { d.remove(); });
  $$('.space-houses').forEach(function (d) { d.remove(); });
  var self = this;
  Object.keys(this.engine.propertyState).forEach(function (pos) {
    var ps = self.engine.propertyState[pos];
    var el = $('[data-pos="' + pos + '"]'); if (!el) return;
    el.style.position = 'relative';

    if (ps.owner != null) {
      var dot = document.createElement('div'); dot.className = 'space-owner-dot';
      Object.assign(dot.style, { position:'absolute',bottom:'2px',right:'2px',width:'8px',height:'8px',borderRadius:'50%',background:PLAYER_COLORS[ps.owner],border:'1px solid #fff',zIndex:'5' });
      el.appendChild(dot);
    }
    if (ps.houses > 0) {
      var hd = document.createElement('div'); hd.className = 'space-houses';
      Object.assign(hd.style, { position:'absolute',top:'1px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'1px',zIndex:'5' });
      if (ps.houses === 5) hd.innerHTML = '<div style="width:12px;height:8px;background:#e74c3c;border-radius:2px;border:1px solid #a00;"></div>';
      else { var hh = ''; for (var i = 0; i < ps.houses; i++) hh += '<div style="width:6px;height:6px;background:#2ecc71;border-radius:1px;border:1px solid #196;"></div>'; hd.innerHTML = hh; }
      el.appendChild(hd);
    }
    if (ps.mortgaged) el.classList.add('mortgaged'); else el.classList.remove('mortgaged');
  });
};

MonopolyClient.prototype.renderTurnBanner = function () {
  var cp = this.engine.currentPlayer(); if (!cp) return;
  var te = $('#turn-token'); if (te) { te.innerHTML = ''; te.appendChild(makeToken(cp.seatIndex)); }
  var ne = $('#turn-player-name');
  if (ne) { ne.textContent = cp.seatIndex === this.mySeat ? 'Your Turn' : cp.name + "'s Turn"; ne.style.color = PLAYER_COLORS[cp.seatIndex]; }
};

MonopolyClient.prototype.updateButtons = function () {
  var my = this.engine.currentTurn === this.mySeat;
  var p  = this.engine.currentPlayer();
  var ph = this.engine.gamePhase;
  var self = this;

  var rb = $('#btn-roll-dice'); if (rb) rb.disabled = !my || ph !== 'rolling' || this._animating;
  var bb = $('#btn-buy');
  if (bb) {
    var can = my && ph === 'landed' && p && BOARD_DATA[p.position] && BOARD_DATA[p.position].price && !self.engine.propertyState[p.position];
    bb.disabled = !can; bb.style.display = can ? '' : 'none';
  }
  var eb = $('#btn-end-turn'); if (eb) eb.disabled = !my || (ph !== 'action' && ph !== 'landed');
  var bd = $('#btn-build');
  if (bd) {
    var hm = false;
    if (my && p) hm = p.properties.some(function (pos) { var sp = BOARD_DATA[pos]; return sp.group && self.engine.ownsFullGroup(self.mySeat, sp.group); });
    bd.disabled = !hm;
  }
  var mb = $('#btn-mortgage'); if (mb) { var mp = this.engine.getPlayer(this.mySeat); mb.disabled = !mp || mp.properties.length === 0; }
  var tb = $('#btn-trade'); if (tb) tb.disabled = this.engine.activePlayers().length < 2;
};

/* ======== game log ======== */

MonopolyClient.prototype.addLog = function (msg) {
  var log = $('#game-log'); if (!log) return;
  var e = document.createElement('div'); e.className = 'log-entry';
  var d = new Date(); var t = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  e.innerHTML = '<span style="color:#888;font-size:11px;">' + t + '</span> ' + msg;
  log.appendChild(e); log.scrollTop = log.scrollHeight;
};

/* ======== modal helpers ======== */

MonopolyClient.prototype.openModal = function (id) {
  var m = document.getElementById(id); if (m) { m.classList.add('active'); m.style.display = ''; }
};
MonopolyClient.prototype.closeModal = function (id) {
  var m = document.getElementById(id); if (m) m.classList.remove('active');
};

/* ======== boot ======== */

document.addEventListener('DOMContentLoaded', function () {
  window.game = new MonopolyClient();
});
