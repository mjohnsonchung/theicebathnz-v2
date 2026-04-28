# Session 14 — Variable Shipping (paste into progress.md)

Add to the **Completed** section of progress.md:

```markdown
- [x] Variable shipping by Mainfreight depot — replaces static Stripe Payment Links with dynamic Checkout Sessions (session 14)
  - New `/api/create-checkout.js` Vercel serverless function
  - New `/js/shipping.js` — single source of truth for 25 depot rates + product catalog + bundle SKUs
  - New `/js/checkout.js` — frontend helpers: `populateRegionSelect()`, `goToCheckout()`, `setupCheckout()`
  - New `package.json` — adds `stripe` dep and `type:module`
  - All 3 product pages now have a "Shipping Region" <select> above Buy Now (North Island / South Island optgroups, prices shown next to each city)
  - Bundle rule: bath + chiller ships at bath rate only (chiller rides for free) — toggle via `BUNDLE_RULE` const
  - Timaru ice-bath rate corrected $22 → $220 (typo in source spreadsheet)
  - Stripe Checkout shipping line shows the city name (e.g. "Auckland", "Palmerston North")
  - Setup: `STRIPE_SECRET_KEY` env var added in Vercel; see STRIPE_SETUP.md
  - Old Stripe Payment Links retained (not deleted) until live testing complete
```

Also update the file map at the top of progress.md to include the new files:

```
/
├── package.json            — NEW: stripe dep, ESM module type
├── api/
│   └── create-checkout.js  — NEW: Stripe Checkout Session endpoint
├── js/
│   ├── shipping.js         — NEW: rates, products, bundles (single source of truth)
│   └── checkout.js         — NEW: frontend dropdown + buy button helpers
├── INTEGRATION.md          — NEW: per-page wiring instructions
├── STRIPE_SETUP.md         — NEW: env var + deploy steps
└── (everything else as before)
```
