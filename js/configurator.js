// =============================================================================
// /js/configurator.js — Live order summary + checkout
// =============================================================================
// Export: setupConfigurator(config)
//
// Renders a live order summary panel (line items, subtotal, shipping, total)
// that updates in real time as the customer changes variants or region.
// One Buy button triggers the multi-item Stripe Checkout Session.
//
// Config shape:
//   {
//     summaryEl,        // <div> where the live summary renders
//     buyButton,        // <button> Buy Now
//     regionSelectEl,   // <select> for shipping region
//     shipNoteEl,       // <p> for "+ $80 shipping to Auckland"
//     category,         // 'ice_bath' | 'chiller' | 'sauna' (initial freight category)
//     productPath,      // '/product-page/ice-bath-nz' (for cancel_url)
//     getItems,         // () => string[]  — current array of selected SKUs
//   }
//
// Returns: { refresh() } — call after any variant change to re-render.
// =============================================================================

import {
  PRODUCTS,
  SHIPPING_RATES,
  calculateShipping,
  prettyCity,
} from './shipping.js';
import { populateRegionSelect } from './checkout.js';

// ---------------------------------------------------------------------------
// Freight category priority — determines which rate column to use when
// multiple product types are in the cart. Larger/heavier item wins.
// ---------------------------------------------------------------------------
const CATEGORY_PRIORITY = { ice_bath: 4, sauna: 3, chiller: 2, accessory: 1 };

