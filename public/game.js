/* ═══════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — game.js  (full rewrite)
   ═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────
   1. HELPERS & GLOBALS
   ────────────────────────────────────── */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function saveSession(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function loadSession(key) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e){ return null; } }
function clearSession(key) { try { localStorage.removeItem(key); } catch(e){} }

/* Victory MP3 */
var _victoryAudio = null;
function playVictoryMusic() {
  try {
    if (!_victoryAudio) _victoryAudio = new Audio('victory.mp3');
    _victoryAudio.currentTime = 0;
    _victoryAudio.volume = 0.7;
    _victoryAudio.play().catch(function(){});
  } catch(e){}
}
function stopVictoryMusic() {
  try { if (_victoryAudio) { _victoryAudio.pause(); _victoryAudio.currentTime = 0; } } catch(e){}
}

var _toastTimer = null;
function showToast(message, type) {
  var el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.className = "toast show" + (type ? " toast-" + type : "");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { el.className = "toast"; }, 3500);
}

function showScreen(id) {
  var screens = $$('.screen');
  for (var i = 0; i < screens.length; i++) screens[i].classList.remove("active");
  var target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function escHtml(str) {
  var d = document.createElement("div");
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

function sfx(name) { if (window.SFX) SFX.play(name); }

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

var PLAYER_COLORS = ["#e74c3c","#3498db","#2ecc71","#f39c12","#9b59b6","#1abc9c"];

var CHARACTERS = [
  { id: "red", color: "#e74c3c", name: "Crimson" },
  { id: "blue", color: "#3498db", name: "Ocean" },
  { id: "green", color: "#2ecc71", name: "Emerald" },
  { id: "orange", color: "#f39c12", name: "Amber" },
  { id: "purple", color: "#9b59b6", name: "Violet" },
  { id: "teal", color: "#1abc9c", name: "Teal" },
  { id: "pink", color: "#e91e8e", name: "Fuchsia" },
  { id: "white", color: "#ecf0f1", name: "Ivory" }
];

function getCharacter(id) {
  for (var i = 0; i < CHARACTERS.length; i++) {
    if (CHARACTERS[i].id === id) return CHARACTERS[i];
  }
  return null;
}

var GROUP_COLORS = {
  brown: "#8B4513", lightblue: "#87CEEB", pink: "#FF69B4",
  orange: "#FF8C00", red: "#e74c3c", yellow: "#FFD700",
  green: "#2ecc71", darkblue: "#0000CD"
};

/* ──────────────────────────────────────
   2. BOARD DATA
   ────────────────────────────────────── */
var BOARD_DATA = [
  {pos:0, name:'GO', type:'go'},
  {pos:1, name:'Broke Boulevard', type:'property', group:'brown', price:60, rent:[2,10,30,90,160,250], houseCost:50, mortgage:30},
  {pos:2, name:'Community Chest', type:'chest'},
  {pos:3, name:'Ramen Row', type:'property', group:'brown', price:60, rent:[4,20,60,180,320,450], houseCost:50, mortgage:30},
  {pos:4, name:'Income Tax', type:'tax', price:200},
  {pos:5, name:'Midnight Express', type:'railroad', price:200, mortgage:100},
  {pos:6, name:'Thrift Lane', type:'property', group:'lightblue', price:100, rent:[6,30,90,270,400,550], houseCost:50, mortgage:50},
  {pos:7, name:'Chance', type:'chance'},
  {pos:8, name:'Flea Market Ave', type:'property', group:'lightblue', price:100, rent:[6,30,90,270,400,550], houseCost:50, mortgage:50},
  {pos:9, name:'Garage Sale Ct', type:'property', group:'lightblue', price:120, rent:[8,40,100,300,450,600], houseCost:50, mortgage:60},
  {pos:10, name:'Jail', type:'jail'},
  {pos:11, name:'Neon Strip', type:'property', group:'pink', price:140, rent:[10,50,150,450,625,750], houseCost:100, mortgage:70},
  {pos:12, name:'Volt Works', type:'utility', price:150, mortgage:75},
  {pos:13, name:'Lipstick Lane', type:'property', group:'pink', price:140, rent:[10,50,150,450,625,750], houseCost:100, mortgage:70},
  {pos:14, name:'Velvet Lounge', type:'property', group:'pink', price:160, rent:[12,60,180,500,700,900], houseCost:100, mortgage:80},
  {pos:15, name:'Thunder Rail', type:'railroad', price:200, mortgage:100},
  {pos:16, name:'Taco Terrace', type:'property', group:'orange', price:180, rent:[14,70,200,550,750,950], houseCost:100, mortgage:90},
  {pos:17, name:'Community Chest', type:'chest'},
  {pos:18, name:'Salsa Street', type:'property', group:'orange', price:180, rent:[14,70,200,550,750,950], houseCost:100, mortgage:90},
  {pos:19, name:'Fiesta Plaza', type:'property', group:'orange', price:200, rent:[16,80,220,600,800,1000], houseCost:100, mortgage:100},
  {pos:20, name:'Free Parking', type:'free-parking'},
  {pos:21, name:'Crimson Court', type:'property', group:'red', price:220, rent:[18,90,250,700,875,1050], houseCost:150, mortgage:110},
  {pos:22, name:'Chance', type:'chance'},
  {pos:23, name:'Scarlet Row', type:'property', group:'red', price:220, rent:[18,90,250,700,875,1050], houseCost:150, mortgage:110},
  {pos:24, name:'Inferno Ave', type:'property', group:'red', price:240, rent:[20,100,300,750,925,1100], houseCost:150, mortgage:120},
  {pos:25, name:'Ghost Line', type:'railroad', price:200, mortgage:100},
  {pos:26, name:'Gold Rush Blvd', type:'property', group:'yellow', price:260, rent:[22,110,330,800,975,1150], houseCost:150, mortgage:130},
  {pos:27, name:'Sunburn Strip', type:'property', group:'yellow', price:260, rent:[22,110,330,800,975,1150], houseCost:150, mortgage:130},
  {pos:28, name:'Aqua Pipes', type:'utility', price:150, mortgage:75},
  {pos:29, name:'Lemon Drop Ln', type:'property', group:'yellow', price:280, rent:[24,120,360,850,1025,1200], houseCost:150, mortgage:140},
  {pos:30, name:'Go To Jail', type:'go-to-jail'},
  {pos:31, name:'Emerald Heights', type:'property', group:'green', price:300, rent:[26,130,390,900,1100,1275], houseCost:200, mortgage:150},
  {pos:32, name:'Jade Terrace', type:'property', group:'green', price:300, rent:[26,130,390,900,1100,1275], houseCost:200, mortgage:150},
  {pos:33, name:'Community Chest', type:'chest'},
  {pos:34, name:'Forest Manor', type:'property', group:'green', price:320, rent:[28,150,450,1000,1200,1400], houseCost:200, mortgage:160},
  {pos:35, name:'Phantom Express', type:'railroad', price:200, mortgage:100},
  {pos:36, name:'Chance', type:'chance'},
  {pos:37, name:'Royal Row', type:'property', group:'darkblue', price:350, rent:[35,175,500,1100,1300,1500], houseCost:200, mortgage:175},
  {pos:38, name:'Luxury Tax', type:'tax', price:100},
  {pos:39, name:'Empire Tower', type:'property', group:'darkblue', price:400, rent:[50,200,600,1400,1700,2000], houseCost:200, mortgage:200}
];

var COLOR_GROUPS = {};
(function() {
  for (var i = 0; i < BOARD_DATA.length; i++) {
    var s = BOARD_DATA[i];
    if (s.group) {
      if (!COLOR_GROUPS[s.group]) COLOR_GROUPS[s.group] = [];
      COLOR_GROUPS[s.group].push(s.pos);
    }
  }
})();

/* ──────────────────────────────────────
   3. CARDS
   ────────────────────────────────────── */
var CHANCE_CARDS = [
  { text: 'Advance to GO. Collect $200.', action: 'move-to', data: { pos: 0, collectGo: true } },
  { text: 'Advance to Inferno Ave. If you pass GO collect $200.', action: 'move-to', data: { pos: 24, collectGo: true } },
  { text: 'Advance to Neon Strip. If you pass GO collect $200.', action: 'move-to', data: { pos: 11, collectGo: true } },
  { text: 'Advance to Midnight Express. If you pass GO collect $200.', action: 'move-to', data: { pos: 5, collectGo: true } },
  { text: 'Advance to the nearest Railroad. Pay owner double rent.', action: 'nearest-railroad', data: {} },
  { text: 'Advance to the nearest Utility. Pay 10x dice if owned.', action: 'nearest-utility', data: {} },
  { text: 'Bank pays you dividend of $50.', action: 'collect', data: { amount: 50 } },
  { text: 'Get Out of Jail Free!', action: 'jail-card', data: {} },
  { text: 'Go back 3 spaces.', action: 'move-back', data: { spaces: 3 } },
  { text: 'Go directly to Jail. Do not pass GO.', action: 'go-to-jail', data: {} },
  { text: 'Make repairs on Taco Terrace & friends: $25 per house, $100 per hotel.', action: 'repairs', data: { perHouse: 25, perHotel: 100 } },
  { text: 'Pay poor tax of $15.', action: 'pay', data: { amount: 15 } },
  { text: 'Take a trip to Thunder Rail. If you pass GO collect $200.', action: 'move-to', data: { pos: 15, collectGo: true } },
  { text: 'You won a crossword competition! Collect $100.', action: 'collect', data: { amount: 100 } },
  { text: 'Your Empire stocks pay off. Collect $150.', action: 'collect', data: { amount: 150 } },
  { text: 'Street repairs assessment: $40 per house, $115 per hotel.', action: 'repairs', data: { perHouse: 40, perHotel: 115 } }
];

var COMMUNITY_CHEST = [
  { text: 'Advance to GO. Collect $200.', action: 'move-to', data: { pos: 0, collectGo: true } },
  { text: 'Bank error in your favor. Collect $200.', action: 'collect', data: { amount: 200 } },
  { text: "Doctor's fee. Pay $50.", action: 'pay', data: { amount: 50 } },
  { text: 'From sale of Ramen Row stock you get $50.', action: 'collect', data: { amount: 50 } },
  { text: 'Get Out of Jail Free!', action: 'jail-card', data: {} },
  { text: 'Go directly to Jail. Do not pass GO.', action: 'go-to-jail', data: {} },
  { text: 'Grand Opera Night at Velvet Lounge. Collect $50 from every player.', action: 'collect-from-all', data: { amount: 50 } },
  { text: 'Holiday fund matures. Collect $100.', action: 'collect', data: { amount: 100 } },
  { text: 'Income tax refund. Collect $20.', action: 'collect', data: { amount: 20 } },
  { text: "It's your birthday! Collect $10 from every player.", action: 'collect-from-all', data: { amount: 10 } },
  { text: 'Life insurance matures. Collect $100.', action: 'collect', data: { amount: 100 } },
  { text: 'Hospital fees. Pay $100.', action: 'pay', data: { amount: 100 } },
  { text: 'School fees. Pay $50.', action: 'pay', data: { amount: 50 } },
  { text: 'Receive consultancy fee. Collect $25.', action: 'collect', data: { amount: 25 } },
  { text: 'You inherit $100 from a mysterious relative.', action: 'collect', data: { amount: 100 } },
  { text: 'You won second prize in a beauty contest! Collect $10.', action: 'collect', data: { amount: 10 } }
];

/* ──────────────────────────────────────
   4. TOKEN RENDERING
   ────────────────────────────────────── */
function makeToken(seatIndex, characterId) {
  var div = document.createElement('div');
  div.className = 'board-token';
  div.setAttribute('data-seat', seatIndex);
  var ch = getCharacter(characterId);
  var tokenColor = ch ? ch.color : (PLAYER_COLORS[seatIndex] || '#888');
  div.textContent = (seatIndex + 1);
  div.style.background = tokenColor;
  div.style.color = (ch && ch.id === 'white') ? '#333' : '#fff';
  return div;
}

/* ──────────────────────────────────────
   5. MONOPOLY ENGINE
   ────────────────────────────────────── */
function MonopolyEngine() {
  this.reset();
}

MonopolyEngine.prototype.reset = function() {
  this.players = [];
  this.currentTurn = 0;
  this.propertyState = {};
  this.housesAvailable = 32;
  this.hotelsAvailable = 12;
  this.freeParkingPot = 0;
  this.chanceDeck = shuffleArray(CHANCE_CARDS);
  this.chestDeck = shuffleArray(COMMUNITY_CHEST);
  this.chanceIdx = 0;
  this.chestIdx = 0;
  this.gamePhase = 'rolling';
  this.lastDice = { die1: 0, die2: 0, total: 0, doubles: false };
  this.doublesCount = 0;
  this.turnNumber = 1;
};

MonopolyEngine.prototype.addPlayer = function(name, seatIndex, color, characterId) {
  this.players.push({
    seatIndex: seatIndex,
    name: name,
    money: 1500,
    position: 0,
    properties: [],
    inJail: false,
    jailTurns: 0,
    getOutOfJailCards: 0,
    bankrupt: false,
    connected: true,
    color: color || PLAYER_COLORS[seatIndex] || '#888',
    characterId: characterId || null
  });
};

MonopolyEngine.prototype.getPlayer = function(seat) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].seatIndex === seat) return this.players[i];
  }
  return null;
};

