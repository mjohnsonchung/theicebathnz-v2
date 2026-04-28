# Claude Code Brief — Dynamic Cart Checkout

Paste this entire file into Claude Code as your brief. Work through it
top-to-bottom; each phase is independently testable.

---

## Context

This is The Ice Bath NZ v2 — a static site (HTML + vanilla JS, no framework)
deployed on Vercel. See `progress.md` in the repo root for full history.

**What exists already (built in a previous session):**
- `js/shipping.js` — single source of truth for shipping rates (25 NZ
  Mainfreight depots × 4 freight categories), product catalog (prices in
  NZD cents), and helper functions
- `js/checkout.js` — frontend helpers for region dropdown + checkout redirect
- `api/create-checkout.js` — Vercel serverless function that creates Stripe
  Checkout Sessions
- `package.json` — adds `stripe` dependency, sets `type: module`
- `STRIPE_SECRET_KEY` env var set in Vercel

**What we're changing:**
Replace the per-variant Buy Now buttons (currently each one POSTs a single
SKU to the API) with a live order summary panel on each product page. The
customer sees subtotal + shipping + total update in real time as they tick
options. One Buy button at the bottom sends the assembled cart to checkout.

**Key decisions made by the user:**
- Bundle pricing is now pure sum of line items (no $17 bundle discount)
- Accessories (Cover, Hose) — leave out for now
- Each product page becomes a configurator for its product family
- The 3 product pages stay; we are NOT building a unified "build your setup"
  page — keep the existing storytelling/photos/specs intact

---

## Phase 1 — Update the API to accept a cart (multi-item)

**File:** `api/create-checkout.js`

The function currently accepts `{ sku, region, success_url, cancel_url }`.
Change it to accept `{ items: [sku1, sku2, ...], region, success_url, cancel_url }`.

Specifically:

1. Replace the `sku` field with `items` (array of SKU strings).
2. Validate `items` is a non-empty array.
3. Resolve each SKU using the existing `resolveSkuToItems()` helper, then
   flatten — so `items: ['ice_bath_4ft', 'chiller_standard']` becomes the
   product list `['ice_bath_4ft', 'chiller_standard']`. (The helper already
   handles bundle SKUs by expanding them; we'll stop using bundle SKUs from
   the frontend but keep the helper working in case anything else uses it.)
4. Build line_items by iterating the resolved product list — one Stripe
   line item per product.
5. Pass the full product list to `calculateShipping()` (already supports it).
6. Update metadata to record items: `metadata: { items: items.join(','), region, shipping_nzd: String(shippingNZD) }`.
7. Stripe metadata values are capped at 500 chars — fine for our use, but
   keep the join compact.

**Do not** modify `js/shipping.js`. The catalog and rates are correct as-is.
The `BUNDLES` constant and `resolveSkuToItems()` helper can stay (they're
harmless once the frontend stops sending bundle SKUs).

**After editing:** the function must still work for a single-item cart
(e.g. `items: ['sauna_barrel']`). Sanity-check this before moving on.

---

## Phase 2 — Build a reusable "configurator" frontend module

**New file:** `js/configurator.js`

Export a `setupConfigurator()` function that any product page can call. It
should:

1. Accept config:
   ```js
   {
     summaryEl,        // <div> where the live summary renders
     buyButton,        // <button> Buy Now
     regionSelectEl,   // <select> for shipping region
     shipNoteEl,       // <p> for "+ $80 shipping to Auckland"
     category,         // 'ice_bath' | 'chiller' | 'sauna' (drives shipping rate column shown)
     productPath,      // '/product-page/ice-bath-nz' (for cancel_url)
     getItems,         // () => string[]  — current array of selected SKUs
   }
   ```

