// =============================================================================
// The Ice Bath NZ — Shipping & Product Catalog
// =============================================================================
// Single source of truth for:
//   • Mainfreight depot shipping rates
//   • Product catalog (prices in NZD cents)
//   • Bundle SKUs (bath + chiller combos)
//   • Bundle-shipping rule
//
// This file is loaded by both:
//   • /api/create-checkout.js  (server, creates Stripe Checkout Session)
//   • Product pages            (browser, populates the region dropdown)
//
// To change a price or add a region, edit here and redeploy.
// =============================================================================

// ---------------------------------------------------------------------------
// SHIPPING RATES — NZD, per Mainfreight depot
// ---------------------------------------------------------------------------
// Source: The_Ice_Bath_-_Shipping_Pricing.xlsx (Timaru ice-bath rate corrected
// from $22 → $220, presumed typo in source).
// 4ft and 5ft ice baths share the same freight rate, so a single `ice_bath`
// column covers both.
export const SHIPPING_RATES = {
  // ── North Island ────────────────────────────────────────────────────────
  AUCKLAND:           { ice_bath:  80, chiller:  80, sauna: 100, accessory: 20 },
  HAMILTON:           { ice_bath: 150, chiller:  90, sauna: 100, accessory: 20 },
  TAURANGA:           { ice_bath: 150, chiller:  90, sauna: 150, accessory: 20 },
  THAMES:             { ice_bath: 160, chiller:  95, sauna: 300, accessory: 20 },
  WHANGAREI:          { ice_bath: 160, chiller:  95, sauna: 300, accessory: 20 },
  TAUPO:              { ice_bath: 160, chiller:  95, sauna: 300, accessory: 20 },
  ROTORUA:            { ice_bath: 165, chiller: 100, sauna: 300, accessory: 20 },
  NAPIER:             { ice_bath: 165, chiller: 100, sauna: 300, accessory: 20 },
  'NEW PLYMOUTH':     { ice_bath: 165, chiller: 100, sauna: 300, accessory: 20 },
  KAITAIA:            { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  GISBORNE:           { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  WANGANUI:           { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  'PALMERSTON NORTH': { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  LEVIN:              { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  WELLINGTON:         { ice_bath: 170, chiller: 100, sauna: 300, accessory: 20 },
  // ── South Island ────────────────────────────────────────────────────────
  CHRISTCHURCH:       { ice_bath: 200, chiller: 120, sauna: 350, accessory: 20 },
  BLENHEIM:           { ice_bath: 210, chiller: 130, sauna: 350, accessory: 20 },
  NELSON:             { ice_bath: 220, chiller: 130, sauna: 350, accessory: 20 },
  TIMARU:             { ice_bath: 220, chiller: 130, sauna: 350, accessory: 20 },
  OAMARU:             { ice_bath: 220, chiller: 130, sauna: 350, accessory: 20 },
  DUNEDIN:            { ice_bath: 225, chiller: 130, sauna: 350, accessory: 20 },
  GREYMOUTH:          { ice_bath: 230, chiller: 130, sauna: 350, accessory: 20 },
  INVERCARGILL:       { ice_bath: 230, chiller: 140, sauna: 350, accessory: 20 },
  CROMWELL:           { ice_bath: 240, chiller: 140, sauna: 350, accessory: 20 },
  GORE:               { ice_bath: 240, chiller: 140, sauna: 350, accessory: 20 },
};

// Region display order in the dropdown (north → south, then alphabetical).
// Customers scan vertically; geographic order makes scanning faster than
// alphabetical-only.
export const REGION_ORDER = [
  // North Island
  'KAITAIA', 'WHANGAREI', 'AUCKLAND', 'THAMES', 'HAMILTON', 'TAURANGA',
  'ROTORUA', 'TAUPO', 'GISBORNE', 'NAPIER', 'NEW PLYMOUTH', 'WANGANUI',
  'PALMERSTON NORTH', 'LEVIN', 'WELLINGTON',
  // South Island
  'NELSON', 'BLENHEIM', 'CHRISTCHURCH', 'GREYMOUTH', 'TIMARU', 'OAMARU',
  'DUNEDIN', 'CROMWELL', 'GORE', 'INVERCARGILL',
];

// ---------------------------------------------------------------------------
// PRODUCT CATALOG
// ---------------------------------------------------------------------------
// `amount` is in NZD cents (Stripe's required minor-unit format).
// `ship` is the freight category used to look up rates above.
export const PRODUCTS = {
  ice_bath_4ft:     { name: 'Ice Bath 4ft',             amount:  78400, ship: 'ice_bath' },
  ice_bath_5ft:     { name: 'Ice Bath 5ft',             amount:  88800, ship: 'ice_bath' },
  chiller_standard: { name: 'Ice Bath Chiller',         amount: 239900, ship: 'chiller'  },
  chiller_premium:  { name: 'Premium Ice Bath Chiller', amount: 329900, ship: 'chiller'  },
  sauna_barrel:     { name: 'Barrel Sauna',             amount: 989900, ship: 'sauna'    },
  sauna_square:     { name: 'Square Sauna',             amount: 999900, ship: 'sauna'    },
};

// ---------------------------------------------------------------------------
// BUNDLE SKUs
// ---------------------------------------------------------------------------
// A bundle is a single front-end SKU that maps to multiple line items at
// checkout. Line item totals match the bundle prices in progress.md.
export const BUNDLES = {
  bath_4ft_std:  { items: ['ice_bath_4ft', 'chiller_standard'] }, // $3,479
  bath_5ft_std:  { items: ['ice_bath_5ft', 'chiller_standard'] }, // $3,609
  bath_4ft_prem: { items: ['ice_bath_4ft', 'chiller_premium']  }, // $4,379
  bath_5ft_prem: { items: ['ice_bath_5ft', 'chiller_premium']  }, // $4,509
};

// ---------------------------------------------------------------------------
// BUNDLE SHIPPING RULE
// ---------------------------------------------------------------------------
// When a bath + chiller bundle ships, the chiller fits inside the bath and
// goes as a single freight job. So we charge the bath rate only.
//
// If your freight provider quotes you separately for bundles, switch this to
// 'sum' and both rates will be added.
//   'bath_only' — charge ice-bath rate (chiller rides for free) ← recommended
//   'sum'       — charge ice-bath + chiller rates
export const BUNDLE_RULE = 'bath_only';

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

// Resolve a SKU (product or bundle) to its constituent product IDs.
export function resolveSkuToItems(sku) {
  if (BUNDLES[sku]) return BUNDLES[sku].items;
  if (PRODUCTS[sku]) return [sku];
  throw new Error(`Unknown SKU: ${sku}`);
}

// Calculate shipping cost in NZD (whole dollars) for a list of product IDs
// shipping to a given region.
export function calculateShipping(productIds, region) {
  const rates = SHIPPING_RATES[region];
  if (!rates) throw new Error(`Unknown region: ${region}`);

  const cats = productIds.map(id => PRODUCTS[id].ship);
  const hasBath    = cats.includes('ice_bath');
  const hasChiller = cats.includes('chiller');

  // Bath + chiller bundle — apply rule
  if (hasBath && hasChiller && BUNDLE_RULE === 'bath_only') {
    const accessoryTotal = cats
      .filter(c => c === 'accessory')
      .reduce((s, c) => s + rates[c], 0);
    return rates.ice_bath + accessoryTotal;
  }

  // Default: sum each item's category rate
  return cats.reduce((sum, c) => sum + rates[c], 0);
}

// Convert "PALMERSTON NORTH" → "Palmerston North" (for Stripe checkout label).
export function prettyCity(region) {
  return region.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Calculate shipping for a SKU directly (convenience for the frontend).
export function shippingForSku(sku, region) {
  return calculateShipping(resolveSkuToItems(sku), region);
}