MonopolyEngine.prototype.currentPlayer = function() {
  return this.getPlayer(this.currentTurn);
};

MonopolyEngine.prototype.activePlayers = function() {
  var r = [];
  for (var i = 0; i < this.players.length; i++) {
    if (!this.players[i].bankrupt) r.push(this.players[i]);
  }
  return r;
};

MonopolyEngine.prototype.movePlayer = function(seat, steps) {
  var p = this.getPlayer(seat);
  if (!p) return { passedGo: false, newPos: 0 };
  var oldPos = p.position;
  var newPos = (oldPos + steps) % 40;
  if (newPos < 0) newPos += 40;
  var passedGo = (steps > 0) && (newPos < oldPos);
  if (passedGo) {
    p.money += 200;
  }
  p.position = newPos;
  return { passedGo: passedGo, newPos: newPos };
};

MonopolyEngine.prototype.movePlayerTo = function(seat, dest, collectGo) {
  var p = this.getPlayer(seat);
  if (!p) return { passedGo: false };
  var oldPos = p.position;
  var passedGo = false;
  if (collectGo && dest < oldPos && dest !== oldPos) {
    p.money += 200;
    passedGo = true;
  }
  p.position = dest;
  return { passedGo: passedGo };
};

MonopolyEngine.prototype.sendToJail = function(seat) {
  var p = this.getPlayer(seat);
  if (!p) return;
  p.position = 10;
  p.inJail = true;
  p.jailTurns = 0;
};

MonopolyEngine.prototype.getPropertyOwner = function(pos) {
  var ps = this.propertyState[pos];
  if (ps && ps.owner !== undefined && ps.owner !== null) return ps.owner;
  return null;
};

MonopolyEngine.prototype.ownsFullGroup = function(seat, group) {
  var positions = COLOR_GROUPS[group];
  if (!positions) return false;
  for (var i = 0; i < positions.length; i++) {
    if (this.getPropertyOwner(positions[i]) !== seat) return false;
  }
  return true;
};

MonopolyEngine.prototype.getOwnedRailroadCount = function(seat) {
  var rr = [5, 15, 25, 35];
  var count = 0;
  for (var i = 0; i < rr.length; i++) {
    var ps = this.propertyState[rr[i]];
    if (ps && ps.owner === seat && !ps.mortgaged) count++;
  }
  return count;
};

MonopolyEngine.prototype.getOwnedUtilityCount = function(seat) {
  var ut = [12, 28];
  var count = 0;
  for (var i = 0; i < ut.length; i++) {
    var ps = this.propertyState[ut[i]];
    if (ps && ps.owner === seat && !ps.mortgaged) count++;
  }
  return count;
};

MonopolyEngine.prototype.calculateRent = function(pos, diceTotal) {
  var space = BOARD_DATA[pos];
  var ps = this.propertyState[pos];
  if (!ps || ps.owner === null || ps.owner === undefined || ps.mortgaged) return 0;
  var owner = ps.owner;

  if (space.type === 'railroad') {
    var count = this.getOwnedRailroadCount(owner);
    return [0, 25, 50, 100, 200][count] || 0;
  }
  if (space.type === 'utility') {
    var uCount = this.getOwnedUtilityCount(owner);
    var mult = uCount >= 2 ? 10 : 4;
    return mult * (diceTotal || 7);
  }
  if (space.type === 'property') {
    var houses = ps.houses || 0;
    if (houses === 0) {
      var baseRent = space.rent[0];
      if (this.ownsFullGroup(owner, space.group)) baseRent *= 2;
      return baseRent;
    }
    return space.rent[houses] || space.rent[space.rent.length - 1];
  }
  return 0;
};

MonopolyEngine.prototype.buyProperty = function(seat, pos) {
  var space = BOARD_DATA[pos];
  var p = this.getPlayer(seat);
  if (!p || !space || !space.price) return false;
  if (this.propertyState[pos]) return false;
  if (p.money < space.price) return false;
  p.money -= space.price;
  p.properties.push(pos);
  this.propertyState[pos] = { owner: seat, houses: 0, mortgaged: false };
  return true;
};

MonopolyEngine.prototype.canBuildOn = function(seat, pos) {
  var space = BOARD_DATA[pos];
  if (!space || space.type !== 'property') return false;
  var ps = this.propertyState[pos];
  if (!ps || ps.owner !== seat || ps.mortgaged) return false;
  if (!this.ownsFullGroup(seat, space.group)) return false;
  var houses = ps.houses || 0;
  if (houses >= 5) return false;
  var group = COLOR_GROUPS[space.group];
  for (var i = 0; i < group.length; i++) {
    var ops = this.propertyState[group[i]];
    if (ops && ops.mortgaged) return false;
    var oh = (ops ? ops.houses : 0) || 0;
    if (oh < houses) return false;
  }
  if (houses === 4) {
    if (this.hotelsAvailable <= 0) return false;
  } else {
    if (this.housesAvailable <= 0) return false;
  }
  var p = this.getPlayer(seat);
  if (!p || p.money < space.houseCost) return false;
  return true;
};

MonopolyEngine.prototype.buildHouse = function(seat, pos) {
  if (!this.canBuildOn(seat, pos)) return false;
  var space = BOARD_DATA[pos];
  var ps = this.propertyState[pos];
  var p = this.getPlayer(seat);
  p.money -= space.houseCost;
  var oldH = ps.houses || 0;
  ps.houses = oldH + 1;
  if (ps.houses === 5) {
    this.housesAvailable += 4;
    this.hotelsAvailable--;
  } else {
    this.housesAvailable--;
  }
  return true;
};

MonopolyEngine.prototype.canSellHouseOn = function(seat, pos) {
  var space = BOARD_DATA[pos];
  if (!space || space.type !== 'property') return false;
  var ps = this.propertyState[pos];
  if (!ps || ps.owner !== seat) return false;
  var houses = ps.houses || 0;
  if (houses <= 0) return false;
  if (houses === 5 && this.housesAvailable < 4) return false;
  var group = COLOR_GROUPS[space.group];
  for (var i = 0; i < group.length; i++) {
    if (group[i] === pos) continue;
    var ops = this.propertyState[group[i]];
    var oh = (ops ? ops.houses : 0) || 0;
    if (oh > houses) return false;
  }
  return true;
};

MonopolyEngine.prototype.sellHouse = function(seat, pos) {
  if (!this.canSellHouseOn(seat, pos)) return false;
  var space = BOARD_DATA[pos];
  var ps = this.propertyState[pos];
  var p = this.getPlayer(seat);
  var refund = Math.floor(space.houseCost / 2);
  p.money += refund;
  if (ps.houses === 5) {
    ps.houses = 4;
    this.hotelsAvailable++;
    this.housesAvailable -= 4;
  } else {
    ps.houses--;
    this.housesAvailable++;
  }
  return true;
};

MonopolyEngine.prototype.canMortgage = function(seat, pos) {
  var ps = this.propertyState[pos];
  if (!ps || ps.owner !== seat || ps.mortgaged) return false;
  if ((ps.houses || 0) > 0) return false;
  var space = BOARD_DATA[pos];
  if (space.group) {
    var group = COLOR_GROUPS[space.group];
    for (var i = 0; i < group.length; i++) {
      var ops = this.propertyState[group[i]];
      if (ops && (ops.houses || 0) > 0) return false;
    }
  }
  return true;
};

MonopolyEngine.prototype.mortgageProperty = function(seat, pos) {
  if (!this.canMortgage(seat, pos)) return false;
  var space = BOARD_DATA[pos];
  var ps = this.propertyState[pos];
  var p = this.getPlayer(seat);
  ps.mortgaged = true;
  p.money += space.mortgage;
  return true;
};

MonopolyEngine.prototype.unmortgageProperty = function(seat, pos) {
  var ps = this.propertyState[pos];
  if (!ps || ps.owner !== seat || !ps.mortgaged) return false;
  var space = BOARD_DATA[pos];
  var cost = Math.floor(space.mortgage * 1.1);
  var p = this.getPlayer(seat);
  if (p.money < cost) return false;
  p.money -= cost;
  ps.mortgaged = false;
  return true;
};

MonopolyEngine.prototype.drawChance = function() {
  var card = this.chanceDeck[this.chanceIdx];
  this.chanceIdx = (this.chanceIdx + 1) % this.chanceDeck.length;
  return card;
};

MonopolyEngine.prototype.drawChest = function() {
  var card = this.chestDeck[this.chestIdx];
  this.chestIdx = (this.chestIdx + 1) % this.chestDeck.length;
  return card;
};

MonopolyEngine.prototype.executeCard = function(seat, card) {
  var p = this.getPlayer(seat);
  if (!p) return { type: 'error' };
  var result = { type: card.action, data: {} };

  switch (card.action) {
    case 'move-to':
      var mr = this.movePlayerTo(seat, card.data.pos, card.data.collectGo);
      result.data.passedGo = mr.passedGo;
      result.data.newPos = card.data.pos;
      break;
    case 'collect':
      p.money += card.data.amount;
      result.data.amount = card.data.amount;
      break;
    case 'pay':
      p.money -= card.data.amount;
      this.freeParkingPot += card.data.amount;
      result.data.amount = card.data.amount;
      break;
    case 'jail-card':
      p.getOutOfJailCards++;
      break;
    case 'go-to-jail':
      this.sendToJail(seat);
      break;
    case 'move-back':
      var newP = (p.position - card.data.spaces + 40) % 40;
      p.position = newP;
      result.data.newPos = newP;
      break;
    case 'nearest-railroad':
      var railroads = [5, 15, 25, 35];
      var nearest = railroads[0];
      for (var ri = 0; ri < railroads.length; ri++) {
        if (railroads[ri] > p.position) { nearest = railroads[ri]; break; }
        if (ri === railroads.length - 1) nearest = railroads[0];
      }
      var mrr = this.movePlayerTo(seat, nearest, true);
      result.data.passedGo = mrr.passedGo;
      result.data.newPos = nearest;
      result.data.doubleRent = true;
      break;
    case 'nearest-utility':
      var utils = [12, 28];
      var nearestU = utils[0];
      for (var ui = 0; ui < utils.length; ui++) {
        if (utils[ui] > p.position) { nearestU = utils[ui]; break; }
        if (ui === utils.length - 1) nearestU = utils[0];
      }
      var mru = this.movePlayerTo(seat, nearestU, true);
      result.data.passedGo = mru.passedGo;
      result.data.newPos = nearestU;
      result.data.tenXDice = true;
      break;
    case 'collect-from-all':
      var active = this.activePlayers();
      var total = 0;
      for (var ci = 0; ci < active.length; ci++) {
        if (active[ci].seatIndex !== seat) {
          active[ci].money -= card.data.amount;
          total += card.data.amount;
        }
      }
      p.money += total;
      result.data.total = total;
      break;
    case 'repairs':
      var rCost = 0;
      for (var rpos in this.propertyState) {
        if (this.propertyState.hasOwnProperty(rpos)) {
          var pst = this.propertyState[rpos];
          if (pst.owner === seat) {
            var rh = pst.houses || 0;
            if (rh === 5) rCost += card.data.perHotel;
            else rCost += rh * card.data.perHouse;
          }
        }
      }
      p.money -= rCost;
      this.freeParkingPot += rCost;
      result.data.cost = rCost;
      break;
  }
  return result;
};

MonopolyEngine.prototype.payTax = function(seat, pos) {
  var space = BOARD_DATA[pos];
  var p = this.getPlayer(seat);
  if (!p || !space) return;
  p.money -= space.price;
  this.freeParkingPot += space.price;
};

MonopolyEngine.prototype.collectFreeParking = function(seat) {
  var p = this.getPlayer(seat);
  if (!p) return 0;
  var amount = this.freeParkingPot;
  p.money += amount;
  this.freeParkingPot = 0;
  return amount;
};

MonopolyEngine.prototype.tryJailRoll = function(seat, d1, d2) {
  var p = this.getPlayer(seat);
  if (!p || !p.inJail) return { freed: false, forcePay: false };
  p.jailTurns++;
  if (d1 === d2) {
    p.inJail = false;
    p.jailTurns = 0;
    return { freed: true, forcePay: false };
  }
  if (p.jailTurns >= 3) {
    p.money -= 50;
    p.inJail = false;
    p.jailTurns = 0;
    return { freed: true, forcePay: true };
  }
  return { freed: false, forcePay: false };
};

MonopolyEngine.prototype.payJailFine = function(seat) {
  var p = this.getPlayer(seat);
  if (!p || !p.inJail) return false;
  if (p.money < 50) return false;
  p.money -= 50;
  p.inJail = false;
  p.jailTurns = 0;
  return true;
};

MonopolyEngine.prototype.useJailCard = function(seat) {
  var p = this.getPlayer(seat);
  if (!p || !p.inJail || p.getOutOfJailCards <= 0) return false;
  p.getOutOfJailCards--;
  p.inJail = false;
  p.jailTurns = 0;
  return true;
};

