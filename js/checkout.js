// =============================================================================
// /js/checkout.js — frontend checkout helpers
// =============================================================================
// Two exports used by every product page:
//
//   populateRegionSelect(selectEl, productCategory)
//     Fills a <select> with all 25 regions, showing the per-product shipping
//     cost next to each name. `productCategory` is one of: 'ice_bath',
//     'chiller', 'sauna' — used for the price preview only.
//
//   goToCheckout({ sku, region, productPath })
//     POSTs to /api/create-checkout, then redirects to the Stripe Checkout
//     URL. `productPath` is the path of the current product page so Stripe
//     can return the customer there if they cancel.
// =============================================================================

import { SHIPPING_RATES, REGION_ORDER, prettyCity } from './shipping.js';

// ---------------------------------------------------------------------------
// Populate a <select> element with regions, formatted: "Auckland — $80"
// ---------------------------------------------------------------------------
export function populateRegionSelect(selectEl, productCategory = 'ice_bath') {
  // Clear any existing options
  selectEl.innerHTML = '';

  // Placeholder option (forces user to pick)
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select your region…';
  placeholder.disabled = true;
  placeholder.selected = true;
  selectEl.appendChild(placeholder);

  // Group North/South for visual scanning
  const northIslandEnd = REGION_ORDER.indexOf('WELLINGTON');

  const ni = document.createElement('optgroup');
  ni.label = 'North Island';
  const si = document.createElement('optgroup');
  si.label = 'South Island';

  REGION_ORDER.forEach((region, i) => {
    const cost = SHIPPING_RATES[region][productCategory];
    const opt = document.createElement('option');
    opt.value = region;
    opt.textContent = `${prettyCity(region)} — $${cost}`;
    opt.dataset.cost = cost;
    (i <= northIslandEnd ? ni : si).appendChild(opt);
  });

  selectEl.appendChild(ni);
  selectEl.appendChild(si);
}

// ---------------------------------------------------------------------------
// Hit the API, get a Stripe URL, redirect.
// ---------------------------------------------------------------------------
export async function goToCheckout({ sku, region, productPath }) {
  if (!sku) throw new Error('goToCheckout: sku required');
  if (!region) throw new Error('goToCheckout: region required');

  const origin = window.location.origin;
  const success_url = `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`;
  const cancel_url  = `${origin}${productPath || window.location.pathname}`;

  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, region, success_url, cancel_url }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Checkout failed (${res.status})`);
  }

  const { url } = await res.json();
  window.location.href = url;
}

// ---------------------------------------------------------------------------
// Wire up a product page in one call.
//
// Pass:
//   {
//     selectEl:        <select> for region
//     buyButton:       <button>/<a> to trigger checkout
//     category:        'ice_bath' | 'chiller' | 'sauna'  (for price preview)
//     getSku:          () => string  — current SKU based on variant state
//     productPath:     '/product-page/ice-bath-nz'  (for cancel_url)
//     onError?:        err => void  — optional error display
//     priceNoteEl?:    optional element to show "+ $80 shipping to Auckland"
//   }
//
// Returns a `refresh()` function: call after variant changes (e.g. user
// flipping from 4ft to 5ft) so the price preview re-renders.
// ---------------------------------------------------------------------------
export function setupCheckout(config) {
  const { selectEl, buyButton, category, getSku, productPath, onError, priceNoteEl } = config;

  populateRegionSelect(selectEl, category);

  function updatePriceNote() {
    if (!priceNoteEl) return;
    const region = selectEl.value;
    if (!region) {
      priceNoteEl.textContent = '';
      return;
    }
    const cost = SHIPPING_RATES[region][category];
    priceNoteEl.textContent = `+ $${cost} shipping to ${prettyCity(region)}`;
  }

  selectEl.addEventListener('change', updatePriceNote);

  async function onBuy(e) {
    e.preventDefault();
    const region = selectEl.value;
    if (!region) {
      selectEl.focus();
      if (onError) onError(new Error('Please select your shipping region'));
      else alert('Please select your shipping region');
      return;
    }

    const originalText = buyButton.textContent;
    buyButton.disabled = true;
    buyButton.textContent = 'Redirecting…';

    try {
      await goToCheckout({ sku: getSku(), region, productPath });
    } catch (err) {
      buyButton.disabled = false;
      buyButton.textContent = originalText;
      if (onError) onError(err);
      else alert(err.message);
    }
  }

  buyButton.addEventListener('click', onBuy);

  // Public refresh hook for variant changes
  return {
    refresh() {
      // Category doesn't change between variants on a single page, so just
      // re-render the price note. (If you ever needed to switch category,
      // call populateRegionSelect again.)
      updatePriceNote();
    },
  };
}
