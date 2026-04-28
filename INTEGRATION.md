# Integration Guide — Variable Shipping for Buy Buttons

This guide shows the exact edits needed to wire each of the three product
pages to the new `/api/create-checkout` endpoint.

The pattern is the same on every page:

1. **Add a region dropdown** above (or near) the Buy Now button.
2. **Replace the Stripe Payment Link `href`** on the Buy Now button with a
   plain button that JS will hijack.
3. **Add a `<script type="module">` block** at the bottom of the file that
   wires variant state → SKU → checkout.

---

## File checklist before you start

Confirm these new files exist in your repo (created in this session):

```
package.json                 ← new (adds stripe dep + type:module)
api/create-checkout.js       ← new (serverless function)
js/shipping.js               ← new (shipping data + helpers)
js/checkout.js               ← new (frontend setup)
```

Also confirm `STRIPE_SECRET_KEY` is set in Vercel — see `STRIPE_SETUP.md`.

---

## Reusable HTML snippet (region picker)

You'll paste a variation of this onto each product page, inside the order
panel, just above the existing Buy Now button. Style it to match the rest of
the page using your existing tokens (`--surface`, `--border`, `--ice` /
`--ember` for accents).

```html
<div class="shipping-region">
  <label for="ship-region">Shipping Region</label>
  <select id="ship-region" required>
    <!-- populated by JS -->
  </select>
  <p id="ship-note" class="shipping-note"></p>
</div>
```

Suggested CSS (drop into the page's existing `<style>` block):

```css
.shipping-region {
  margin: 1.25rem 0;
}
.shipping-region label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  margin-bottom: 0.5rem;
}
.shipping-region select {
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
}
.shipping-region select:focus {
  outline: none;
  border-color: var(--ice); /* swap to --ember on the sauna page */
}
.shipping-note {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.6);
  min-height: 1.25em; /* prevents layout shift when populated */
}
```

---

## Buy button change (all 3 pages)

**Find:**

```html
<a class="..." href="https://buy.stripe.com/XXXXXXXX">Buy Now</a>
```

**Replace with:**

```html
<button class="..." id="buy-button" type="button">Buy Now</button>
```

Keep all the same classes — only the tag and href→id change. There may be
multiple Stripe links per page (one per variant); replace **all of them**
with a single `<button id="buy-button">` since variant logic now happens in
JS.

---

## Page 1 — `product-page/ice-bath-nz.html`

This page has 6 variants: size (4ft / 5ft) × chiller option (none / standard
/ premium). The page already tracks current size + chiller selection in JS
(per progress.md). We just map that state to a SKU.

Add this before `</body>`:

```html
<script type="module">
  import { setupCheckout } from '/js/checkout.js';

  // Map (size, chiller) → SKU. Replace the lookup with however your page
  // currently exposes selected state — these names are placeholders.
  const SKU_MAP = {
    '4ft|none':     'ice_bath_4ft',
    '5ft|none':     'ice_bath_5ft',
    '4ft|standard': 'bath_4ft_std',
    '5ft|standard': 'bath_5ft_std',
    '4ft|premium':  'bath_4ft_prem',
    '5ft|premium':  'bath_5ft_prem',
  };

  // ⬇️ EDIT THESE TWO LINES so they read your page's current selectors.
  // Look for the existing JS that already tracks size + chiller. The
  // function should return one of: '4ft' | '5ft' AND 'none' | 'standard' | 'premium'.
  const getSize    = () => document.querySelector('.size-option.is-active')?.dataset.size    || '4ft';
  const getChiller = () => document.querySelector('.chiller-option.is-active')?.dataset.chiller || 'none';

  const checkout = setupCheckout({
    selectEl:    document.getElementById('ship-region'),
    buyButton:   document.getElementById('buy-button'),
    category:    'ice_bath', // bundle rule means chiller ships free with bath
    getSku:      () => SKU_MAP[`${getSize()}|${getChiller()}`],
    productPath: '/product-page/ice-bath-nz',
    priceNoteEl: document.getElementById('ship-note'),
  });

  // Refresh the price note whenever the variant changes. Hook into your
  // existing variant-change handlers.
  document.querySelectorAll('.size-option, .chiller-option')
    .forEach(el => el.addEventListener('click', () => checkout.refresh()));
</script>
```

> **Note** — the `category: 'ice_bath'` is intentional even when a chiller
> is bundled. Because `BUNDLE_RULE = 'bath_only'` in `js/shipping.js`, the
> chiller rides for free with the bath, so the bath rate is the right
> figure to show. If you flip the rule to `'sum'`, change the price-note
> logic too.

---

## Page 2 — `product-page/ice-bath-chiller.html`

Two variants: Standard / Premium.

Add this before `</body>`:

```html
<script type="module">
  import { setupCheckout } from '/js/checkout.js';

  // ⬇️ EDIT to match your page's variant selector.
  const getVariant = () =>
    document.querySelector('.variant-option.is-active')?.dataset.variant || 'standard';

  const SKU_MAP = {
    standard: 'chiller_standard',
    premium:  'chiller_premium',
  };

  const checkout = setupCheckout({
    selectEl:    document.getElementById('ship-region'),
    buyButton:   document.getElementById('buy-button'),
    category:    'chiller',
    getSku:      () => SKU_MAP[getVariant()],
    productPath: '/product-page/ice-bath-chiller',
    priceNoteEl: document.getElementById('ship-note'),
  });

  document.querySelectorAll('.variant-option')
    .forEach(el => el.addEventListener('click', () => checkout.refresh()));
</script>
```

---

## Page 3 — `product-page/barrel-sauna.html`

Two variants: Barrel / Square.

Add this before `</body>`:

```html
<script type="module">
  import { setupCheckout } from '/js/checkout.js';

  // ⬇️ EDIT to match your page's variant selector.
  const getVariant = () =>
    document.querySelector('.sauna-option.is-active')?.dataset.sauna || 'barrel';

  const SKU_MAP = {
    barrel: 'sauna_barrel',
    square: 'sauna_square',
  };

  const checkout = setupCheckout({
    selectEl:    document.getElementById('ship-region'),
    buyButton:   document.getElementById('buy-button'),
    category:    'sauna',
    getSku:      () => SKU_MAP[getVariant()],
    productPath: '/product-page/barrel-sauna',
    priceNoteEl: document.getElementById('ship-note'),
  });

  document.querySelectorAll('.sauna-option')
    .forEach(el => el.addEventListener('click', () => checkout.refresh()));
</script>
```

---

## What to do with the old Stripe Payment Links

You **don't need to delete them**. They keep working as-is. Once the new
flow is live and tested:

1. Take a test purchase through one product page (use Stripe test mode key
   first — see `STRIPE_SETUP.md`).
2. If something breaks, you can paste the old Payment Link `href` back onto
   one button as a quick fallback.
3. Once happy in production, archive the old Payment Links from the Stripe
   dashboard so they don't get used by mistake.

---

## Updating prices later

All prices live in **one file**: `js/shipping.js`.

- Shipping rates: `SHIPPING_RATES` block
- Product prices: `PRODUCTS` block (in NZD cents — 78400 = $784.00)
- Bundle composition: `BUNDLES` block

Edit, commit, push — Vercel redeploys, prices update everywhere.