MonopolyEngine.prototype.totalAssets = function(seat) {
  var p = this.getPlayer(seat);
  if (!p) return 0;
  var total = p.money;
  for (var i = 0; i < p.properties.length; i++) {
    var pos = p.properties[i];
    var space = BOARD_DATA[pos];
    var ps = this.propertyState[pos];
    if (!ps || !ps.mortgaged) {
      total += space.mortgage || 0;
    }
    if (ps) {
      var h = ps.houses || 0;
      if (h > 0 && space.houseCost) {
        total += Math.floor(h * space.houseCost / 2);
      }
    }
  }
  return total;
};

MonopolyEngine.prototype.isBankrupt = function(seat) {
  return this.totalAssets(seat) < 0;
};

MonopolyEngine.prototype.declareBankruptcy = function(seat, creditorSeat) {
  var p = this.getPlayer(seat);
  if (!p) return;
  p.bankrupt = true;

  if (creditorSeat !== null && creditorSeat !== undefined) {
    var creditor = this.getPlayer(creditorSeat);
    if (creditor) {
      if (p.money > 0) creditor.money += p.money;
      for (var i = 0; i < p.properties.length; i++) {
        var pos = p.properties[i];
        var ps = this.propertyState[pos];
        if (ps) {
          if (ps.houses && ps.houses > 0) {
            if (ps.houses === 5) this.hotelsAvailable++;
            else this.housesAvailable += ps.houses;
            ps.houses = 0;
          }
          ps.owner = creditorSeat;
          creditor.properties.push(pos);
        }
      }
      creditor.getOutOfJailCards += p.getOutOfJailCards;
    }
  } else {
    for (var j = 0; j < p.properties.length; j++) {
      var pos2 = p.properties[j];
      var ps2 = this.propertyState[pos2];
      if (ps2) {
        if (ps2.houses === 5) this.hotelsAvailable++;
        else if (ps2.houses > 0) this.housesAvailable += ps2.houses;
        delete this.propertyState[pos2];
      }
    }
  }
  p.properties = [];
  p.money = 0;
  p.getOutOfJailCards = 0;
  p.inJail = false;
};

MonopolyEngine.prototype.nextTurn = function() {
  var active = this.activePlayers();
  if (active.length <= 1) return;
  var idx = -1;
  for (var i = 0; i < active.length; i++) {
    if (active[i].seatIndex === this.currentTurn) { idx = i; break; }
  }
  var nextIdx = (idx + 1) % active.length;
  this.currentTurn = active[nextIdx].seatIndex;
  this.doublesCount = 0;
  this.gamePhase = 'rolling';
  this.turnNumber++;
};

MonopolyEngine.prototype.checkWinner = function() {
  var active = this.activePlayers();
  if (active.length === 1) return active[0];
  return null;
};

MonopolyEngine.prototype.executeTrade = function(offererSeat, receiverSeat, offererCash, receiverCash, offererProps, receiverProps) {
  var offerer = this.getPlayer(offererSeat);
  var receiver = this.getPlayer(receiverSeat);
  if (!offerer || !receiver) return false;
  offerer.money -= offererCash;
  offerer.money += receiverCash;
  receiver.money -= receiverCash;
  receiver.money += offererCash;
  var i, pos, ps, idx;
  for (i = 0; i < offererProps.length; i++) {
    pos = offererProps[i];
    ps = this.propertyState[pos];
    if (ps) ps.owner = receiverSeat;
    idx = offerer.properties.indexOf(pos);
    if (idx >= 0) offerer.properties.splice(idx, 1);
    receiver.properties.push(pos);
  }
  for (i = 0; i < receiverProps.length; i++) {
    pos = receiverProps[i];
    ps = this.propertyState[pos];
    if (ps) ps.owner = offererSeat;
    idx = receiver.properties.indexOf(pos);
    if (idx >= 0) receiver.properties.splice(idx, 1);
    offerer.properties.push(pos);
  }
  return true;
};

MonopolyEngine.prototype.serialise = function() {
  return {
    players: JSON.parse(JSON.stringify(this.players)),
    currentTurn: this.currentTurn,
    propertyState: JSON.parse(JSON.stringify(this.propertyState)),
    housesAvailable: this.housesAvailable,
    hotelsAvailable: this.hotelsAvailable,
    freeParkingPot: this.freeParkingPot,
    chanceDeck: this.chanceDeck.slice(),
    chestDeck: this.chestDeck.slice(),
    chanceIdx: this.chanceIdx,
    chestIdx: this.chestIdx,
    gamePhase: this.gamePhase,
    lastDice: JSON.parse(JSON.stringify(this.lastDice)),
    doublesCount: this.doublesCount,
    turnNumber: this.turnNumber
  };
};

MonopolyEngine.prototype.initFromState = function(state) {
  if (!state) return;
  this.players = state.players || [];
  this.currentTurn = state.currentTurn || 0;
  this.propertyState = state.propertyState || {};
  this.housesAvailable = (state.housesAvailable !== undefined) ? state.housesAvailable : 32;
  this.hotelsAvailable = (state.hotelsAvailable !== undefined) ? state.hotelsAvailable : 12;
  this.freeParkingPot = state.freeParkingPot || 0;
  if (state.chanceDeck) this.chanceDeck = state.chanceDeck;
  if (state.chestDeck) this.chestDeck = state.chestDeck;
  this.chanceIdx = state.chanceIdx || 0;
  this.chestIdx = state.chestIdx || 0;
  this.gamePhase = state.gamePhase || 'rolling';
  this.lastDice = state.lastDice || { die1:0, die2:0, total:0, doubles:false };
  this.doublesCount = state.doublesCount || 0;
  this.turnNumber = state.turnNumber || 1;
};

/* ──────────────────────────────────────
   6. MONOPOLY CLIENT
   ────────────────────────────────────── */
function MonopolyClient() {
  this.socket = null;
  this.engine = new MonopolyEngine();
  this.mySeat = null;
  this.myName = '';
  this.roomCode = '';
  this.isHost = false;
  this.players = [];
  this.reconnectToken = null;
  this._animating = false;
  this._pendingCard = null;
  this._pendingCardType = null;
  this._rentCreditor = null;
  this._characterSelections = {};
  this._characterConfirmed = {};
  this._myCharacter = null;
  this._gameStarted = false;
}

MonopolyClient.prototype.init = function() {
  this._bindLanding();
  this.connectSocket();
  this._tryReconnect();
};

/* ────────── SOCKET ────────── */
MonopolyClient.prototype.connectSocket = function() {
  var self = this;
  this.socket = io({ reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 1000 });

  this.socket.on('connect', function() {
    $('#connection-dot').className = 'connection-dot connected';
    $('#connection-label').textContent = 'Connected';
  });

  this.socket.on('disconnect', function() {
    $('#connection-dot').className = 'connection-dot';
    $('#connection-label').textContent = 'Disconnected';
    showToast('Disconnected from server', 'error');
  });

  this.socket.on('connect_error', function() {
    $('#connection-dot').className = 'connection-dot';
    $('#connection-label').textContent = 'Connection error';
  });

  this.socket.on('room-created', function(data) { self._onRoomCreated(data); });
  this.socket.on('room-joined', function(data) { self._onRoomJoined(data); });
  this.socket.on('player-joined', function(data) { self._onPlayerJoined(data); });
  this.socket.on('player-left', function(data) { self._onPlayerLeft(data); });
  this.socket.on('player-disconnected', function(data) { self._onPlayerDisconnected(data); });
  this.socket.on('player-reconnected', function(data) { self._onPlayerReconnected(data); });
  this.socket.on('player-abandoned', function(data) { self._onPlayerAbandoned(data); });

  this.socket.on('game-started', function(data) {
    // Extract player list and host info from server data
    if (data && data.players) self.players = data.players;
    if (data && data.hostId) self.isHost = (data.hostId === self.socket.id);
    console.log('[game-started] players:', self.players.length, 'isHost:', self.isHost);
    self._enterCharacterSelect();
  });

  this.socket.on('dice-rolled', function(data) {
    self._onDiceRolled(data);
  });

  this.socket.on('turn-changed', function(data) {
    // BUG FIX #1: Server authoritative turn
    self.engine.currentTurn = data.currentTurn;
    self.engine.doublesCount = 0;
    self.engine.gamePhase = 'rolling';
    self.engine.turnNumber = data.turnNumber || (self.engine.turnNumber + 1);
    self.renderGame();
    var cp = self.engine.currentPlayer();
    if (cp) self.addLog(cp.name + "'s turn");
  });

  this.socket.on('game-state-update', function(data) {
    self.engine.initFromState(data);
    self.renderGame();
  });

  this.socket.on('game-action', function(data) {
    self._handleGameAction(data);
  });

  this.socket.on('chat-message', function(data) {
    self._appendChat(data);
  });

  this.socket.on('error-message', function(data) {
    var msg = data.error || data.message || 'Error';
    showToast(msg, 'error');
    var le = $('#landing-error');
    if (le) le.textContent = msg;
  });
};

/* ────────── LANDING ────────── */
MonopolyClient.prototype._bindLanding = function() {
  var self = this;
  var nameInput = $('#input-name');
  var codeInput = $('#input-code');
  var btnCreate = $('#btn-create');
  var btnJoin = $('#btn-join');

  function updateButtons() {
    var hasName = nameInput.value.trim().length >= 1;
    btnCreate.disabled = !hasName;
    btnJoin.disabled = !(hasName && codeInput.value.trim().length >= 4);
  }

  nameInput.addEventListener('input', updateButtons);
  codeInput.addEventListener('input', updateButtons);

  nameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!btnCreate.disabled) self.createRoom();
    }
  });

  codeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!btnJoin.disabled) self.joinRoom();
    }
  });

  btnCreate.addEventListener('click', function() { self.createRoom(); });
  btnJoin.addEventListener('click', function() { self.joinRoom(); });
};

MonopolyClient.prototype.createRoom = function() {
  var name = $('#input-name').value.trim();
  if (!name) return;
  this.myName = name;
  this.isHost = true;
  $('#landing-error').textContent = '';
  this.socket.emit('create-room', { playerName: name });
};

MonopolyClient.prototype.joinRoom = function() {
  var name = $('#input-name').value.trim();
  var code = $('#input-code').value.trim().toUpperCase();
  if (!name || !code) return;
  this.myName = name;
  this.isHost = false;
  $('#landing-error').textContent = '';
  this.socket.emit('join-room', { playerName: name, roomCode: code });
};

MonopolyClient.prototype._onRoomCreated = function(data) {
  if (data.success === false) {
    $('#landing-error').textContent = data.error || 'Failed to create room';
    return;
  }
  this.roomCode = data.roomCode;
  this.mySeat = 0; // Creator is always seat 0
  this.isHost = true;
  // Server sends players inside gameState
  var gs = data.gameState || data;
  this.players = gs.players || data.players || [];
  this.reconnectToken = data.reconnectToken || null;
  saveSession('monopoly-session', {
    roomCode: this.roomCode,
    mySeat: this.mySeat,
    myName: this.myName,
    isHost: this.isHost,
    reconnectToken: this.reconnectToken
  });
  this._enterWaitingRoom();
};

MonopolyClient.prototype._onRoomJoined = function(data) {
  if (data.success === false) {
    $('#landing-error').textContent = data.error || 'Failed to join room';
    return;
  }
  this.roomCode = data.roomCode;
  this.mySeat = data.seatIndex;
  // Server sends players inside gameState
  var gs = data.gameState || data;
  this.players = gs.players || data.players || [];
  this.reconnectToken = data.reconnectToken || null;
  // Determine host from gameState
  if (gs.hostId) {
    var mySocketId = this.socket.id;
    this.isHost = (gs.hostId === mySocketId);
  } else if (data.isHost !== undefined) {
    this.isHost = data.isHost;
  }
  saveSession('monopoly-session', {
    roomCode: this.roomCode,
    mySeat: this.mySeat,
    myName: this.myName,
    isHost: this.isHost,
    reconnectToken: this.reconnectToken
  });
  // If game already started, might need to go to game screen
  if (data.gameStarted && data.gameState) {
    this.engine.initFromState(data.gameState);
    this._gameStarted = true;
    this._startActualGame();
  } else if (data.gameStarted) {
    this._enterCharacterSelect();
  } else {
    this._enterWaitingRoom();
  }
};

MonopolyClient.prototype._onPlayerJoined = function(data) {
  // Server sends gameState.players with the full player list
  var gs = data.gameState || {};
  if (gs.players) {
    this.players = gs.players;
  } else if (data.player) {
    var found = false;
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].seatIndex === data.player.seatIndex) { found = true; break; }
    }
    if (!found) this.players.push(data.player);
  }
  // Re-check host status
  if (gs.hostId) this.isHost = (gs.hostId === this.socket.id);
  this._renderPlayerList();
  this._renderWaitingStatus();
  showToast((data.player ? data.player.name : 'Someone') + ' joined!', 'info');
};

MonopolyClient.prototype._onPlayerLeft = function(data) {
  var gs = data.gameState || {};
  if (gs.players) this.players = gs.players;
  // Re-check host & seat
  if (gs.hostId) this.isHost = (gs.hostId === this.socket.id);
  // Re-find our seat (might have shifted)
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id === this.socket.id) {
      this.mySeat = this.players[i].seatIndex;
      break;
    }
  }
  this._renderPlayerList();
  this._renderWaitingStatus();
};