2. Define an internal `render()` function that:
   - Reads current items via `getItems()`
   - Reads current region from `regionSelectEl.value` (may be empty)
   - For each item, looks up `PRODUCTS[sku].name` and `.amount` (cents) from
     `js/shipping.js`
   - Renders the summary as a list of line rows:
     ```
     4ft Ice Bath              $784
     Standard Chiller        $2,712
     ────────────────────────────────
     Subtotal                $3,496
     Shipping to Auckland       $80   (or "Select region" if not picked)
     ────────────────────────────────
     Total                   $3,576
     ```
   - Disables the Buy button if `getItems()` is empty OR region not picked
   - Updates `shipNoteEl` with "+ $X shipping to Y" when both are set, else
     prompts "Select your shipping region"

3. Re-render on:
   - Region change (`regionSelectEl.addEventListener('change', render)`)
   - A public `.refresh()` method the page calls after variant changes

4. Reuse the existing `populateRegionSelect()` from `js/checkout.js` — pass
   the page's `category` so the dropdown shows the per-category rate.
   Important nuance: when there are multiple items with different freight
   categories (e.g. a bath + a chiller), the dropdown preview will show the
   bath rate only — that's the right number because of the bundle rule
   (`BUNDLE_RULE = 'bath_only'`) in `shipping.js`. No special handling needed.

5. Buy button handler: POST `{ items: getItems(), region, success_url,
   cancel_url }` to `/api/create-checkout`, redirect to returned URL,
   handle errors by re-enabling the button and showing a message inline
   (not `alert()` — use a `<p>` near the button styled with the existing
   error pattern from contact.html or the Formspree form).

**Style guidance:** the summary panel should match the existing "order
panel" visual on each product page. Use the existing CSS tokens
(`--surface`, `--border`, `--ice` / `--ember`). Numbers right-aligned in a
two-column grid. The total line should be larger and use the page's accent
color.

---

## Phase 3 — Wire up the ice bath page

**File:** `product-page/ice-bath-nz.html`

This page has the most variants: size (4ft / 5ft) × chiller (none / std /
premium). Currently it has 6 pre-baked Stripe Payment Link buttons.

Steps:

1. **Find the existing order panel section** (look for the price display,
   highlights, current "Buy Now" buttons). Keep the highlights and product
   info; replace the price + 6 buttons block with:
   - The existing size selector (4ft / 5ft)
   - The existing chiller selector (None / Standard / Premium)
   - **NEW:** Region dropdown (`<select id="ship-region">`)
   - **NEW:** Live summary panel (`<div id="order-summary">`)
   - **NEW:** Single Buy button (`<button id="buy-button" type="button">Reserve Yours</button>`)
   - **NEW:** Error display (`<p id="buy-error" hidden>`)

2. Remove the JS that flips the price display per variant — the summary
   panel handles all price display now.

3. Add at the bottom of the page, before `</body>`:
   ```html
   <script type="module">
     import { setupConfigurator } from '/js/configurator.js';

     // Adapt these two readers to whatever attribute/class your existing
     // selectors use to mark the active variant. Look for the existing
     // size + chiller toggle JS already in the file.
     const getSize    = () => document.querySelector('.size-option.is-active')?.dataset.size    || '4ft';
     const getChiller = () => document.querySelector('.chiller-option.is-active')?.dataset.chiller || 'none';

     // Map current state → array of SKUs
     function getItems() {
       const items = [getSize() === '5ft' ? 'ice_bath_5ft' : 'ice_bath_4ft'];
       const ch = getChiller();
       if (ch === 'standard') items.push('chiller_standard');
       if (ch === 'premium')  items.push('chiller_premium');
       return items;
     }

     const config = setupConfigurator({
       summaryEl:      document.getElementById('order-summary'),
       buyButton:      document.getElementById('buy-button'),
       regionSelectEl: document.getElementById('ship-region'),
       shipNoteEl:     document.getElementById('ship-note'),
       category:       'ice_bath',
       productPath:    '/product-page/ice-bath-nz',
       getItems,
     });

     // Re-render whenever a variant changes
     document.querySelectorAll('.size-option, .chiller-option')
       .forEach(el => el.addEventListener('click', () => config.refresh()));
   </script>
   ```