function getDominantCategory(skus) {
  let best = 'chiller';
  let bestPriority = 0;
  for (const sku of skus) {
    const cat = PRODUCTS[sku]?.ship || 'accessory';
    const p = CATEGORY_PRIORITY[cat] || 0;
    if (p > bestPriority) {
      best = cat;
      bestPriority = p;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Format NZD cents → "$2,712"
// ---------------------------------------------------------------------------
function fmtNZD(cents) {
  return '$' + (cents / 100).toLocaleString('en-NZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ---------------------------------------------------------------------------
// Inject shared styles (once per page)
// Uses CSS variables already defined on each product page:
//   --surface, --border, --ice (blue pages), --ember (sauna page)
// ---------------------------------------------------------------------------
function injectStyles() {
  if (document.getElementById('cfg-styles')) return;
  const style = document.createElement('style');
  style.id = 'cfg-styles';
  style.textContent = `
    .cfg-summary {
      padding: 1.25rem 1.5rem;
      background: var(--surface, #0A1828);
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      border-radius: 0.75rem;
    }
    .cfg-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      padding: 0.375rem 0;
      font-size: 0.9375rem;
      color: rgba(255,255,255,0.7);
      letter-spacing: 0.01em;
    }
    .cfg-label { flex: 1; }
    .cfg-value {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      color: rgba(255,255,255,0.85);
    }
    .cfg-divider {
      border: none;
      border-top: 1px solid var(--border, rgba(255,255,255,0.07));
      margin: 0.5rem 0;
    }
    .cfg-total-row {
      padding-top: 0.375rem;
    }
    .cfg-total-row .cfg-label {
      color: #fff;
      font-weight: 600;
      font-size: 1rem;
    }
    .cfg-total {
      /* Uses the page's accent: --ice on bath/chiller pages, --ember on sauna */
      color: var(--ice, var(--ember, #5BC8F5));
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .cfg-shipping-pending {
      color: rgba(255,255,255,0.35);
      font-style: italic;
    }
    /* Buy button disabled state */
    #buy-button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }
    /* Inline error */
    #buy-error {
      margin-top: 0.75rem;
      padding: 0.6rem 0.875rem;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.5rem;
      color: #fca5a5;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function setupConfigurator(config) {
  const {
    summaryEl,
    buyButton,
    regionSelectEl,
    shipNoteEl,
    category: initialCategory,
    productPath,
    getItems,
  } = config;

  let currentCategory = initialCategory;

  // Inject shared styles
  injectStyles();

  // Populate the region dropdown on init
  populateRegionSelect(regionSelectEl, currentCategory);

  // Error display — expected: <p id="buy-error" hidden> near the buy button
  const buyErrorEl = document.getElementById('buy-error');

  // -------------------------------------------------------------------------
  // render() — recomputes and repaints the summary on every state change
  // -------------------------------------------------------------------------
  function render() {
    const items = getItems();
    const region = regionSelectEl.value;

    // Determine dominant freight category from current items.
    // If category changed, repopulate the dropdown (preserving selection).
    if (items.length > 0) {
      const dominant = getDominantCategory(items);
      if (dominant !== currentCategory) {
        currentCategory = dominant;
        const saved = regionSelectEl.value;
        populateRegionSelect(regionSelectEl, currentCategory);
        if (saved) regionSelectEl.value = saved;
      }
    }

    // Subtotal in cents
    const subtotalCents = items.reduce((sum, sku) => sum + (PRODUCTS[sku]?.amount || 0), 0);

    // Shipping
    let shippingCents = null;
    let cityLabel = '';
    if (region && items.length > 0) {
      try {
        shippingCents = calculateShipping(items, region) * 100;
        cityLabel = prettyCity(region);
      } catch (_) { /* unknown region — ignore */ }
    }

    const hasShipping = shippingCents !== null;
    const totalCents = subtotalCents + (hasShipping ? shippingCents : 0);
    const canBuy = items.length > 0 && hasShipping;

    // Build summary HTML
    const rows = [];

    // One row per product
    for (const sku of items) {
      const p = PRODUCTS[sku];
      if (!p) continue;
      rows.push(`
        <div class="cfg-row">
          <span class="cfg-label">${p.name}</span>
          <span class="cfg-value">${fmtNZD(p.amount)}</span>
        </div>`);
    }

    rows.push('<hr class="cfg-divider">');

    // Subtotal row — only shown when there are multiple items
    if (items.length > 1) {
      rows.push(`
        <div class="cfg-row">
          <span class="cfg-label">Subtotal</span>
          <span class="cfg-value">${fmtNZD(subtotalCents)}</span>
        </div>`);
    }

    // Shipping row
    rows.push(`
      <div class="cfg-row">
        <span class="cfg-label">${hasShipping ? `Shipping to ${cityLabel}` : 'Shipping'}</span>
        <span class="cfg-value ${hasShipping ? '' : 'cfg-shipping-pending'}">
          ${hasShipping ? fmtNZD(shippingCents) : 'Select region'}
        </span>
      </div>`);

    rows.push('<hr class="cfg-divider">');

    // Total row
    rows.push(`
      <div class="cfg-row cfg-total-row">
        <span class="cfg-label">Total</span>
        <span class="cfg-value cfg-total">
          ${hasShipping ? fmtNZD(totalCents) : fmtNZD(subtotalCents) + '+'}
        </span>
      </div>`);

    summaryEl.innerHTML = `<div class="cfg-summary">${rows.join('')}</div>`;

    // Ship note element (e.g. above the buy button)
    if (shipNoteEl) {
      if (hasShipping) {
        shipNoteEl.textContent = `+ ${fmtNZD(shippingCents)} shipping to ${cityLabel}`;
      } else {
        shipNoteEl.textContent = 'Select your shipping region above';
      }
    }

    // Enable / disable buy button
    buyButton.disabled = !canBuy;
  }

  // -------------------------------------------------------------------------
  // Re-render when region changes
  // -------------------------------------------------------------------------
  regionSelectEl.addEventListener('change', render);

  // -------------------------------------------------------------------------
  // Buy button — POST multi-item cart to /api/create-checkout
  // -------------------------------------------------------------------------
  buyButton.addEventListener('click', async (e) => {
    e.preventDefault();
    clearError();

    const items = getItems();
    const region = regionSelectEl.value;

    if (!region) {
      regionSelectEl.focus();
      showError('Please select your shipping region before continuing.');
      return;
    }

    const originalText = buyButton.textContent;
    buyButton.disabled = true;
    buyButton.textContent = 'Redirecting…';

    const origin = window.location.origin;
    const success_url = `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url  = `${origin}${productPath}`;

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, region, success_url, cancel_url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Checkout failed (${res.status})`);
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      buyButton.textContent = originalText;
      render(); // restores disabled state correctly
      showError(err.message || 'Something went wrong. Please try again.');
    }
  });

  // -------------------------------------------------------------------------
  // Error helpers
  // -------------------------------------------------------------------------
  function showError(msg) {
    if (!buyErrorEl) return;
    buyErrorEl.textContent = msg;
    buyErrorEl.hidden = false;
  }

  function clearError() {
    if (!buyErrorEl) return;
    buyErrorEl.textContent = '';
    buyErrorEl.hidden = true;
  }

  // Initial render
  render();

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  return {
    /** Call after any variant toggle to re-render the summary. */
    refresh() {
      clearError();
      render();
    },
  };
}