MonopolyClient.prototype._onPlayerDisconnected = function(data) {
  if (data.seatIndex !== undefined) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].seatIndex === data.seatIndex) {
        this.players[i].connected = false;
      }
    }
    var ep = this.engine.getPlayer(data.seatIndex);
    if (ep) ep.connected = false;
  }
  this._renderPlayerList();
  this.renderGame();
  showToast((data.playerName || 'A player') + ' disconnected', 'error');
};

MonopolyClient.prototype._onPlayerReconnected = function(data) {
  if (data.seatIndex !== undefined) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].seatIndex === data.seatIndex) {
        this.players[i].connected = true;
      }
    }
    var ep = this.engine.getPlayer(data.seatIndex);
    if (ep) ep.connected = true;
  }
  this._renderPlayerList();
  this.renderGame();
  showToast((data.playerName || 'A player') + ' reconnected!', 'info');
};

MonopolyClient.prototype._onPlayerAbandoned = function(data) {
  if (data.seatIndex !== undefined) {
    var ep = this.engine.getPlayer(data.seatIndex);
    if (ep) { ep.bankrupt = true; ep.connected = false; }
  }
  this.renderGame();
  var winner = this.engine.checkWinner();
  if (winner) this.showGameOverModal(winner);
};

/* ────────── WAITING ROOM ────────── */
MonopolyClient.prototype._enterWaitingRoom = function() {
  showScreen('screen-waiting');
  var codeEl = $('#room-code-display');
  if (codeEl) codeEl.textContent = this.roomCode || '------';
  this._renderPlayerList();
  this._renderWaitingStatus();
  this._bindWaitingRoom();
};

MonopolyClient.prototype._bindWaitingRoom = function() {
  var self = this;
  var bound = this._waitingBound;
  if (bound) return;
  this._waitingBound = true;

  $('#btn-copy-code').addEventListener('click', function() {
    var code = self.roomCode || $('#room-code-display').textContent;
    if (!code || code === '------') { showToast('No room code yet', 'error'); return; }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(function() {
        showToast('Copied: ' + code, 'success');
      }).catch(function() {
        showToast('Code: ' + code, 'info');
      });
    } else {
      showToast('Code: ' + code, 'info');
    }
  });

  $('#btn-start-game').addEventListener('click', function() {
    if (self.isHost && self.players.length >= 2) {
      self.socket.emit('game-action', { action: 'start-game' });
    }
  });

  $('#btn-leave-room').addEventListener('click', function() {
    self.socket.emit('leave-room');
    clearSession('monopoly-session');
    showScreen('screen-landing');
  });

  // Waiting room chat
  $('#btn-send-chat').addEventListener('click', function() { self.sendChat('input-chat'); });
  $('#input-chat').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); self.sendChat('input-chat'); }
  });
};

MonopolyClient.prototype._renderPlayerList = function() {
  var list = $('#player-list');
  if (!list) return;
  var html = '';
  for (var i = 0; i < this.players.length; i++) {
    var p = this.players[i];
    var color = PLAYER_COLORS[p.seatIndex] || '#888';
    var dc = (p.connected === false) ? ' (disconnected)' : '';
    var isPlayerHost = (p.seatIndex === 0 || p.id === (this.players[0] && this.players[0].id));
    var hostBadge = isPlayerHost ? ' <span style="background:rgba(240,200,80,.15);color:#f0c850;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;margin-left:6px;">HOST</span>' : '';
    var youBadge = (p.seatIndex === this.mySeat) ? ' <span style="background:rgba(52,152,219,.15);color:#3498db;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;margin-left:4px;">YOU</span>' : '';
    html += '<div class="player-row" style="border-left:4px solid ' + color + ';padding:8px 12px;margin:4px 0;background:rgba(255,255,255,0.05);border-radius:6px;">';
    html += '<span style="color:' + color + ';font-weight:600;font-size:14px;">' + escHtml(p.name || p.playerName || ('Player ' + (p.seatIndex + 1))) + '</span>';
    html += hostBadge + youBadge;
    if (dc) html += '<span style="color:#e74c3c;font-size:11px;">' + dc + '</span>';
    html += '</div>';
  }
  list.innerHTML = html;
};

MonopolyClient.prototype._renderWaitingStatus = function() {
  var count = this.players.length;
  $('#player-count-badge').textContent = count + '/6';
  if (this.isHost) {
    if (count >= 2) {
      $('#btn-start-game').style.display = '';
      $('#waiting-status').textContent = 'Ready to start!';
    } else {
      $('#btn-start-game').style.display = 'none';
      $('#waiting-status').textContent = 'Need at least 2 players...';
    }
    $('#waiting-for-host').style.display = 'none';
  } else {
    $('#btn-start-game').style.display = 'none';
    if (count >= 2) {
      $('#waiting-status').textContent = '';
      $('#waiting-for-host').style.display = '';
      $('#waiting-for-host').textContent = 'Waiting for host to start...';
    } else {
      $('#waiting-status').textContent = 'Waiting for more players...';
      $('#waiting-for-host').style.display = 'none';
    }
  }
};

MonopolyClient.prototype.sendChat = function(inputId) {
  var input = $('#' + inputId);
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  this.socket.emit('chat-message', { message: msg });
};

MonopolyClient.prototype._appendChat = function(data) {
  var color = PLAYER_COLORS[data.seatIndex] || '#aaa';
  var name = escHtml(data.playerName || data.name || 'Unknown');
  var msg = escHtml(data.message || '');
  var html = '<div class="chat-msg" style="margin:4px 0;font-size:13px;"><span style="color:' + color + ';font-weight:600;">' + name + ':</span> ' + msg + '</div>';

  // Append to both chat areas
  var waitChat = $('#chat-messages');
  var gameChat = $('#game-chat-messages');
  if (waitChat) { waitChat.innerHTML += html; waitChat.scrollTop = waitChat.scrollHeight; }
  if (gameChat) { gameChat.innerHTML += html; gameChat.scrollTop = gameChat.scrollHeight; }
};

/* ────────── CHARACTER SELECT ────────── */
MonopolyClient.prototype._enterCharacterSelect = function() {
  showScreen('screen-character-select');
  this._characterSelections = {};
  this._characterConfirmed = {};
  this._myCharacter = null;
  this._renderCharacterGrid();
  this._bindCharacterSelect();
};

MonopolyClient.prototype._bindCharacterSelect = function() {
  var self = this;
  if (this._charBound) return;
  this._charBound = true;

  $('#btn-confirm-character').addEventListener('click', function() {
    self._confirmCharacter();
  });
};

MonopolyClient.prototype._renderCharacterGrid = function() {
  var grid = $('#character-grid');
  if (!grid) return;
  var html = '';
  for (var i = 0; i < CHARACTERS.length; i++) {
    var ch = CHARACTERS[i];
    var taken = false;
    var takenBy = null;
    var selectedByMe = (this._myCharacter === ch.id);
    for (var seat in this._characterSelections) {
      if (this._characterSelections.hasOwnProperty(seat) && this._characterSelections[seat] === ch.id) {
        taken = true;
        takenBy = seat;
        break;
      }
    }
    var cls = 'character-card';
    if (selectedByMe) cls += ' selected';
    if (taken && !selectedByMe) cls += ' taken';
    var confirmed = false;
    if (takenBy !== null && this._characterConfirmed[takenBy]) confirmed = true;

    html += '<div class="' + cls + '" data-char="' + ch.id + '" style="';
    html += 'cursor:' + ((taken && !selectedByMe) ? 'not-allowed' : 'pointer') + ';';
    html += 'opacity:' + ((taken && !selectedByMe) ? '0.4' : '1') + ';';
    html += 'border:3px solid ' + (selectedByMe ? '#f39c12' : (taken ? '#666' : 'rgba(255,255,255,0.2)')) + ';';
    html += 'border-radius:12px;padding:20px;text-align:center;background:rgba(255,255,255,0.05);transition:all 0.2s;">';
    html += '<div style="width:60px;height:60px;border-radius:50%;background:' + ch.color + ';margin:0 auto 10px;border:3px solid rgba(255,255,255,0.3);box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;">' + ch.name + '</div>';
    if (taken && !selectedByMe) {
      var takerName = '';
      for (var pi = 0; pi < this.players.length; pi++) {
        if (String(this.players[pi].seatIndex) === String(takenBy)) {
          takerName = this.players[pi].name || this.players[pi].playerName || '';
          break;
        }
      }
      html += '<div style="font-size:11px;color:#e74c3c;margin-top:4px;">' + escHtml(takerName) + (confirmed ? ' ✓' : '') + '</div>';
    }
    if (selectedByMe && this._characterConfirmed[String(this.mySeat)]) {
      html += '<div style="font-size:11px;color:#2ecc71;margin-top:4px;">LOCKED IN ✓</div>';
    }
    html += '</div>';
  }
  grid.innerHTML = html;

  // Bind clicks
  var self = this;
  var cards = grid.querySelectorAll('.character-card');
  for (var c = 0; c < cards.length; c++) {
    (function(card) {
      card.addEventListener('click', function() {
        var charId = card.getAttribute('data-char');
        self._selectCharacter(charId);
      });
    })(cards[c]);
  }

  // Update confirm button
  var confirmBtn = $('#btn-confirm-character');
  if (this._myCharacter && !this._characterConfirmed[String(this.mySeat)]) {
    confirmBtn.disabled = false;
  } else {
    confirmBtn.disabled = true;
  }

  // Update preview
  this._renderCharacterPreview();

  // Waiting text
  var waitingText = $('#character-waiting');
  if (this._characterConfirmed[String(this.mySeat)]) {
    waitingText.style.display = '';
    waitingText.textContent = 'Waiting for other players to lock in...';
  } else {
    waitingText.style.display = 'none';
  }
};

MonopolyClient.prototype._renderCharacterPreview = function() {
  var preview = $('#selected-players-preview');
  if (!preview) return;
  var html = '';
  for (var i = 0; i < this.players.length; i++) {
    var p = this.players[i];
    var charId = this._characterSelections[String(p.seatIndex)];
    var ch = charId ? getCharacter(charId) : null;
    var confirmed = this._characterConfirmed[String(p.seatIndex)];
    var color = PLAYER_COLORS[p.seatIndex] || '#888';
    html += '<div style="display:inline-flex;align-items:center;margin:4px 8px;padding:4px 10px;border-radius:20px;background:rgba(255,255,255,0.08);border:2px solid ' + (confirmed ? '#2ecc71' : 'transparent') + ';">';
    var prevColor = ch ? ch.color : '#555';
    html += '<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:' + prevColor + ';border:2px solid rgba(255,255,255,0.3);margin-right:6px;flex-shrink:0;"></span>';
    html += '<span style="color:' + color + ';font-size:13px;font-weight:600;">' + escHtml(p.name || p.playerName || '') + '</span>';
    if (confirmed) html += '<span style="color:#2ecc71;margin-left:4px;">✓</span>';
    html += '</div>';
  }
  preview.innerHTML = html;
};

MonopolyClient.prototype._selectCharacter = function(charId) {
  // Check if already confirmed
  if (this._characterConfirmed[String(this.mySeat)]) return;
  // Check if taken by someone else
  for (var seat in this._characterSelections) {
    if (this._characterSelections.hasOwnProperty(seat) && this._characterSelections[seat] === charId && String(seat) !== String(this.mySeat)) {
      showToast('That character is already taken!', 'error');
      return;
    }
  }
  this._myCharacter = charId;
  this._characterSelections[String(this.mySeat)] = charId;
  this.socket.emit('game-action', { action: 'select-character', payload: { characterId: charId, seatIndex: this.mySeat } });
  this._renderCharacterGrid();
};

MonopolyClient.prototype._confirmCharacter = function() {
  if (!this._myCharacter) return;
  if (this._characterConfirmed[String(this.mySeat)]) return;
  this._characterConfirmed[String(this.mySeat)] = true;
  this.socket.emit('game-action', { action: 'confirm-character', payload: { characterId: this._myCharacter, seatIndex: this.mySeat } });
  this._renderCharacterGrid();
  this._checkAllConfirmed();
};

MonopolyClient.prototype._checkAllConfirmed = function() {
  var allConfirmed = true;
  for (var i = 0; i < this.players.length; i++) {
    if (!this._characterConfirmed[String(this.players[i].seatIndex)]) {
      allConfirmed = false;
      break;
    }
  }
  console.log('[checkAllConfirmed] players:', this.players.length, 'confirmed:', JSON.stringify(this._characterConfirmed), 'allConfirmed:', allConfirmed, 'isHost:', this.isHost);
  if (allConfirmed && this.isHost) {
    console.log('[checkAllConfirmed] All confirmed! Host starting game...');
    this.socket.emit('game-action', { action: 'all-characters-confirmed', payload: { selections: this._characterSelections } });
    // Host must also start locally — server sends game-action to everyone EXCEPT sender
    this._startActualGame();
  }
};

MonopolyClient.prototype._startActualGame = function() {
  this._gameStarted = true;
  showScreen('screen-game');

  // Init engine players
  this.engine.reset();
  for (var i = 0; i < this.players.length; i++) {
    var p = this.players[i];
    var seat = p.seatIndex;
    var charId = this._characterSelections[String(seat)] || null;
    var ch = getCharacter(charId);
    var playerColor = ch ? ch.color : PLAYER_COLORS[seat];
    this.engine.addPlayer(
      p.name || p.playerName || ('Player ' + (seat + 1)),
      seat,
      playerColor,
      charId
    );
  }

  this._bindGameButtons();
  this.renderGame();
  this.addLog('Game started!');
  sfx('go');
};

