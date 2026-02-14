/* ═══════════════════════════════════════════════════════════════
   6SIDES.LIVE — store.js
   In-game store with maps, tokens, themes, effects, and coins
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ──────────────────────────────────────
     STORE DATA
     ────────────────────────────────────── */
  var STORE_ITEMS = {
    maps: [
      { id: 'map_classic', name: 'Classic Board', icon: '🏙️', desc: 'The original 6sides board', price: 0, tag: '', owned: true },
      { id: 'map_cyberpunk', name: 'Neon District', icon: '🌃', desc: 'Cyberpunk city with neon-lit streets', price: 500, tag: 'popular' },
      { id: 'map_fantasy', name: 'Dragon Kingdom', icon: '🏰', desc: 'Medieval castles and dragon lairs', price: 750, tag: 'new' },
      { id: 'map_space', name: 'Stellar Station', icon: '🚀', desc: 'Trade properties across the galaxy', price: 750, tag: '' },
      { id: 'map_underwater', name: 'Atlantis Depths', icon: '🌊', desc: 'Sunken treasures and coral palaces', price: 600, tag: '' },
      { id: 'map_western', name: 'Gold Rush Town', icon: '🤠', desc: 'Wild west saloons and gold mines', price: 500, tag: 'sale' },
      { id: 'map_tokyo', name: 'Neo Tokyo', icon: '🗼', desc: 'Futuristic Tokyo with anime vibes', price: 800, tag: 'new' },
      { id: 'map_pirate', name: 'Pirate Cove', icon: '🏴‍☠️', desc: 'Navigate the seas, claim islands', price: 650, tag: '' }
    ],
    tokens: [
      { id: 'token_crown', name: 'Golden Crown', icon: '👑', desc: 'Rule the board in style', price: 200, tag: '' },
      { id: 'token_diamond', name: 'Diamond', icon: '💎', desc: 'Sparkling luxury token', price: 300, tag: 'popular' },
      { id: 'token_rocket', name: 'Rocket Ship', icon: '🚀', desc: 'Blast past your opponents', price: 250, tag: '' },
      { id: 'token_dragon', name: 'Baby Dragon', icon: '🐉', desc: 'Fiery and adorable', price: 400, tag: 'new' },
      { id: 'token_unicorn', name: 'Unicorn', icon: '🦄', desc: 'Magical and majestic', price: 350, tag: '' },
      { id: 'token_robot', name: 'Mecha Bot', icon: '🤖', desc: 'Cyberpunk battle robot', price: 300, tag: '' },
      { id: 'token_cat', name: 'Lucky Cat', icon: '🐱', desc: 'Fortune favors the feline', price: 200, tag: 'popular' },
      { id: 'token_alien', name: 'UFO', icon: '🛸', desc: 'Out of this world luck', price: 350, tag: '' }
    ],
    themes: [
      { id: 'theme_default', name: 'Midnight Empire', icon: '🌙', desc: 'Default dark premium theme', price: 0, tag: '', owned: true },
      { id: 'theme_ocean', name: 'Deep Ocean', icon: '🌊', desc: 'Cool blues and teals', price: 400, tag: '' },
      { id: 'theme_sunset', name: 'Sunset Blaze', icon: '🌅', desc: 'Warm oranges and reds', price: 400, tag: '' },
      { id: 'theme_forest', name: 'Enchanted Forest', icon: '🌲', desc: 'Mystical greens and golds', price: 400, tag: 'new' },
      { id: 'theme_rose', name: 'Rose Gold', icon: '🌹', desc: 'Elegant pink and gold', price: 500, tag: 'popular' },
      { id: 'theme_arctic', name: 'Arctic Frost', icon: '❄️', desc: 'Icy whites and light blues', price: 400, tag: '' }
    ],
    effects: [
      { id: 'fx_confetti', name: 'Confetti Burst', icon: '🎉', desc: 'Celebration confetti on wins', price: 0, tag: '', owned: true },
      { id: 'fx_fireworks', name: 'Fireworks', icon: '🎆', desc: 'Spectacular firework display', price: 300, tag: '' },
      { id: 'fx_lightning', name: 'Lightning Strike', icon: '⚡', desc: 'Electric effects on dice rolls', price: 250, tag: 'new' },
      { id: 'fx_sparkle', name: 'Sparkle Trail', icon: '✨', desc: 'Shimmering trail on token moves', price: 200, tag: 'popular' },
      { id: 'fx_flames', name: 'Flame Aura', icon: '🔥', desc: 'Fiery aura around your token', price: 350, tag: '' },
      { id: 'fx_snow', name: 'Snowfall', icon: '🌨️', desc: 'Gentle snowflakes while playing', price: 200, tag: '' }
    ],
    coins: [
      { id: 'coins_100', name: '100 Coins', icon: '🪙', amount: 100, bonus: 0, price: '$0.99', tag: '' },
      { id: 'coins_500', name: '500 Coins', icon: '🪙', amount: 500, bonus: 50, price: '$3.99', tag: 'popular' },
      { id: 'coins_1200', name: '1,200 Coins', icon: '🪙', amount: 1200, bonus: 200, price: '$7.99', tag: '' },
      { id: 'coins_3000', name: '3,000 Coins', icon: '🪙', amount: 3000, bonus: 750, price: '$14.99', tag: 'sale' },
      { id: 'coins_8000', name: '8,000 Coins', icon: '🪙', amount: 8000, bonus: 3000, price: '$29.99', tag: '' }
    ]
  };

  /* ──────────────────────────────────────
     STATE
     ────────────────────────────────────── */
  var userCoins = 500;
  var ownedItems = ['map_classic', 'theme_default', 'fx_confetti'];
  var activeTab = 'maps';

  // Load from localStorage
  function loadStoreState() {
    var saved = loadSession('6sides-store');
    if (saved) {
      userCoins = typeof saved.coins === 'number' ? saved.coins : 500;
      ownedItems = Array.isArray(saved.owned) ? saved.owned : ['map_classic', 'theme_default', 'fx_confetti'];
    }
    updateCoinDisplays();
  }

  function saveStoreState() {
    saveSession('6sides-store', { coins: userCoins, owned: ownedItems });
  }

  function updateCoinDisplays() {
    var els = document.querySelectorAll('#coin-amount, #store-coin-display, #stat-coins');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = userCoins.toLocaleString();
    }
  }

  /* ──────────────────────────────────────
     RENDER STORE
     ────────────────────────────────────── */
  function renderStore(tab) {
    activeTab = tab || activeTab;
    var container = document.getElementById('store-content');
    if (!container) return;

    // Update tab active states
    var tabs = document.querySelectorAll('.store-tab');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].classList.toggle('active', tabs[t].getAttribute('data-store-tab') === activeTab);
    }

    var items = STORE_ITEMS[activeTab];
    if (!items) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;grid-column:1/-1;">Coming soon!</p>'; return; }

    var html = '';

    if (activeTab === 'coins') {
      // Special layout for coin packages
      for (var c = 0; c < items.length; c++) {
        var coin = items[c];
        var tagHtml = coin.tag ? '<span class="store-item-tag tag-' + coin.tag + '">' + coin.tag.toUpperCase() + '</span>' : '';
        var bonusHtml = coin.bonus > 0 ? '<div class="coin-package-bonus">+' + coin.bonus + ' BONUS</div>' : '';

        html += '<div class="store-item coin-package" data-id="' + coin.id + '">';
        html += tagHtml;
        html += '<div class="coin-package-amount"><span>🪙</span> ' + coin.amount.toLocaleString() + '</div>';
        html += bonusHtml;
        html += '<div class="store-item-name">' + escHtml(coin.name) + '</div>';
        html += '<div class="coin-package-price-real">' + coin.price + '</div>';
        html += '</div>';
      }
    } else {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var isOwned = item.owned || ownedItems.indexOf(item.id) !== -1;
        var tagHtml2 = '';
        if (isOwned) {
          tagHtml2 = '<span class="store-item-owned-badge">✓ OWNED</span>';
        } else if (item.tag) {
          tagHtml2 = '<span class="store-item-tag tag-' + item.tag + '">' + item.tag.toUpperCase() + '</span>';
        }

        var priceHtml = '';
        if (isOwned) {
          priceHtml = '<span class="store-item-price free">✓ Owned</span>';
        } else if (item.price === 0) {
          priceHtml = '<span class="store-item-price free">FREE</span>';
        } else {
          priceHtml = '<span class="store-item-price">🪙 ' + item.price + '</span>';
        }

        html += '<div class="store-item' + (isOwned ? ' owned' : '') + '" data-id="' + item.id + '">';
        html += tagHtml2;
        html += '<span class="store-item-icon">' + item.icon + '</span>';
        html += '<div class="store-item-name">' + escHtml(item.name) + '</div>';
        html += '<div class="store-item-desc">' + escHtml(item.desc) + '</div>';
        html += priceHtml;
        html += '</div>';
      }
    }

    container.innerHTML = html;

    // Bind click events
    var storeItems = container.querySelectorAll('.store-item');
    for (var s = 0; s < storeItems.length; s++) {
      storeItems[s].addEventListener('click', handleItemClick);
    }
  }

  /* ──────────────────────────────────────
     PURCHASE LOGIC
     ────────────────────────────────────── */
  function handleItemClick(e) {
    var el = e.currentTarget;
    var itemId = el.getAttribute('data-id');
    if (!itemId) return;

    // Coin packages
    if (activeTab === 'coins') {
      var coinItem = findItem('coins', itemId);
      if (coinItem) {
        // Simulate purchase (in a real app, this would go through a payment gateway)
        var total = coinItem.amount + coinItem.bonus;
        userCoins += total;
        updateCoinDisplays();
        saveStoreState();
        if (typeof showToast === 'function') showToast('Added ' + total.toLocaleString() + ' coins to your account!', 'success');
        if (typeof sfx === 'function') sfx('purchase');
        renderStore();
      }
      return;
    }

    // Regular items
    if (ownedItems.indexOf(itemId) !== -1) {
      if (typeof showToast === 'function') showToast('You already own this item!', 'info');
      return;
    }

    var item = findItem(activeTab, itemId);
    if (!item) return;

    if (item.price === 0) {
      ownedItems.push(itemId);
      saveStoreState();
      if (typeof showToast === 'function') showToast('Unlocked: ' + item.name + '!', 'success');
      if (typeof sfx === 'function') sfx('purchase');
      renderStore();
      return;
    }

    if (userCoins < item.price) {
      if (typeof showToast === 'function') showToast('Not enough coins! You need ' + (item.price - userCoins) + ' more.', 'error');
      // Switch to coins tab
      renderStore('coins');
      return;
    }

    // Confirm purchase
    if (confirm('Buy "' + item.name + '" for 🪙 ' + item.price + ' coins?')) {
      userCoins -= item.price;
      ownedItems.push(itemId);
      updateCoinDisplays();
      saveStoreState();
      if (typeof showToast === 'function') showToast('Purchased: ' + item.name + '! 🎉', 'success');
      if (typeof sfx === 'function') sfx('purchase');
      renderStore();
    }
  }

  function findItem(tab, id) {
    var items = STORE_ITEMS[tab];
    if (!items) return null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  /* ──────────────────────────────────────
     MODAL CONTROLS
     ────────────────────────────────────── */
  function openStore() {
    var modal = document.getElementById('modal-store');
    if (modal) {
      modal.style.display = 'flex';
      renderStore(activeTab);
      if (typeof sfx === 'function') sfx('modal_open');
    }
  }

  function closeStore() {
    var modal = document.getElementById('modal-store');
    if (modal) modal.style.display = 'none';
  }

  /* ──────────────────────────────────────
     EVENT BINDINGS
     ────────────────────────────────────── */
  function initStore() {
    loadStoreState();

    // Store button in nav
    var storeBtn = document.getElementById('nav-store-btn');
    if (storeBtn) storeBtn.addEventListener('click', openStore);

    // Coin display click opens store coins tab
    var coinDisplay = document.getElementById('nav-coin-display');
    if (coinDisplay) coinDisplay.addEventListener('click', function() {
      openStore();
      setTimeout(function() { renderStore('coins'); }, 50);
    });

    // Close button
    var closeBtn = document.getElementById('btn-close-store');
    if (closeBtn) closeBtn.addEventListener('click', closeStore);

    // Store tabs
    var tabs = document.querySelectorAll('.store-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        var tab = this.getAttribute('data-store-tab');
        renderStore(tab);
      });
    }

    // Close on overlay click
    var overlay = document.getElementById('modal-store');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeStore();
      });
    }

    // Show NEW badge on store button
    var badge = document.getElementById('store-badge');
    if (badge) badge.style.display = '';

    // Initial render
    renderStore('maps');
  }

  /* ──────────────────────────────────────
     INIT ON DOM READY
     ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStore);
  } else {
    initStore();
  }

  /* ──────────────────────────────────────
     EXPORTS
     ────────────────────────────────────── */
  window.GameStore = {
    open: openStore,
    close: closeStore,
    getCoins: function() { return userCoins; },
    addCoins: function(n) { userCoins += n; updateCoinDisplays(); saveStoreState(); },
    ownsItem: function(id) { return ownedItems.indexOf(id) !== -1; },
    getOwned: function() { return ownedItems.slice(); }
  };

})();
