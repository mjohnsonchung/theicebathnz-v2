// =============================================================================
// /js/cart-ui.js — Cart drawer + nav badge
// =============================================================================
// Self-initialising module. Import it on any page:
//   <script type="module" src="/js/cart-ui.js"></script>
//
// On load this module:
//   1. Injects CSS (once)
//   2. Injects the cart drawer into <body>
//   3. Injects a cart icon button into .nav-right (before the hamburger)
//   4. Subscribes to cart changes to keep badge + drawer in sync
// =============================================================================

import {
  PRODUCTS, SHIPPING_RATES, REGION_ORDER, SAUNA_FREIGHT,
  calculateShipping, prettyCity, islandOf,
} from './shipping.js';
import {
  getLines, addItem, setQty, removeLine, getCount,
  expandToProductIds, subscribe,
} from './cart.js';

// ---------------------------------------------------------------------------
// Styles — injected once per page
// ---------------------------------------------------------------------------
function injectStyles() {
  if (document.getElementById('cart-ui-styles')) return;
  const s = document.createElement('style');
  s.id = 'cart-ui-styles';
  s.textContent = `
    /* ── Cart nav button ─────────────────────────────── */
    .cart-nav-btn {
      position: relative;
      background: none; border: none;
      color: rgba(122, 155, 181, 1);
      padding: 0.4rem;
      cursor: pointer;
      transition: color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex; align-items: center; justify-content: center;
    }
    .cart-nav-btn:hover { color: #EEF5FA; }
    .cart-nav-badge {
      position: absolute; top: 0; right: 0;
      min-width: 1rem; height: 1rem;
      padding: 0 0.2rem;
      background: #5BC8F5; color: #020B15;
      border-radius: 9999px;
      font-size: 0.55rem; font-weight: 700;
      display: none; align-items: center; justify-content: center;
      font-family: 'Jost', sans-serif;
    }
    .cart-nav-badge.visible { display: flex; }

    /* ── Overlay ─────────────────────────────────────── */
    .cart-overlay {
      position: fixed; inset: 0; z-index: 500;
      background: rgba(2, 11, 21, 0.6);
      backdrop-filter: blur(4px);
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .cart-overlay.open {
      opacity: 1; pointer-events: auto;
    }

    /* ── Drawer ──────────────────────────────────────── */
    .cart-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: min(420px, 100vw);
      background: #0A1828;
      border-left: 1px solid rgba(91, 200, 245, 0.1);
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 501;
      overflow: hidden;
    }
    .cart-overlay.open .cart-drawer {
      transform: translateX(0);
    }

    /* ── Drawer header ───────────────────────────────── */
    .cart-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(91, 200, 245, 0.1);
      flex-shrink: 0;
    }
    .cart-header-title {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #EEF5FA;
    }
    .cart-close-btn {
      background: none; border: none;
      color: rgba(122, 155, 181, 1);
      font-size: 1.25rem; line-height: 1;
      padding: 0.25rem; cursor: pointer;
      transition: color 0.2s;
    }
    .cart-close-btn:hover { color: #EEF5FA; }

    /* ── Body (scrollable) ───────────────────────────── */
    .cart-body {
      flex: 1; overflow-y: auto;
      padding: 1.25rem 1.5rem;
      display: flex; flex-direction: column; gap: 0.875rem;
    }
    .cart-body::-webkit-scrollbar { width: 4px; }
    .cart-body::-webkit-scrollbar-track { background: transparent; }
    .cart-body::-webkit-scrollbar-thumb { background: rgba(91,200,245,0.15); border-radius: 2px; }

    /* ── Line item ───────────────────────────────────── */
    .cart-line {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem 1rem;
      padding: 0.875rem 1rem;
      background: #0C1E35;
      border: 1px solid rgba(91, 200, 245, 0.1);
      border-radius: 0.625rem;
    }
    .cart-line-name {
      font-size: 0.875rem; font-weight: 400;
      color: #EEF5FA; line-height: 1.35;
      grid-column: 1;
    }
    .cart-line-price {
      font-size: 0.875rem; font-weight: 500;
      color: #EEF5FA;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      text-align: right;
      grid-column: 2;
    }
    .cart-line-controls {
      display: flex; align-items: center; gap: 0.75rem;
      grid-column: 1;
    }
    .cart-qty-btn {
      width: 1.75rem; height: 1.75rem;
      background: rgba(91, 200, 245, 0.08);
      border: 1px solid rgba(91, 200, 245, 0.15);
      border-radius: 50%;
      color: #EEF5FA;
      font-size: 1rem; line-height: 1;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .cart-qty-btn:hover {
      background: rgba(91, 200, 245, 0.16);
      border-color: rgba(91, 200, 245, 0.3);
    }
    .cart-qty-num {
      font-size: 0.875rem; font-weight: 500;
      color: #EEF5FA; min-width: 1.25rem; text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .cart-remove-btn {
      background: none; border: none;
      color: rgba(122, 155, 181, 0.6);
      font-size: 0.75rem; letter-spacing: 0.08em;
      cursor: pointer; padding: 0; line-height: 1;
      transition: color 0.15s;
      grid-column: 2; align-self: center;
    }
    .cart-remove-btn:hover { color: #fca5a5; }

    /* ── Empty state ─────────────────────────────────── */
    .cart-empty {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 1rem; text-align: center;
      padding: 3rem 1.5rem;
    }
    .cart-empty-icon {
      width: 48px; height: 48px;
      color: rgba(122, 155, 181, 0.3);
    }
    .cart-empty-text {
      font-size: 0.9rem; color: rgba(122, 155, 181, 0.7);
      line-height: 1.5;
    }
    .cart-empty-link {
      font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
      color: #5BC8F5; text-decoration: none;
      border-bottom: 1px solid rgba(91, 200, 245, 0.3);
      padding-bottom: 0.1rem;
      transition: border-color 0.2s;
    }
    .cart-empty-link:hover { border-color: #5BC8F5; }

    /* ── Footer (fixed at bottom) ────────────────────── */
    .cart-footer {
      border-top: 1px solid rgba(91, 200, 245, 0.1);
      padding: 1.25rem 1.5rem;
      flex-shrink: 0;
      display: flex; flex-direction: column; gap: 1rem;
    }

    /* ── Region / sauna freight selectors ────────────── */
    .cart-select-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .cart-select-label {
      font-size: 0.68rem; font-weight: 600;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: rgba(122, 155, 181, 0.8);
    }
    .cart-select-wrap { position: relative; }
    .cart-select-wrap::after {
      content: '';
      position: absolute; right: 1rem; top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid rgba(122, 155, 181, 0.6);
      pointer-events: none;
    }
    .cart-select {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 1rem;
      background: #0C1E35;
      border: 1px solid rgba(91, 200, 245, 0.1);
      border-radius: 0.5rem;
      color: #EEF5FA;
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem; font-weight: 300;
      appearance: none; cursor: pointer;
      transition: border-color 0.2s;
    }
    .cart-select:hover { border-color: rgba(91, 200, 245, 0.25); }
    .cart-select:focus { outline: none; border-color: #5BC8F5; }
    .cart-select option, .cart-select optgroup { background: #071525; }

    /* ── Totals ──────────────────────────────────────── */
    .cart-totals { display: flex; flex-direction: column; gap: 0.375rem; }
    .cart-total-row {
      display: flex; justify-content: space-between; align-items: baseline;
      font-size: 0.875rem; color: rgba(238, 245, 250, 0.7);
    }
    .cart-total-row.grand {
      font-size: 0.9375rem; font-weight: 600;
      color: #EEF5FA;
      padding-top: 0.375rem;
      border-top: 1px solid rgba(91, 200, 245, 0.1);
      margin-top: 0.25rem;
    }
    .cart-total-val {
      font-variant-numeric: tabular-nums; white-space: nowrap;
    }
    .cart-total-val.grand-val {
      color: #5BC8F5; font-size: 1.25rem;
      letter-spacing: -0.02em;
    }
    .cart-shipping-pending {
      color: rgba(238, 245, 250, 0.3); font-style: italic;
      font-size: 0.8rem;
    }

    /* ── Checkout button ─────────────────────────────── */
    .cart-checkout-btn {
      width: 100%;
      padding: 0.9rem;
      background: #5BC8F5; color: #020B15;
      border: none; border-radius: 9999px;
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      cursor: pointer;
      transition:
        background 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .cart-checkout-btn:hover:not(:disabled) {
      background: #B8E8FF;
      transform: translateY(-1px);
      box-shadow: 0 8px 28px rgba(91, 200, 245, 0.3);
    }
    .cart-checkout-btn:active:not(:disabled) { transform: translateY(0); }
    .cart-checkout-btn:disabled {
      opacity: 0.4; cursor: not-allowed; pointer-events: none;
    }

    /* ── Inline error ────────────────────────────────── */
    .cart-error {
      padding: 0.6rem 0.875rem;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.5rem;
      color: #fca5a5;
      font-size: 0.8rem; line-height: 1.5;
    }
  `;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// Format NZD cents → "NZ$2,399"
// ---------------------------------------------------------------------------
function fmtNZD(cents) {
  return 'NZ$' + (cents / 100).toLocaleString('en-NZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ---------------------------------------------------------------------------
// Drawer DOM refs
// ---------------------------------------------------------------------------
let overlay, drawer, body, footer;
let regionSelect, saunaSelect, checkoutBtn, errorEl;
let isOpen = false;

// ---------------------------------------------------------------------------
// Build the drawer HTML skeleton
// ---------------------------------------------------------------------------
function buildDrawer() {
  overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Shopping cart');

  const header = document.createElement('div');
  header.className = 'cart-header';
  header.innerHTML = `
    <span class="cart-header-title">Your Cart</span>
    <button class="cart-close-btn" aria-label="Close cart">✕</button>
  `;
  header.querySelector('.cart-close-btn').addEventListener('click', closeDrawer);

  body = document.createElement('div');
  body.className = 'cart-body';

  footer = document.createElement('div');
  footer.className = 'cart-footer';

  drawer.appendChild(header);
  drawer.appendChild(body);
  drawer.appendChild(footer);
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
}

// ---------------------------------------------------------------------------
// Build nav cart button
// ---------------------------------------------------------------------------
function buildNavButton() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  const btn = document.createElement('button');
  btn.id = 'cart-nav-btn';
  btn.className = 'cart-nav-btn';
  btn.setAttribute('aria-label', 'Open cart');
  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    <span class="cart-nav-badge" id="cart-badge"></span>
  `;
  btn.addEventListener('click', openDrawer);

  // Insert before the hamburger button (or as first child)
  const hamburger = navRight.querySelector('.nav-hamburger');
  if (hamburger) {
    navRight.insertBefore(btn, hamburger);
  } else {
    navRight.prepend(btn);
  }
}

// ---------------------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------------------
export function openDrawer() {
  isOpen = true;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  render();
}

export function closeDrawer() {
  isOpen = false;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ---------------------------------------------------------------------------
// Badge update
// ---------------------------------------------------------------------------
function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCount();
  badge.textContent = count > 9 ? '9+' : String(count);
  badge.classList.toggle('visible', count > 0);
}

// ---------------------------------------------------------------------------
// Populate region dropdown
// ---------------------------------------------------------------------------
function buildRegionSelect() {
  const sel = document.createElement('select');
  sel.className = 'cart-select';
  sel.id = 'cart-region-select';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select your region…';
  placeholder.disabled = true;
  placeholder.selected = true;
  sel.appendChild(placeholder);

  const northIslandEnd = REGION_ORDER.indexOf('WELLINGTON');
  const ni = document.createElement('optgroup');
  ni.label = 'North Island';
  const si = document.createElement('optgroup');
  si.label = 'South Island';

  REGION_ORDER.forEach((region, i) => {
    const opt = document.createElement('option');
    opt.value = region;
    opt.textContent = prettyCity(region);
    (i <= northIslandEnd ? ni : si).appendChild(opt);
  });

  sel.appendChild(ni);
  sel.appendChild(si);
  return sel;
}

// ---------------------------------------------------------------------------
// Populate sauna freight dropdown
// ---------------------------------------------------------------------------
function buildSaunaSelect() {
  const sel = document.createElement('select');
  sel.className = 'cart-select';
  sel.id = 'cart-sauna-select';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select delivery option…';
  placeholder.disabled = true;
  placeholder.selected = true;
  sel.appendChild(placeholder);

  for (const [key, { label }] of Object.entries(SAUNA_FREIGHT)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = label;
    sel.appendChild(opt);
  }
  return sel;
}

// ---------------------------------------------------------------------------
// Main render — builds body + footer from current cart state
// ---------------------------------------------------------------------------
function render() {
  if (!body || !footer) return;

  const currentLines = getLines();
  const isEmpty = currentLines.length === 0;

  // ── Body ──────────────────────────────────────────────────────────────────

  body.innerHTML = '';

  if (isEmpty) {
    const emptyState = document.createElement('div');
    emptyState.className = 'cart-empty';
    emptyState.innerHTML = `
      <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p class="cart-empty-text">Your cart is empty.</p>
      <a class="cart-empty-link" href="/buy-now">Browse products →</a>
    `;
    body.appendChild(emptyState);
    footer.innerHTML = '';
    return;
  }

  // Line items
  for (const { sku, qty } of currentLines) {
    const p = PRODUCTS[sku];
    if (!p) continue;

    const line = document.createElement('div');
    line.className = 'cart-line';
    line.innerHTML = `
      <span class="cart-line-name">${p.name}</span>
      <span class="cart-line-price">${fmtNZD(p.amount * qty)}</span>
      <div class="cart-line-controls">
        <button class="cart-qty-btn" data-sku="${sku}" data-delta="-1" aria-label="Decrease quantity">−</button>
        <span class="cart-qty-num">${qty}</span>
        <button class="cart-qty-btn" data-sku="${sku}" data-delta="1" aria-label="Increase quantity">+</button>
      </div>
      <button class="cart-remove-btn" data-sku="${sku}" aria-label="Remove ${p.name}">Remove</button>
    `;
    body.appendChild(line);
  }

  // Qty stepper + remove handlers
  body.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sku = btn.dataset.sku;
      const delta = parseInt(btn.dataset.delta, 10);
      const line = currentLines.find(l => l.sku === sku);
      if (line) setQty(sku, line.qty + delta);
    });
  });
  body.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeLine(btn.dataset.sku));
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  footer.innerHTML = '';

  const expandedIds = expandToProductIds();
  const cats = expandedIds.map(id => PRODUCTS[id]?.ship);
  const hasBath    = cats.includes('ice_bath');
  const hasChiller = cats.includes('chiller');
  const hasSauna   = cats.includes('sauna');
  const needsRegion = hasBath || hasChiller;

  // Subtotal
  const subtotalCents = currentLines.reduce(
    (sum, { sku, qty }) => sum + (PRODUCTS[sku]?.amount || 0) * qty, 0
  );

  // ── Region selector (shown when bath or chiller in cart) ──────────────────
  if (needsRegion) {
    const group = document.createElement('div');
    group.className = 'cart-select-group';

    const label = document.createElement('p');
    label.className = 'cart-select-label';
    label.textContent = 'Shipping Region';

    const wrap = document.createElement('div');
    wrap.className = 'cart-select-wrap';

    regionSelect = buildRegionSelect();
    // Restore previous selection if available
    const savedRegion = footer.querySelector('#cart-region-select')?.value || '';
    if (savedRegion && SHIPPING_RATES[savedRegion]) regionSelect.value = savedRegion;

    regionSelect.addEventListener('change', () => {
      // Auto-update sauna freight default when region changes
      if (hasSauna && saunaSelect) {
        const island = islandOf(regionSelect.value);
        const currentSauna = saunaSelect.value;
        // Only auto-select if user hasn't picked a zero-cost option
        const isFreeOption = currentSauna === 'own_freight' || currentSauna === 'pickup_akl';
        if (!currentSauna || !isFreeOption) {
          saunaSelect.value = island === 'north' ? 'north_island' : 'south_island';
        }
      }
      render();
    });

    wrap.appendChild(regionSelect);
    group.appendChild(label);
    group.appendChild(wrap);
    footer.appendChild(group);
  } else {
    regionSelect = null;
  }

  // ── Sauna freight selector ────────────────────────────────────────────────
  if (hasSauna) {
    const group = document.createElement('div');
    group.className = 'cart-select-group';

    const label = document.createElement('p');
    label.className = 'cart-select-label';
    label.textContent = 'Sauna Delivery';

    const wrap = document.createElement('div');
    wrap.className = 'cart-select-wrap';

    const prevSaunaVal = footer.querySelector('#cart-sauna-select')?.value || '';
    saunaSelect = buildSaunaSelect();

    // Restore or auto-select from region
    if (prevSaunaVal) {
      saunaSelect.value = prevSaunaVal;
    } else if (needsRegion && regionSelect?.value) {
      const island = islandOf(regionSelect.value);
      saunaSelect.value = island === 'north' ? 'north_island' : 'south_island';
    }

    saunaSelect.addEventListener('change', render);

    wrap.appendChild(saunaSelect);
    group.appendChild(label);
    group.appendChild(wrap);
    footer.appendChild(group);
  } else {
    saunaSelect = null;
  }

  // ── Compute shipping ──────────────────────────────────────────────────────
  const region         = regionSelect?.value || null;
  const saunaFreightKey = saunaSelect?.value  || null;

  let shippingCents = null;
  let shippingLabel = 'Shipping';

  const regionReady = !needsRegion || (region && SHIPPING_RATES[region]);
  const saunaReady  = !hasSauna   || !!saunaFreightKey;

  if (regionReady && saunaReady) {
    try {
      shippingCents = calculateShipping(expandedIds, region, saunaFreightKey) * 100;
      if (region) shippingLabel = `Shipping to ${prettyCity(region)}`;
      else if (saunaFreightKey && !needsRegion) shippingLabel = 'Sauna delivery';
    } catch (_) { /* invalid state — keep null */ }
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totals = document.createElement('div');
  totals.className = 'cart-totals';

  totals.innerHTML = `
    <div class="cart-total-row">
      <span>Subtotal</span>
      <span class="cart-total-val">${fmtNZD(subtotalCents)}</span>
    </div>
    <div class="cart-total-row">
      <span>${shippingLabel}</span>
      <span class="cart-total-val ${shippingCents === null ? 'cart-shipping-pending' : ''}">
        ${shippingCents === null ? 'Select options above' : fmtNZD(shippingCents)}
      </span>
    </div>
    <div class="cart-total-row grand">
      <span>Total</span>
      <span class="cart-total-val grand-val">
        ${shippingCents !== null
          ? fmtNZD(subtotalCents + shippingCents)
          : fmtNZD(subtotalCents) + '+'}
      </span>
    </div>
  `;
  footer.appendChild(totals);

  // ── Error slot ────────────────────────────────────────────────────────────
  errorEl = document.createElement('p');
  errorEl.className = 'cart-error';
  errorEl.hidden = true;
  footer.appendChild(errorEl);

  // ── Checkout button ───────────────────────────────────────────────────────
  const canCheckout = currentLines.length > 0 && regionReady && saunaReady;

  checkoutBtn = document.createElement('button');
  checkoutBtn.className = 'cart-checkout-btn';
  checkoutBtn.disabled = !canCheckout;
  checkoutBtn.innerHTML = `
    Checkout
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  checkoutBtn.addEventListener('click', handleCheckout);
  footer.appendChild(checkoutBtn);
}

// ---------------------------------------------------------------------------
// Checkout handler
// ---------------------------------------------------------------------------
async function handleCheckout() {
  if (!checkoutBtn) return;

  const currentLines = getLines();
  const region = regionSelect?.value || null;
  const saunaFreight = saunaSelect?.value || null;

  if (errorEl) { errorEl.hidden = true; }

  const originalText = checkoutBtn.innerHTML;
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Redirecting…';

  const origin = window.location.origin;
  const success_url = `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`;
  const cancel_url  = `${origin}${window.location.pathname}`;

  const payload = {
    items: currentLines.map(({ sku, qty }) => ({ sku, qty })),
    success_url,
    cancel_url,
  };
  if (region) payload.region = region;
  if (saunaFreight) payload.saunaFreight = saunaFreight;

  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Checkout failed (${res.status})`);
    }

    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    checkoutBtn.innerHTML = originalText;
    checkoutBtn.disabled = false;
    if (errorEl) {
      errorEl.textContent = err.message || 'Something went wrong. Please try again.';
      errorEl.hidden = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
function init() {
  injectStyles();
  buildDrawer();
  buildNavButton();
  updateBadge();
  subscribe(() => {
    updateBadge();
    if (isOpen) render();
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