/* ────────── DICE ────────── */
MonopolyClient.prototype.rollDice = function() {
  if (this._animating) return;
  var cp = this.engine.currentPlayer();
  if (!cp || cp.seatIndex !== this.mySeat) {
    showToast("It's not your turn!", 'error');
    return;
  }
  if (this.engine.gamePhase !== 'rolling') return;

  if (cp.inJail) {
    this.showJailOptions();
    return;
  }

  this.socket.emit('game-action', { action: 'roll-dice' });
};

MonopolyClient.prototype._onDiceRolled = function(data) {
  var self = this;
  var d1 = data.die1;
  var d2 = data.die2;
  sfx('dice');

  this.engine.lastDice = { die1: d1, die2: d2, total: d1 + d2, doubles: d1 === d2 };

  this.animateDice(d1, d2, function() {
    if (data.seatIndex === self.mySeat) {
      self.handleMyRoll(data);
    } else {
      // Other player rolled, just update display
      self.renderGame();
    }
  });
};

MonopolyClient.prototype.animateDice = function(d1, d2, callback) {
  var self = this;
  this._animating = true;
  var die1 = $('#die-1');
  var die2 = $('#die-2');
  var diceArea = $('#dice-area');
  if (!die1 || !die2) { this._animating = false; if (callback) callback(); return; }

  die1.className = 'die rolling';
  die2.className = 'die rolling';
  if (diceArea) diceArea.classList.add('dice-shaking');

  setTimeout(function() {
    die1.className = 'die show-' + d1;
    die2.className = 'die show-' + d2;
    if (diceArea) diceArea.classList.remove('dice-shaking');

    var result = $('#dice-result');
    if (result) {
      result.textContent = d1 + ' + ' + d2 + ' = ' + (d1 + d2);
      if (d1 === d2) result.textContent += ' DOUBLES!';
      result.className = 'dice-result-pop';
      setTimeout(function() { result.className = ''; }, 600);
    }

    self._animating = false;
    if (callback) setTimeout(callback, 300);
  }, 800);
};

MonopolyClient.prototype.showJailOptions = function() {
  var self = this;
  var cp = this.engine.currentPlayer();
  var html = '<div class="modal-header"><h3>You\'re in Jail!</h3></div>';
  html += '<div class="modal-body" style="text-align:center;padding:20px;">';
  html += '<p style="font-size:14px;margin-bottom:16px;">Turn ' + (cp.jailTurns + 1) + ' of 3 in jail.</p>';
  html += '<button id="jail-roll" class="btn btn-primary" style="margin:6px;">🎲 Roll for Doubles</button><br>';
  if (cp.money >= 50) {
    html += '<button id="jail-pay" class="btn btn-warning" style="margin:6px;">💰 Pay $50 Fine</button><br>';
  }
  if (cp.getOutOfJailCards > 0) {
    html += '<button id="jail-card" class="btn btn-success" style="margin:6px;">🃏 Use Get Out of Jail Card</button><br>';
  }
  html += '</div>';

  this.showCustomModal(html);

  setTimeout(function() {
    var rollBtn = document.getElementById('jail-roll');
    var payBtn = document.getElementById('jail-pay');
    var cardBtn = document.getElementById('jail-card');

    if (rollBtn) rollBtn.addEventListener('click', function() {
      self.closeCustomModal();
      self.socket.emit('game-action', { action: 'roll-dice' });
    });
    if (payBtn) payBtn.addEventListener('click', function() {
      self.closeCustomModal();
      self.engine.payJailFine(self.mySeat);
      self.addLog(cp.name + ' paid $50 jail fine');
      self.broadcastAction('jail-action', { seat: self.mySeat, type: 'pay-fine' });
      self.syncState();
      self.engine.gamePhase = 'rolling';
      self.renderGame();
    });
    if (cardBtn) cardBtn.addEventListener('click', function() {
      self.closeCustomModal();
      self.engine.useJailCard(self.mySeat);
      self.addLog(cp.name + ' used Get Out of Jail card');
      self.broadcastAction('jail-action', { seat: self.mySeat, type: 'use-card' });
      self.syncState();
      self.engine.gamePhase = 'rolling';
      self.renderGame();
    });
  }, 50);
};

MonopolyClient.prototype.handleMyRoll = function(data) {
  var d1 = data.die1;
  var d2 = data.die2;
  var total = d1 + d2;
  var cp = this.engine.currentPlayer();
  if (!cp) return;

  // Jail roll
  if (cp.inJail) {
    var jailResult = this.engine.tryJailRoll(this.mySeat, d1, d2);
    if (jailResult.freed) {
      if (jailResult.forcePay) {
        this.addLog(cp.name + ' failed 3 jail rolls, paid $50');
      } else {
        this.addLog(cp.name + ' rolled doubles and escaped jail!');
      }
      // Now move
      var mr = this.engine.movePlayer(this.mySeat, total);
      if (mr.passedGo) { this.addLog(cp.name + ' passed GO! +$200'); sfx('go'); }
      this.renderGame();
      this.syncState();
      this.handleLanding(mr.newPos);
    } else {
      this.addLog(cp.name + ' failed to escape jail (' + d1 + '+' + d2 + ')');
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      this.endTurn();
    }
    return;
  }

  // Doubles logic
  if (d1 === d2) {
    this.engine.doublesCount++;
    if (this.engine.doublesCount >= 3) {
      this.addLog(cp.name + ' rolled 3 doubles! Go to Jail!');
      this.engine.sendToJail(this.mySeat);
      sfx('jail');
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      this.endTurn();
      return;
    }
  }

  var mr = this.engine.movePlayer(this.mySeat, total);
  if (mr.passedGo) { this.addLog(cp.name + ' passed GO! +$200'); sfx('go'); }
  this.addLog(cp.name + ' rolled ' + d1 + '+' + d2 + '=' + total + ', landed on ' + BOARD_DATA[mr.newPos].name);
  this.renderGame();
  this.syncState();
  this.handleLanding(mr.newPos);
};

/* ────────── LANDING LOGIC ────────── */
MonopolyClient.prototype.handleLanding = function(pos) {
  var space = BOARD_DATA[pos];
  var cp = this.engine.currentPlayer();
  if (!cp) return;
  var self = this;

  this.engine.gamePhase = 'landed';

  switch (space.type) {
    case 'property':
    case 'railroad':
    case 'utility':
      var owner = this.engine.getPropertyOwner(pos);
      if (owner === null) {
        // Unowned
        if (cp.money >= space.price) {
          sfx('card');
          this.showBuyModal(pos);
        } else {
          this.addLog(cp.name + " can't afford " + space.name);
          this.engine.gamePhase = 'action';
          this.renderGame();
        }
      } else if (owner !== this.mySeat) {
        var ownerPlayer = this.engine.getPlayer(owner);
        var ps = this.engine.propertyState[pos];
        if (ps && ps.mortgaged) {
          this.addLog(space.name + ' is mortgaged, no rent');
          this.engine.gamePhase = 'action';
          this.renderGame();
        } else if (ownerPlayer && ownerPlayer.inJail) {
          this.addLog(space.name + ' owner is in jail, no rent');
          this.engine.gamePhase = 'action';
          this.renderGame();
        } else {
          sfx('rent');
          // BUG FIX #3: Store creditor BEFORE showing modal
          this._rentCreditor = owner;
          this.showRentModal(pos);
        }
      } else {
        // Own property
        this.engine.gamePhase = 'action';
        this.renderGame();
      }
      break;

    case 'tax':
      sfx('rent');
      this.engine.payTax(this.mySeat, pos);
      this.addLog(cp.name + ' paid $' + space.price + ' tax');
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      this.checkBankrupt(cp, null);
      break;

    case 'chance':
      sfx('card');
      var chCard = this.engine.drawChance();
      this._pendingCard = chCard;
      this._pendingCardType = 'chance';
      this.showCardModal('Chance', chCard);
      break;

    case 'chest':
      sfx('card');
      var ccCard = this.engine.drawChest();
      this._pendingCard = ccCard;
      this._pendingCardType = 'chest';
      this.showCardModal('Community Chest', ccCard);
      break;

    case 'go-to-jail':
      sfx('jail');
      this.engine.sendToJail(this.mySeat);
      this.addLog(cp.name + ' was sent to Jail!');
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      this.endTurn();
      break;

    case 'free-parking':
      var fpAmount = this.engine.collectFreeParking(this.mySeat);
      if (fpAmount > 0) {
        sfx('money');
        this.addLog(cp.name + ' collected $' + fpAmount + ' from Free Parking!');
      }
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      break;

    case 'go':
      this.engine.gamePhase = 'action';
      this.renderGame();
      break;

    case 'jail':
      // Just visiting
      this.engine.gamePhase = 'action';
      this.renderGame();
      break;

    default:
      this.engine.gamePhase = 'action';
      this.renderGame();
      break;
  }
};

/* ────────── MODALS ────────── */
MonopolyClient.prototype.openModal = function(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'flex';
};

MonopolyClient.prototype.closeModal = function(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
};

MonopolyClient.prototype.showCustomModal = function(html) {
  var content = $('#custom-modal-content');
  if (content) content.innerHTML = html;
  this.openModal('modal-custom');
};

MonopolyClient.prototype.closeCustomModal = function() {
  this.closeModal('modal-custom');
};

/* ── BUY MODAL ── */
MonopolyClient.prototype.showBuyModal = function(pos) {
  var space = BOARD_DATA[pos];
  if (!space) return;
  this._buyPos = pos;

  var colorBand = $('#buy-color-band');
  if (colorBand) {
    if (space.group && GROUP_COLORS[space.group]) {
      colorBand.style.background = GROUP_COLORS[space.group];
      colorBand.style.display = '';
    } else {
      colorBand.style.display = 'none';
    }
  }

  $('#buy-property-name').textContent = space.name;
  $('#buy-property-price').textContent = '$' + space.price;

  if (space.rent) {
    $('#buy-rent-base').textContent = '$' + space.rent[0];
    $('#buy-rent-1h').textContent = '$' + (space.rent[1] || '-');
    $('#buy-rent-2h').textContent = '$' + (space.rent[2] || '-');
    $('#buy-rent-3h').textContent = '$' + (space.rent[3] || '-');
    $('#buy-rent-4h').textContent = '$' + (space.rent[4] || '-');
    $('#buy-rent-hotel').textContent = '$' + (space.rent[5] || '-');
  } else {
    // Railroad or utility
    if (space.type === 'railroad') {
      $('#buy-rent-base').textContent = '$25';
      $('#buy-rent-1h').textContent = '2 RR: $50';
      $('#buy-rent-2h').textContent = '3 RR: $100';
      $('#buy-rent-3h').textContent = '4 RR: $200';
      $('#buy-rent-4h').textContent = '-';
      $('#buy-rent-hotel').textContent = '-';
    } else {
      $('#buy-rent-base').textContent = '4x dice';
      $('#buy-rent-1h').textContent = '2 util: 10x';
      $('#buy-rent-2h').textContent = '-';
      $('#buy-rent-3h').textContent = '-';
      $('#buy-rent-4h').textContent = '-';
      $('#buy-rent-hotel').textContent = '-';
    }
  }

  $('#buy-house-cost').textContent = space.houseCost ? ('$' + space.houseCost) : 'N/A';

  this.openModal('modal-buy');
};

MonopolyClient.prototype.confirmBuy = function() {
  var pos = this._buyPos;
  if (pos === undefined) return;
  var space = BOARD_DATA[pos];
  var ok = this.engine.buyProperty(this.mySeat, pos);
  if (ok) {
    sfx('buy');
    this.addLog(this.engine.currentPlayer().name + ' bought ' + space.name + ' for $' + space.price);
    this.broadcastAction('property-bought', { seat: this.mySeat, pos: pos });
    this.syncState();
    this.flashMoney(this.mySeat, -(space.price || 0));
  }
  this.closeModal('modal-buy');
  this.engine.gamePhase = 'action';
  this.renderGame();
};

MonopolyClient.prototype.passBuy = function() {
  this.closeModal('modal-buy');
  this.engine.gamePhase = 'action';
  this.renderGame();
};

/* ── RENT MODAL ── */
MonopolyClient.prototype.showRentModal = function(pos) {
  var space = BOARD_DATA[pos];
  this._rentPos = pos;
  var rent = this.engine.calculateRent(pos, this.engine.lastDice.total);
  this._rentAmount = rent;
  var owner = this.engine.getPlayer(this._rentCreditor);

  $('#rent-property-name').textContent = space.name;
  $('#rent-owner-name').textContent = owner ? owner.name : 'Unknown';
  $('#rent-amount').textContent = '$' + rent;

  this.openModal('modal-rent');
};

MonopolyClient.prototype.payRent = function() {
  var cp = this.engine.currentPlayer();
  var rent = this._rentAmount || 0;
  var creditor = this._rentCreditor;

  cp.money -= rent;
  var ownerP = this.engine.getPlayer(creditor);
  if (ownerP) ownerP.money += rent;

  this.addLog(cp.name + ' paid $' + rent + ' rent to ' + (ownerP ? ownerP.name : 'bank'));
  this.broadcastAction('rent-paid', { seat: this.mySeat, creditor: creditor, amount: rent, pos: this._rentPos });
  this.syncState();
  this.closeModal('modal-rent');
  this.engine.gamePhase = 'action';
  this.renderGame();
  this.checkBankrupt(cp, creditor);
};