4. **Important:** don't double-bind. The existing variant click handlers
   probably already toggle the `.is-active` class; only add the
   `config.refresh()` listener on top. If the existing handler uses
   `e.preventDefault()`, that's fine — the new listener fires after.

5. Test states to verify manually:
   - 4ft + No Chiller + Auckland → $784 + $80 = $864
   - 5ft + Standard Chiller + Christchurch → $888 + $2,712 + $200 = $3,800
   - 4ft + Premium Chiller + Invercargill → $784 + $3,299 + $230 = $4,313
   - No region picked → Buy button disabled, summary still shows subtotal

---

## Phase 4 — Wire up the chiller page

**File:** `product-page/ice-bath-chiller.html`

Two variants: Standard / Premium. Optional add-on: an ice bath (give the
customer the cross-sell — they can add a 4ft or 5ft bath).

1. Same structural changes as Phase 3 — replace the static price + Buy
   buttons with: variant selector + region dropdown + summary + single Buy
   button.

2. **Add a cross-sell:** below the chiller variant selector, add a small
   "Add an Ice Bath?" section with three options: "No bath", "+ 4ft Ice Bath
   ($784)", "+ 5ft Ice Bath ($888)". Match the existing visual style of
   other selectors on this page.

3. Script:
   ```html
   <script type="module">
     import { setupConfigurator } from '/js/configurator.js';

     const getVariant = () =>
       document.querySelector('.variant-option.is-active')?.dataset.variant || 'standard';
     const getBathAddon = () =>
       document.querySelector('.bath-addon.is-active')?.dataset.bath || 'none';

     function getItems() {
       const items = [getVariant() === 'premium' ? 'chiller_premium' : 'chiller_standard'];
       const bath = getBathAddon();
       if (bath === '4ft') items.unshift('ice_bath_4ft');
       if (bath === '5ft') items.unshift('ice_bath_5ft');
       return items;
     }

     const config = setupConfigurator({
       summaryEl:      document.getElementById('order-summary'),
       buyButton:      document.getElementById('buy-button'),
       regionSelectEl: document.getElementById('ship-region'),
       shipNoteEl:     document.getElementById('ship-note'),
       // When a bath is added, freight category should be 'ice_bath' (bath
       // is the largest item, drives the freight). When chiller-only,
       // 'chiller'. Compute dynamically:
       category:       'chiller', // initial — will be overridden if bath added; see below
       productPath:    '/product-page/ice-bath-chiller',
       getItems,
     });

     document.querySelectorAll('.variant-option, .bath-addon')
       .forEach(el => el.addEventListener('click', () => config.refresh()));
   </script>
   ```

4. **Subtle freight category issue:** the dropdown's price-per-region
   preview is set at page load based on `category`. On this page, that
   category changes when a bath is added. The cleanest fix is to update
   `setupConfigurator` to recompute the dropdown when items change —
   when there's at least one `ice_bath` item, repopulate with `'ice_bath'`
   rates; otherwise `'chiller'` rates. Implement this in
   `js/configurator.js` (Phase 2 should already account for this — see the
   note below).

   **Add to Phase 2:** in the `render()` function, after computing items,
   determine the dominant freight category (priority: ice_bath > sauna >
   chiller > accessory). If it differs from the last-rendered category,
   call `populateRegionSelect(regionSelectEl, dominantCategory)` again,
   preserving the currently-selected value. This keeps the dropdown's
   per-region prices accurate as the cart changes.

5. Test states:
   - Standard, no bath, Auckland → $2,712 + $80 = $2,792
   - Premium, no bath, Wellington → $3,299 + $100 = $3,399
   - Standard + 4ft bath, Christchurch → $2,712 + $784 + $200 (bath rate) = $3,696

---

## Phase 5 — Wire up the sauna page

**File:** `product-page/barrel-sauna.html`