/* ── CARD MODAL ── */
MonopolyClient.prototype.showCardModal = function(type, card) {
  $('#card-type').textContent = type;
  $('#card-icon').textContent = type === 'Chance' ? '❓' : '🃏';
  $('#card-text').textContent = card.text;
  this.openModal('modal-card');
};

MonopolyClient.prototype.cardOk = function() {
  this.closeModal('modal-card');
  var card = this._pendingCard;
  var cardType = this._pendingCardType;
  if (!card) { this.engine.gamePhase = 'action'; this.renderGame(); return; }

  this._pendingCard = null;
  this._pendingCardType = null;

  var result = this.engine.executeCard(this.mySeat, card);
  var cp = this.engine.currentPlayer();

  this.broadcastAction('drew-card', { seat: this.mySeat, cardType: cardType, card: card, result: result });

  // Handle post-card actions
  switch (card.action) {
    case 'move-to':
    case 'move-back':
    case 'nearest-railroad':
    case 'nearest-utility':
      this.syncState();
      this.renderGame();
      // May need to handle landing at new position
      var newPos = cp.position;
      if (card.action === 'go-to-jail') {
        this.engine.gamePhase = 'action';
        this.renderGame();
        this.endTurn();
      } else {
        this.handleLanding(newPos);
      }
      return;
    case 'go-to-jail':
      sfx('jail');
      this.addLog(cp.name + ' was sent to Jail by card!');
      this.engine.gamePhase = 'action';
      this.syncState();
      this.renderGame();
      this.endTurn();
      return;
    default:
      break;
  }

  if (result.data && result.data.cost !== undefined) {
    this.addLog(cp.name + ' paid $' + result.data.cost + ' in repairs');
  }
  if (result.data && result.data.amount !== undefined && card.action === 'collect') {
    this.addLog(cp.name + ' collected $' + result.data.amount);
  }

  this.engine.gamePhase = 'action';
  this.syncState();
  this.renderGame();
  this.checkBankrupt(cp, null);
};

/* ── BUILD MODAL ── */
MonopolyClient.prototype.showBuildModal = function() {
  var self = this;
  var cp = this.engine.currentPlayer();
  if (!cp || cp.seatIndex !== this.mySeat) return;

  var list = $('#build-list');
  if (!list) return;
  var html = '';
  var hasBuildable = false;

  for (var i = 0; i < cp.properties.length; i++) {
    var pos = cp.properties[i];
    var space = BOARD_DATA[pos];
    if (space.type !== 'property') continue;
    var ps = this.engine.propertyState[pos];
    var houses = ps ? ps.houses || 0 : 0;
    var canBuild = this.engine.canBuildOn(this.mySeat, pos);
    var canSell = this.engine.canSellHouseOn(this.mySeat, pos);

    if (!canBuild && !canSell) continue;
    hasBuildable = true;

    var houseLabel = houses === 5 ? '🏨 Hotel' : ('🏠 x' + houses);
    var groupColor = GROUP_COLORS[space.group] || '#888';

    html += '<div class="build-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px;margin:4px 0;background:rgba(255,255,255,0.05);border-radius:6px;border-left:4px solid ' + groupColor + ';">';
    html += '<div><div style="font-size:13px;font-weight:600;">' + space.name + '</div>';
    html += '<div style="font-size:11px;color:#aaa;">' + houseLabel + ' | Cost: $' + space.houseCost + '</div></div>';
    html += '<div>';
    if (canBuild) {
      html += '<button class="btn btn-success btn-sm build-buy-btn" data-pos="' + pos + '" style="margin:2px;padding:4px 10px;font-size:12px;">+ Build ($' + space.houseCost + ')</button>';
    }
    if (canSell) {
      html += '<button class="btn btn-danger btn-sm build-sell-btn" data-pos="' + pos + '" style="margin:2px;padding:4px 10px;font-size:12px;">- Sell ($' + Math.floor(space.houseCost / 2) + ')</button>';
    }
    html += '</div></div>';
  }

  if (!hasBuildable) {
    html = '<p style="text-align:center;color:#aaa;padding:20px;">No buildable properties. You need a full color group with no mortgaged properties.</p>';
  }

  list.innerHTML = html;
  this.openModal('modal-build');

  // Bind build/sell buttons
  setTimeout(function() {
    var buyBtns = list.querySelectorAll('.build-buy-btn');
    var sellBtns = list.querySelectorAll('.build-sell-btn');
    for (var b = 0; b < buyBtns.length; b++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var p = parseInt(btn.getAttribute('data-pos'));
          if (self.engine.buildHouse(self.mySeat, p)) {
            sfx('build');
            self.addLog(cp.name + ' built on ' + BOARD_DATA[p].name);
            self.broadcastAction('built-house', { seat: self.mySeat, pos: p });
            self.syncState();
            self.closeModal('modal-build');
            self.showBuildModal(); // Refresh
          }
        });
      })(buyBtns[b]);
    }
    for (var s = 0; s < sellBtns.length; s++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var p = parseInt(btn.getAttribute('data-pos'));
          if (self.engine.sellHouse(self.mySeat, p)) {
            self.addLog(cp.name + ' sold house on ' + BOARD_DATA[p].name);
            self.broadcastAction('sold-house', { seat: self.mySeat, pos: p });
            self.syncState();
            self.closeModal('modal-build');
            self.showBuildModal(); // Refresh
          }
        });
      })(sellBtns[s]);
    }
  }, 50);
};

/* ── MORTGAGE MODAL ── */
MonopolyClient.prototype.showMortgageModal = function() {
  var self = this;
  var cp = this.engine.currentPlayer();
  if (!cp || cp.seatIndex !== this.mySeat) return;

  var list = $('#mortgage-list');
  if (!list) return;
  var html = '';

  for (var i = 0; i < cp.properties.length; i++) {
    var pos = cp.properties[i];
    var space = BOARD_DATA[pos];
    var ps = this.engine.propertyState[pos];
    if (!ps) continue;
    var mortgaged = ps.mortgaged;
    var canM = this.engine.canMortgage(this.mySeat, pos);
    var unmortCost = Math.floor(space.mortgage * 1.1);
    var canU = mortgaged && cp.money >= unmortCost;

    var groupColor = GROUP_COLORS[space.group] || '#888';
    html += '<div class="mortgage-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px;margin:4px 0;background:rgba(255,255,255,0.05);border-radius:6px;border-left:4px solid ' + groupColor + ';">';
    html += '<div><div style="font-size:13px;font-weight:600;">' + space.name + (mortgaged ? ' <span style="color:#e74c3c;">(MORTGAGED)</span>' : '') + '</div>';
    html += '<div style="font-size:11px;color:#aaa;">Mortgage: $' + space.mortgage + ' | Unmortgage: $' + unmortCost + '</div></div>';
    html += '<div>';
    if (canM && !mortgaged) {
      html += '<button class="btn btn-warning btn-sm mortgage-btn" data-pos="' + pos + '" style="margin:2px;padding:4px 10px;font-size:12px;">Mortgage (+$' + space.mortgage + ')</button>';
    }
    if (canU && mortgaged) {
      html += '<button class="btn btn-success btn-sm unmortgage-btn" data-pos="' + pos + '" style="margin:2px;padding:4px 10px;font-size:12px;">Unmortgage (-$' + unmortCost + ')</button>';
    }
    html += '</div></div>';
  }

  if (!html) {
    html = '<p style="text-align:center;color:#aaa;padding:20px;">No properties to manage.</p>';
  }

  list.innerHTML = html;
  this.openModal('modal-mortgage');

  setTimeout(function() {
    var mBtns = list.querySelectorAll('.mortgage-btn');
    var uBtns = list.querySelectorAll('.unmortgage-btn');
    for (var m = 0; m < mBtns.length; m++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var p = parseInt(btn.getAttribute('data-pos'));
          if (self.engine.mortgageProperty(self.mySeat, p)) {
            self.addLog(cp.name + ' mortgaged ' + BOARD_DATA[p].name);
            self.broadcastAction('mortgage-action', { seat: self.mySeat, pos: p, type: 'mortgage' });
            self.syncState();
            self.closeModal('modal-mortgage');
            self.showMortgageModal();
          }
        });
      })(mBtns[m]);
    }
    for (var u = 0; u < uBtns.length; u++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var p = parseInt(btn.getAttribute('data-pos'));
          if (self.engine.unmortgageProperty(self.mySeat, p)) {
            self.addLog(cp.name + ' unmortgaged ' + BOARD_DATA[p].name);
            self.broadcastAction('mortgage-action', { seat: self.mySeat, pos: p, type: 'unmortgage' });
            self.syncState();
            self.closeModal('modal-mortgage');
            self.showMortgageModal();
          }
        });
      })(uBtns[u]);
    }
  }, 50);
};

/* ── TRADE MODAL ── */
MonopolyClient.prototype.showTradeModal = function() {
  var self = this;
  var cp = this.engine.currentPlayer();
  if (!cp) return;

  // Populate partner select
  var partnerSel = $('#trade-partner-select');
  var html = '';
  var active = this.engine.activePlayers();
  for (var i = 0; i < active.length; i++) {
    if (active[i].seatIndex !== this.mySeat) {
      html += '<option value="' + active[i].seatIndex + '">' + escHtml(active[i].name) + '</option>';
    }
  }
  partnerSel.innerHTML = html;

  // My properties
  var offerList = $('#trade-offer-properties');
  html = '';
  for (var j = 0; j < cp.properties.length; j++) {
    var pos = cp.properties[j];
    var space = BOARD_DATA[pos];
    var ps = this.engine.propertyState[pos];
    if (ps && (ps.houses || 0) > 0) continue; // Can't trade with houses
    html += '<label style="display:block;font-size:12px;padding:3px 0;"><input type="checkbox" class="trade-offer-cb" value="' + pos + '"> ' + space.name + '</label>';
  }
  offerList.innerHTML = html || '<p style="color:#aaa;font-size:12px;">No tradeable properties</p>';

  // Update want list on partner change
  function updateWantList() {
    var partnerSeat = parseInt(partnerSel.value);
    var partner = self.engine.getPlayer(partnerSeat);
    var wantList = $('#trade-want-properties');
    var wh = '';
    if (partner) {
      for (var k = 0; k < partner.properties.length; k++) {
        var pp = partner.properties[k];
        var sp = BOARD_DATA[pp];
        var pps = self.engine.propertyState[pp];
        if (pps && (pps.houses || 0) > 0) continue;
        wh += '<label style="display:block;font-size:12px;padding:3px 0;"><input type="checkbox" class="trade-want-cb" value="' + pp + '"> ' + sp.name + '</label>';
      }
    }
    wantList.innerHTML = wh || '<p style="color:#aaa;font-size:12px;">No tradeable properties</p>';
  }

  partnerSel.addEventListener('change', updateWantList);
  updateWantList();

  $('#trade-offer-cash').value = 0;
  $('#trade-want-cash').value = 0;

  this.openModal('modal-trade');
};

MonopolyClient.prototype.sendTradeOffer = function() {
  var partnerSeat = parseInt($('#trade-partner-select').value);
  var offerCash = parseInt($('#trade-offer-cash').value) || 0;
  var wantCash = parseInt($('#trade-want-cash').value) || 0;

  var offerProps = [];
  var offerCbs = $$('.trade-offer-cb:checked');
  for (var i = 0; i < offerCbs.length; i++) offerProps.push(parseInt(offerCbs[i].value));

  var wantProps = [];
  var wantCbs = $$('.trade-want-cb:checked');
  for (var j = 0; j < wantCbs.length; j++) wantProps.push(parseInt(wantCbs[j].value));

  if (offerCash === 0 && wantCash === 0 && offerProps.length === 0 && wantProps.length === 0) {
    showToast('You must offer or want something!', 'error');
    return;
  }

  var cp = this.engine.currentPlayer();
  if (offerCash > cp.money) {
    showToast("You don't have that much cash!", 'error');
    return;
  }

  this.closeModal('modal-trade');
  this.broadcastAction('trade-offer', {
    offerer: this.mySeat,
    receiver: partnerSeat,
    offererCash: offerCash,
    receiverCash: wantCash,
    offererProps: offerProps,
    receiverProps: wantProps,
    offererName: cp.name
  });
  this.addLog(cp.name + ' sent a trade offer');
  showToast('Trade offer sent!', 'info');
};

MonopolyClient.prototype.showIncomingTrade = function(offer) {
  var self = this;
  var offerer = this.engine.getPlayer(offer.offerer);
  var html = '<div class="modal-header"><h3>Trade Offer from ' + escHtml(offerer ? offerer.name : 'Unknown') + '</h3></div>';
  html += '<div class="modal-body" style="padding:16px;">';

  html += '<div style="display:flex;gap:20px;">';
  html += '<div style="flex:1;"><h4 style="font-size:13px;color:#2ecc71;">They Offer:</h4>';
  if (offer.offererCash > 0) html += '<p style="font-size:13px;">💰 $' + offer.offererCash + '</p>';
  for (var i = 0; i < offer.offererProps.length; i++) {
    html += '<p style="font-size:12px;">🏠 ' + BOARD_DATA[offer.offererProps[i]].name + '</p>';
  }
  if (offer.offererCash === 0 && offer.offererProps.length === 0) html += '<p style="color:#aaa;font-size:12px;">Nothing</p>';
  html += '</div>';

  html += '<div style="flex:1;"><h4 style="font-size:13px;color:#e74c3c;">They Want:</h4>';
  if (offer.receiverCash > 0) html += '<p style="font-size:13px;">💰 $' + offer.receiverCash + '</p>';
  for (var j = 0; j < offer.receiverProps.length; j++) {
    html += '<p style="font-size:12px;">🏠 ' + BOARD_DATA[offer.receiverProps[j]].name + '</p>';
  }
  if (offer.receiverCash === 0 && offer.receiverProps.length === 0) html += '<p style="color:#aaa;font-size:12px;">Nothing</p>';
  html += '</div></div>';

  html += '</div>';
  html += '<div class="modal-footer" style="display:flex;gap:8px;justify-content:center;padding:12px;">';
  html += '<button id="trade-accept-btn" class="btn btn-success">✅ Accept</button>';
  html += '<button id="trade-reject-btn" class="btn btn-danger">❌ Reject</button>';
  html += '</div>';

  this.showCustomModal(html);

  setTimeout(function() {
    var acceptBtn = document.getElementById('trade-accept-btn');
    var rejectBtn = document.getElementById('trade-reject-btn');
    if (acceptBtn) acceptBtn.addEventListener('click', function() {
      self.closeCustomModal();
      self.engine.executeTrade(offer.offerer, offer.receiver, offer.offererCash, offer.receiverCash, offer.offererProps, offer.receiverProps);
      self.broadcastAction('trade-accepted', offer);
      self.syncState();
      self.renderGame();
      self.addLog('Trade accepted!');
      sfx('buy');
    });
    if (rejectBtn) rejectBtn.addEventListener('click', function() {
      self.closeCustomModal();
      self.broadcastAction('trade-rejected', { offerer: offer.offerer, receiver: offer.receiver });
      self.addLog('Trade rejected');
    });
  }, 50);
};

/* ── BANKRUPT MODAL ── */
MonopolyClient.prototype.showBankruptModal = function(creditorSeat) {
  var cp = this.engine.currentPlayer();
  if (!cp) return;
  this._bankruptCreditor = creditorSeat;

  $('#bankrupt-owed').textContent = '$' + Math.abs(cp.money);
  $('#bankrupt-cash').textContent = '$' + cp.money;

  this.openModal('modal-bankrupt');
};

MonopolyClient.prototype.confirmBankruptcy = function(creditorSeat) {
  sfx('bankrupt');
  var cp = this.engine.currentPlayer();
  this.engine.declareBankruptcy(this.mySeat, creditorSeat);
  this.addLog(cp.name + ' went bankrupt!');
  this.broadcastAction('went-bankrupt', { seat: this.mySeat, creditor: creditorSeat });
  this.syncState();
  this.closeModal('modal-bankrupt');
  this.renderGame();

  var winner = this.engine.checkWinner();
  if (winner) {
    this.showGameOverModal(winner);
  } else {
    this.endTurn();
  }
};

MonopolyClient.prototype.checkBankrupt = function(player, creditorSeat) {
  if (!player) return;
  if (player.money < 0) {
    if (this.engine.isBankrupt(player.seatIndex)) {
      // Can't recover, auto-declare
      this.showBankruptModal(creditorSeat);
    } else {
      // Can sell assets
      this.showBankruptModal(creditorSeat);
    }
  }
};

/* ── GAME OVER MODAL ── */
MonopolyClient.prototype.showGameOverModal = function(winner) {
  playVictoryMusic();
  var ch = getCharacter(winner.characterId);
  var winToken = $('#gameover-winner-token');
  if (winToken) {
    winToken.textContent = winner.seatIndex + 1;
    var wColor = ch ? ch.color : (winner.color || PLAYER_COLORS[winner.seatIndex]);
    winToken.style.background = wColor;
    winToken.style.width = '60px';
    winToken.style.height = '60px';
    winToken.style.borderRadius = '50%';
    winToken.style.display = 'inline-flex';
    winToken.style.alignItems = 'center';
    winToken.style.justifyContent = 'center';
    winToken.style.fontSize = '24px';
    winToken.style.fontWeight = 'bold';
    winToken.style.color = '#fff';
    winToken.style.border = '3px solid rgba(255,255,255,0.5)';
    winToken.style.margin = '0 auto 10px';
  }
  $('#gameover-winner-name').textContent = winner.name;

  var stats = $('#gameover-stats');
  var html = '';
  var allP = this.engine.players;
  for (var i = 0; i < allP.length; i++) {
    var p = allP[i];
    html += '<div style="display:flex;justify-content:space-between;padding:6px 10px;border-left:3px solid ' + (p.color || PLAYER_COLORS[p.seatIndex]) + ';margin:3px 0;background:rgba(255,255,255,0.05);border-radius:4px;">';
    html += '<span style="font-size:13px;">' + escHtml(p.name) + '</span>';
    html += '<span style="font-size:13px;color:' + (p.bankrupt ? '#e74c3c' : '#2ecc71') + ';">' + (p.bankrupt ? 'BANKRUPT' : ('$' + p.money)) + '</span>';
    html += '</div>';
  }
  stats.innerHTML = html;

  this.openModal('modal-gameover');
};

/* ────────── TURN MANAGEMENT (SERVER AUTHORITATIVE) ────────── */
MonopolyClient.prototype.endTurn = function() {
  // BUG FIX #1: Doubles = roll again, don't end turn
  if (this.engine.lastDice.doubles && !this.engine.currentPlayer().inJail && this.engine.doublesCount < 3 && this.engine.doublesCount > 0) {
    this.engine.gamePhase = 'rolling';
    this.addLog('Doubles! Roll again.');
    this.renderGame();
    return;
  }
  // Otherwise tell server to advance turn — do NOT call engine.nextTurn()
  this.socket.emit('game-action', { action: 'end-turn', payload: { seat: this.mySeat } });
  this.engine.gamePhase = 'waiting';
  this.renderGame();
};

/* ────────── GAME ACTION HANDLER ────────── */
MonopolyClient.prototype._handleGameAction = function(data) {
  if (!data || !data.action) return;
  var payload = data.payload || {};
  var self = this;

  switch (data.action) {
    case 'select-character':
      this._characterSelections[String(payload.seatIndex)] = payload.characterId;
      this._renderCharacterGrid();
      break;

    case 'confirm-character':
      this._characterConfirmed[String(payload.seatIndex)] = true;
      this._characterSelections[String(payload.seatIndex)] = payload.characterId;
      this._renderCharacterGrid();
      this._checkAllConfirmed();
      break;

    case 'all-characters-confirmed':
      if (payload.selections) {
        for (var sk in payload.selections) {
          if (payload.selections.hasOwnProperty(sk)) {
            this._characterSelections[sk] = payload.selections[sk];
          }
        }
      }
      this._startActualGame();
      break;

    case 'end-turn':
      // Server will emit turn-changed, ignore here
      break;

    case 'update-state':
      if (payload) {
        this.engine.initFromState(payload);
        this.renderGame();
      }
      break;

    case 'property-bought':
      if (payload.seat !== this.mySeat) {
        this.engine.buyProperty(payload.seat, payload.pos);
        var sp = BOARD_DATA[payload.pos];
        var buyer = this.engine.getPlayer(payload.seat);
        this.addLog((buyer ? buyer.name : 'Someone') + ' bought ' + sp.name);
        this.renderGame();
      }
      break;

    case 'rent-paid':
      if (payload.seat !== this.mySeat) {
        var payer = this.engine.getPlayer(payload.seat);
        var cred = this.engine.getPlayer(payload.creditor);
        if (payer) payer.money -= payload.amount;
        if (cred) cred.money += payload.amount;
        this.addLog((payer ? payer.name : 'Someone') + ' paid $' + payload.amount + ' rent');
        this.renderGame();
      }
      break;

    case 'went-bankrupt':
      if (payload.seat !== this.mySeat) {
        this.engine.declareBankruptcy(payload.seat, payload.creditor);
        var bp = this.engine.getPlayer(payload.seat);
        this.addLog((bp ? bp.name : 'Someone') + ' went bankrupt!');
        sfx('bankrupt');
        this.renderGame();
        var winner = this.engine.checkWinner();
        if (winner) this.showGameOverModal(winner);
      }
      break;

    case 'built-house':
      if (payload.seat !== this.mySeat) {
        this.engine.buildHouse(payload.seat, payload.pos);
        sfx('build');
        this.addLog(this.engine.getPlayer(payload.seat).name + ' built on ' + BOARD_DATA[payload.pos].name);
        this.renderGame();
      }
      break;

    case 'sold-house':
      if (payload.seat !== this.mySeat) {
        this.engine.sellHouse(payload.seat, payload.pos);
        this.renderGame();
      }
      break;

    case 'drew-card':
      if (payload.seat !== this.mySeat) {
        var cardPlayer = this.engine.getPlayer(payload.seat);
        this.addLog((cardPlayer ? cardPlayer.name : 'Someone') + ' drew a ' + (payload.cardType || 'card'));
        this.renderGame();
      }
      break;

    case 'jail-action':
      if (payload.seat !== this.mySeat) {
        var jp = this.engine.getPlayer(payload.seat);
        if (payload.type === 'pay-fine') {
          this.engine.payJailFine(payload.seat);
          this.addLog((jp ? jp.name : 'Someone') + ' paid jail fine');
        } else if (payload.type === 'use-card') {
          this.engine.useJailCard(payload.seat);
          this.addLog((jp ? jp.name : 'Someone') + ' used jail card');
        }
        this.renderGame();
      }
      break;

    case 'free-parking':
      if (payload.seat !== this.mySeat) {
        this.engine.collectFreeParking(payload.seat);
        this.renderGame();
      }
      break;

    case 'mortgage-action':
      if (payload.seat !== this.mySeat) {
        if (payload.type === 'mortgage') {
          this.engine.mortgageProperty(payload.seat, payload.pos);
        } else {
          this.engine.unmortgageProperty(payload.seat, payload.pos);
        }
        this.renderGame();
      }
      break;

    case 'trade-offer':
      if (payload.receiver === this.mySeat) {
        this.showIncomingTrade(payload);
      }
      break;

    case 'trade-accepted':
      if (payload.offerer === this.mySeat) {
        this.engine.executeTrade(payload.offerer, payload.receiver, payload.offererCash, payload.receiverCash, payload.offererProps, payload.receiverProps);
        sfx('buy');
        this.addLog('Trade accepted!');
        this.syncState();
        this.renderGame();
      }
      break;

    case 'trade-rejected':
      if (payload.offerer === this.mySeat) {
        showToast('Trade was rejected', 'error');
        this.addLog('Trade rejected');
      }
      break;
  }
};

/* ────────── GAME BUTTON BINDINGS ────────── */
MonopolyClient.prototype._bindGameButtons = function() {
  var self = this;
  if (this._gameBound) return;
  this._gameBound = true;

  $('#btn-roll-dice').addEventListener('click', function() { self.rollDice(); });
  $('#btn-end-turn').addEventListener('click', function() { self.endTurn(); });
  $('#btn-build').addEventListener('click', function() { self.showBuildModal(); });
  $('#btn-mortgage').addEventListener('click', function() { self.showMortgageModal(); });
  $('#btn-trade').addEventListener('click', function() { self.showTradeModal(); });

  // Buy modal buttons
  $('#btn-modal-buy').addEventListener('click', function() { self.confirmBuy(); });
  $('#btn-modal-pass').addEventListener('click', function() { self.passBuy(); });
  $('#btn-modal-auction').addEventListener('click', function() { self.passBuy(); }); // Auction = pass for now

  // Rent modal
  $('#btn-pay-rent').addEventListener('click', function() { self.payRent(); });

  // Card modal
  $('#btn-card-ok').addEventListener('click', function() { self.cardOk(); });

  // Build modal
  $('#btn-build-cancel').addEventListener('click', function() { self.closeModal('modal-build'); });
  $('#btn-build-confirm').addEventListener('click', function() { self.closeModal('modal-build'); });

  // Mortgage modal
  $('#btn-mortgage-close').addEventListener('click', function() { self.closeModal('modal-mortgage'); });

  // Trade modal
  $('#btn-trade-send').addEventListener('click', function() { self.sendTradeOffer(); });
  $('#btn-trade-cancel').addEventListener('click', function() { self.closeModal('modal-trade'); });

  // Bankrupt modal
  $('#btn-bankrupt-manage').addEventListener('click', function() {
    self.closeModal('modal-bankrupt');
    self.showMortgageModal();
  });
  $('#btn-bankrupt-declare').addEventListener('click', function() {
    self.confirmBankruptcy(self._bankruptCreditor);
  });

  // Game over
  $('#btn-new-game').addEventListener('click', function() {
    stopVictoryMusic();
    clearSession('monopoly-session');
    window.location.reload();
  });

  // Game chat
  $('#btn-send-game-chat').addEventListener('click', function() { self.sendChat('input-game-chat'); });
  $('#input-game-chat').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); self.sendChat('input-game-chat'); }
  });

  // Sound toggle
  $('#btn-sound-toggle').addEventListener('click', function() {
    var on = SFX.toggle();
    this.textContent = on ? '🔊' : '🔇';
  });
};