Two variants: Barrel / Square. No cross-sell for now (saunas tend to be
standalone purchases — customer can return for a bath separately).

1. Same structural change as Phase 3.

2. Script:
   ```html
   <script type="module">
     import { setupConfigurator } from '/js/configurator.js';

     const getVariant = () =>
       document.querySelector('.sauna-option.is-active')?.dataset.sauna || 'barrel';

     function getItems() {
       return [getVariant() === 'square' ? 'sauna_square' : 'sauna_barrel'];
     }

     const config = setupConfigurator({
       summaryEl:      document.getElementById('order-summary'),
       buyButton:      document.getElementById('buy-button'),
       regionSelectEl: document.getElementById('ship-region'),
       shipNoteEl:     document.getElementById('ship-note'),
       category:       'sauna',
       productPath:    '/product-page/barrel-sauna',
       getItems,
     });

     document.querySelectorAll('.sauna-option')
       .forEach(el => el.addEventListener('click', () => config.refresh()));
   </script>
   ```

3. Test states:
   - Barrel, Auckland → $9,899 + $100 = $9,999
   - Square, Invercargill → $9,999 + $350 = $10,349

---

## Phase 6 — Smoke test the full flow

Set `STRIPE_SECRET_KEY` to a **test key** (`sk_test_...`) in Vercel before
testing. Then for each product page:

1. Visit the page in a fresh browser tab
2. Pick variants — verify the summary updates instantly
3. Pick a region — verify shipping line appears and total updates
4. Click Buy Now — verify Stripe Checkout opens with:
   - One line item per product (not a bundled mystery line)
   - Shipping line shows the correct city + amount
   - Total matches what the page showed
5. Use test card `4242 4242 4242 4242`, any future expiry, any CVC
6. Verify the test payment in Stripe Dashboard shows correct line items +
   metadata `items=...` and `region=...`

If all 3 pages pass, swap `sk_test_...` for `sk_live_...` and redeploy.

---

## Phase 7 — Update progress.md

Add a Session 15 entry documenting:
- API now accepts multi-item carts
- New `js/configurator.js` module with live order summary
- All 3 product pages converted to dynamic cart pattern
- Bundle discount removed (totals are pure sums)
- Chiller page now offers ice bath cross-sell
- Old static Stripe Payment Links can be archived

---

## What NOT to change

- `js/shipping.js` — leave the catalog, rates, and helpers alone
- `js/checkout.js` — `populateRegionSelect()` and `goToCheckout()` are
  reused; only the new `setupCheckout()` wrapper there is now superseded
  by `setupConfigurator()` (you can delete `setupCheckout()` from
  `checkout.js` once the configurator works)
- The product page hero, specs, testimonials, image carousels — only the
  order panel section changes
- The homepage, buy-now.html, benefits, about, faq, contact — no changes
  needed (the homepage Buy Now buttons just link to product pages, which
  is correct)

---

## Edge cases worth handling

- **Empty cart** — shouldn't be possible on these pages (every page has
  one mandatory product), but the API + UI should reject it gracefully
- **Region change after items selected** — summary should re-render
- **User opens checkout in new tab, comes back, changes variant** — fine,
  the new variant just reflects in a fresh checkout if they buy again
- **Network error on POST to /api/create-checkout** — show inline error,
  re-enable Buy button (already specced in Phase 2)

---

## File deliverables checklist

When done:

- [ ] `api/create-checkout.js` — modified to accept `items` array
- [ ] `js/configurator.js` — NEW
- [ ] `product-page/ice-bath-nz.html` — order panel rebuilt + script added
- [ ] `product-page/ice-bath-chiller.html` — order panel rebuilt + cross-sell + script added
- [ ] `product-page/barrel-sauna.html` — order panel rebuilt + script added
- [ ] `progress.md` — Session 15 entry added
- [ ] `js/checkout.js` — old `setupCheckout()` removed (optional cleanup)

Good luck.