/* ────────── RENDERING ────────── */
MonopolyClient.prototype.renderGame = function() {
  if (!this._gameStarted) return;
  this.renderTokensOnBoard();
  this.renderPlayerCards();
  this.renderPropertyOwnership();
  this.renderTurnBanner();
  this.updateButtons();
  this._setupSpaceTooltips();
};

MonopolyClient.prototype.renderTokensOnBoard = function() {
  var areas = $$('.token-area');
  for (var i = 0; i < areas.length; i++) areas[i].innerHTML = '';

  var players = this.engine.players;
  var currentTurn = this.engine.currentTurn;
  for (var j = 0; j < players.length; j++) {
    var p = players[j];
    if (p.bankrupt) continue;
    var spaceEl = document.getElementById('space-' + p.position);
    if (!spaceEl) continue;
    var area = spaceEl.querySelector('.token-area');
    if (!area) continue;
    var tok = makeToken(p.seatIndex, p.characterId);
    if (p.seatIndex === currentTurn) tok.classList.add('current-player');
    area.appendChild(tok);
  }
};

MonopolyClient.prototype.renderPlayerCards = function() {
  var container = $('#player-cards');
  if (!container) return;
  var html = '';
  var players = this.engine.players;

  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    var color = p.color || PLAYER_COLORS[p.seatIndex];
    var ch = getCharacter(p.characterId);
    var isCurrentTurn = (p.seatIndex === this.engine.currentTurn);
    var isMe = (p.seatIndex === this.mySeat);

    var cls = 'player-card';
    if (isCurrentTurn) cls += ' active-turn';
    if (p.bankrupt) cls += ' bankrupt';

    html += '<div class="' + cls + '" data-seat="' + p.seatIndex + '" style="border-left-color:' + color + ';">';

    // Header row
    html += '<div class="player-card-header">';
    html += '<div class="player-card-identity">';
    var dotColor = ch ? ch.color : color;
    html += '<span class="player-card-dot" style="background:' + dotColor + ';"></span>';
    html += '<span class="player-card-name" style="color:' + color + ';">' + escHtml(p.name) + '</span>';
    if (isMe) html += '<span class="badge-you">YOU</span>';
    html += '</div>';

    // Badges
    html += '<div class="player-card-badges">';
    if (!p.connected) html += '<span class="badge-dc">DC</span>';
    if (p.inJail) html += '<span class="badge-jail">JAIL</span>';
    if (p.getOutOfJailCards > 0) html += '<span class="badge-jail-card">🃏x' + p.getOutOfJailCards + '</span>';
    if (p.bankrupt) html += '<span class="badge-bankrupt">BANKRUPT</span>';
    html += '</div></div>';

    // Balance
    html += '<div class="player-card-balance' + (p.money < 0 ? ' negative' : '') + '">$' + p.money + '</div>';

    // Property dots grouped by color
    if (p.properties.length > 0) {
      // Group properties by color group
      var groups = {};
      for (var k = 0; k < p.properties.length; k++) {
        var propPos = p.properties[k];
        var propSpace = BOARD_DATA[propPos];
        var grp = (propSpace.group) || 'other';
        if (!groups[grp]) groups[grp] = [];
        groups[grp].push(propPos);
      }
      html += '<div class="player-card-props">';
      for (var g in groups) {
        if (!groups.hasOwnProperty(g)) continue;
        var propList = groups[g];
        for (var m = 0; m < propList.length; m++) {
          var pp = propList[m];
          var ps = BOARD_DATA[pp];
          var pState = this.engine.propertyState[pp];
          var pColor = (ps.group && GROUP_COLORS[ps.group]) ? GROUP_COLORS[ps.group] : '#888';
          var mortCls = (pState && pState.mortgaged) ? ' mortgaged' : '';
          var houses = pState ? (pState.houses || 0) : 0;
          var houseStr = '';
          if (houses === 5) houseStr = 'H';
          else if (houses > 0) houseStr = '' + houses;
          html += '<span class="player-prop-dot' + mortCls + '" style="background:' + pColor + ';" title="' + escHtml(ps.name) + (houses > 0 ? ' (' + (houses === 5 ? 'Hotel' : houses + 'h') + ')' : '') + '">' + houseStr + '</span>';
        }
      }
      html += '</div>';
    }

    html += '</div>';
  }

  container.innerHTML = html;
};

MonopolyClient.prototype.renderPropertyOwnership = function() {
  for (var pos = 0; pos < 40; pos++) {
    var spaceEl = document.getElementById('space-' + pos);
    if (!spaceEl) continue;

    // Remove old indicators
    var oldOwner = spaceEl.querySelector('.owner-indicator');
    if (oldOwner) oldOwner.remove();
    var oldHouses = spaceEl.querySelector('.house-dots');
    if (oldHouses) oldHouses.remove();

    var ps = this.engine.propertyState[pos];
    if (!ps) continue;

    if (ps.owner !== null && ps.owner !== undefined) {
      var color = PLAYER_COLORS[ps.owner] || '#888';
      var ownerDot = document.createElement('div');
      ownerDot.className = 'owner-indicator';
      ownerDot.style.background = color;
      if (ps.mortgaged) ownerDot.classList.add('mortgaged');
      spaceEl.appendChild(ownerDot);
    }

    if (ps.houses > 0) {
      var hDiv = document.createElement('div');
      hDiv.className = 'house-dots';
      if (ps.houses === 5) {
        var hotel = document.createElement('span');
        hotel.className = 'hotel-dot';
        hDiv.appendChild(hotel);
      } else {
        for (var h = 0; h < ps.houses; h++) {
          var hDot = document.createElement('span');
          hDot.className = 'house-dot';
          hDiv.appendChild(hDot);
        }
      }
      spaceEl.appendChild(hDiv);
    }
  }
};

MonopolyClient.prototype.renderTurnBanner = function() {
  var cp = this.engine.currentPlayer();
  if (!cp) return;
  var ch = getCharacter(cp.characterId);
  var color = cp.color || PLAYER_COLORS[cp.seatIndex];
  var tokenEl = $('#turn-token');
  var nameEl = $('#turn-player-name');
  var banner = $('#your-turn-banner');
  var waitEl = $('#waiting-text');

  if (tokenEl) {
    tokenEl.textContent = ch ? ch.emoji : (cp.seatIndex + 1);
    tokenEl.style.background = color;
  }
  if (nameEl) {
    nameEl.textContent = cp.name + (cp.seatIndex === this.mySeat ? ' (You)' : '');
    nameEl.style.color = color;
  }

  var isMyTurn = (cp.seatIndex === this.mySeat);

  if (banner) {
    if (isMyTurn && !this._turnBannerShown) {
      this._turnBannerShown = true;
      banner.classList.add('show');
      sfx('turn');
      setTimeout(function() { banner.classList.remove('show'); }, 2500);
    } else if (!isMyTurn) {
      this._turnBannerShown = false;
      banner.classList.remove('show');
    }
  }

  if (waitEl) {
    if (isMyTurn) {
      waitEl.textContent = 'Your turn!';
      waitEl.style.color = '#2ecc71';
    } else {
      waitEl.textContent = 'Waiting for ' + cp.name + '...';
      waitEl.style.color = '#aaa';
    }
  }
};

MonopolyClient.prototype.updateButtons = function() {
  var isMyTurn = this.engine.currentTurn === this.mySeat;
  var phase = this.engine.gamePhase;
  var cp = this.engine.currentPlayer();
  var amBankrupt = cp && cp.bankrupt;

  var rollBtn = $('#btn-roll-dice');
  var endBtn = $('#btn-end-turn');
  var buildBtn = $('#btn-build');
  var mortgageBtn = $('#btn-mortgage');
  var tradeBtn = $('#btn-trade');

  if (amBankrupt || !isMyTurn) {
    rollBtn.disabled = true;
    endBtn.disabled = true;
    endBtn.style.display = 'none';
    buildBtn.disabled = true;
    mortgageBtn.disabled = true;
    tradeBtn.disabled = true;
    return;
  }

  rollBtn.disabled = (phase !== 'rolling');
  endBtn.style.display = (phase === 'action' || phase === 'landed') ? '' : 'none';
  endBtn.disabled = (phase !== 'action');
  buildBtn.disabled = false;
  mortgageBtn.disabled = false;
  tradeBtn.disabled = false;
};

/* ────────── SPACE TOOLTIPS ────────── */
MonopolyClient.prototype._setupSpaceTooltips = function() {
  var self = this;
  var tooltip = $('#space-tooltip');
  if (!tooltip) return;
  if (this._tooltipsAttached) return;
  this._tooltipsAttached = true;

  var spaces = $$('.space[data-pos]');
  for (var i = 0; i < spaces.length; i++) {
    (function(spaceEl) {
      spaceEl.addEventListener('mouseenter', function(e) {
        var pos = parseInt(spaceEl.getAttribute('data-pos'), 10);
        if (isNaN(pos)) return;
        var space = BOARD_DATA[pos];
        if (!space) return;

        var html = '<div class="tooltip-name">' + escHtml(space.name) + '</div>';

        if (space.price) {
          html += '<div class="tooltip-price">Price: $' + space.price + '</div>';
        }

        var ps = self.engine.propertyState[pos];
        if (ps && ps.owner !== null && ps.owner !== undefined) {
          var ownerP = self.engine.getPlayer(ps.owner);
          var ownerColor = PLAYER_COLORS[ps.owner] || '#888';
          html += '<div class="tooltip-owner"><span class="tooltip-owner-dot" style="background:' + ownerColor + ';"></span>' + escHtml(ownerP ? ownerP.name : 'Player ' + (ps.owner + 1)) + '</div>';

          if (ps.mortgaged) {
            html += '<div class="tooltip-mortgaged">MORTGAGED</div>';
          } else {
            var rent = self.engine.calculateRent(pos, 7);
            html += '<div class="tooltip-rent">Rent: $' + rent + '</div>';
          }

          if (ps.houses > 0) {
            if (ps.houses === 5) {
              html += '<div class="tooltip-houses">🏨 Hotel</div>';
            } else {
              html += '<div class="tooltip-houses">' + ps.houses + ' house' + (ps.houses > 1 ? 's' : '') + '</div>';
            }
          }
        } else if (space.price) {
          html += '<div class="tooltip-unowned">Unowned</div>';
          if (space.rent) {
            html += '<div class="tooltip-rent">Base rent: $' + space.rent[0] + '</div>';
          }
        }

        tooltip.innerHTML = html;
        tooltip.style.display = 'block';

        var rect = spaceEl.getBoundingClientRect();
        var tx = rect.left + rect.width / 2;
        var ty = rect.top - 8;
        tooltip.style.left = tx + 'px';
        tooltip.style.top = ty + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)';
      });

      spaceEl.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
      });
    })(spaces[i]);
  }
};

/* ────────── FLOATING TEXT ────────── */
MonopolyClient.prototype.showFloatingText = function(text, x, y, color) {
  var container = $('#floating-text-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'floating-text-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(container);
  }
  var el = document.createElement('div');
  el.className = 'floating-text';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  if (color) el.style.color = color;
  container.appendChild(el);
  setTimeout(function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1500);
};

/* ────────── FLASH MONEY ────────── */
MonopolyClient.prototype.flashMoney = function(seatIndex, amount) {
  var card = document.querySelector('.player-card[data-seat="' + seatIndex + '"]');
  if (!card) return;
  var cls = amount >= 0 ? 'flash-gain' : 'flash-loss';
  card.classList.add(cls);
  setTimeout(function() {
    card.classList.remove(cls);
  }, 700);
};

/* ────────── STATE SYNC ────────── */
MonopolyClient.prototype.syncState = function() {
  // BUG FIX #5: Include ALL engine state
  this.broadcastAction('update-state', this.engine.serialise());
};

MonopolyClient.prototype.broadcastAction = function(action, payload) {
  if (!this.socket) return;
  this.socket.emit('game-action', { action: action, payload: payload });
};

/* ────────── GAME LOG ────────── */
MonopolyClient.prototype.addLog = function(msg) {
  var log = $('#game-log');
  if (!log) return;
  var now = new Date();
  var time = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  var div = document.createElement('div');
  div.className = 'log-entry';
  div.innerHTML = '<span class="log-time">[' + time + ']</span> ' + escHtml(msg);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
};

/* ────────── AUTO-RECONNECT ────────── */
MonopolyClient.prototype._tryReconnect = function() {
  var session = loadSession('monopoly-session');
  if (!session || !session.roomCode) return;
  var self = this;
  this.roomCode = session.roomCode;
  this.mySeat = session.mySeat;
  this.myName = session.myName;
  this.isHost = session.isHost;
  this.reconnectToken = session.reconnectToken;

  // Wait for socket to connect then attempt rejoin
  this.socket.on('connect', function onReconn() {
    self.socket.off('connect', onReconn);
    self.socket.emit('join-room', {
      playerName: self.myName,
      roomCode: self.roomCode,
      reconnectToken: self.reconnectToken
    });
  });
};

/* ──────────────────────────────────────
   7. BOOTSTRAP
   ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  var client = new MonopolyClient();
  client.init();
  window.monopoly = client;
});
