// =============================================================================
// The Ice Bath NZ — Shipping & Product Catalog
// =============================================================================
// Single source of truth for:
//   • Mainfreight depot shipping rates
//   • Product catalog (prices in NZD cents)
//   • Bundle SKUs (bath + chiller combos)
//
// Loaded by:
//   • /api/create-checkout.js  (server — Stripe Checkout Session)
//   • /js/cart-ui.js           (browser — cart drawer shipping calc)
//
// To change a price or add a region, edit here and redeploy.
// =============================================================================

// ---------------------------------------------------------------------------
// SHIPPING RATES — NZD, per Mainfreight depot
// ---------------------------------------------------------------------------
// Columns: ice_bath, chiller (surplus), sauna (NI=349, SI=449).
// Accessories: ACCESSORY_SOLO_RATE.
// Source: The_Ice_Bath_-_Shipping_Pricing.xlsx (Timaru ice_bath corrected $22→$220)
export const SHIPPING_RATES = {
  // ── North Island — sauna 349 ────────────────────────────────────────────
  AUCKLAND:           { ice_bath:  80, chiller:  80, sauna: 349 },
  HAMILTON:           { ice_bath: 150, chiller:  90, sauna: 349 },
  TAURANGA:           { ice_bath: 150, chiller:  90, sauna: 349 },
  THAMES:             { ice_bath: 160, chiller:  95, sauna: 349 },
  WHANGAREI:          { ice_bath: 160, chiller:  95, sauna: 349 },
  TAUPO:              { ice_bath: 160, chiller:  95, sauna: 349 },
  ROTORUA:            { ice_bath: 165, chiller: 100, sauna: 349 },
  NAPIER:             { ice_bath: 165, chiller: 100, sauna: 349 },
  'NEW PLYMOUTH':     { ice_bath: 165, chiller: 100, sauna: 349 },
  KAITAIA:            { ice_bath: 170, chiller: 100, sauna: 349 },
  GISBORNE:           { ice_bath: 170, chiller: 100, sauna: 349 },
  WANGANUI:           { ice_bath: 170, chiller: 100, sauna: 349 },
  'PALMERSTON NORTH': { ice_bath: 170, chiller: 100, sauna: 349 },
  LEVIN:              { ice_bath: 170, chiller: 100, sauna: 349 },
  WELLINGTON:         { ice_bath: 170, chiller: 100, sauna: 349 },
  // ── South Island — sauna 449 ────────────────────────────────────────────
  NELSON:             { ice_bath: 220, chiller: 130, sauna: 449 },
  BLENHEIM:           { ice_bath: 210, chiller: 130, sauna: 449 },
  CHRISTCHURCH:       { ice_bath: 200, chiller: 120, sauna: 449 },
  GREYMOUTH:          { ice_bath: 230, chiller: 130, sauna: 449 },
  TIMARU:             { ice_bath: 220, chiller: 130, sauna: 449 },
  OAMARU:             { ice_bath: 220, chiller: 130, sauna: 449 },
  DUNEDIN:            { ice_bath: 225, chiller: 130, sauna: 449 },
  CROMWELL:           { ice_bath: 240, chiller: 140, sauna: 449 },
  GORE:               { ice_bath: 240, chiller: 140, sauna: 449 },
  INVERCARGILL:       { ice_bath: 230, chiller: 140, sauna: 449 },
};

// Region display order in the dropdown (north → south).
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
// ACCESSORY SOLO RATE — flat per-accessory, region-independent
// ---------------------------------------------------------------------------
// Accessories ride free with any bath or chiller. Solo-only cart pays this.
export const ACCESSORY_SOLO_RATE = 20;

// ---------------------------------------------------------------------------
// PRODUCT CATALOG
// ---------------------------------------------------------------------------
// `amount` is in NZD cents. `ship` is the freight category.
export const PRODUCTS = {
  ice_bath_4ft:     { name: 'Ice Bath 4ft',                      amount:   78400, ship: 'ice_bath',  tags: ['cold', 'indoor', 'outdoor'] },
  ice_bath_5ft:     { name: 'Ice Bath 5ft',                      amount:   88800, ship: 'ice_bath',  tags: ['cold', 'indoor', 'outdoor'] },
  chiller_standard: { name: 'Ice Bath Chiller',                  amount:  239900, ship: 'chiller',   tags: ['cold', 'indoor', 'outdoor'] },
  chiller_premium:  { name: 'Premium Ice Bath Chiller',          amount:  329900, ship: 'chiller',   tags: ['cold', 'indoor', 'outdoor'] },
  sauna_barrel_2p:  { name: 'Barrel Sauna (2 Person)',           amount:  750000, ship: 'sauna',     tags: ['heat', 'outdoor'] },
  sauna_barrel:     { name: 'Barrel Sauna (4 Person)',           amount:  989900, ship: 'sauna',     tags: ['heat', 'outdoor'] },
  sauna_barrel_6p:  { name: 'Barrel Sauna (6 Person)',           amount: 1189900, ship: 'sauna',     tags: ['heat', 'outdoor'] },
  sauna_square:     { name: 'Square Sauna',                      amount:  999900, ship: 'sauna',     tags: ['heat', 'outdoor'] },
  ice_bath_cover:   { name: 'Ice Bath Cover',                    amount:   19900, ship: 'accessory', tags: ['accessory', 'cold', 'indoor', 'outdoor'] },
  hose_attachment:  { name: 'Hose Attachment',                   amount:    7900, ship: 'accessory', tags: ['accessory', 'cold', 'outdoor'] },
  allinone_bath:    { name: 'All-in-One Ice Bath & Chiller',     amount: 1089900, ship: 'ice_bath',  tags: ['cold', 'indoor'] },
  steel_bath_304:   { name: 'Stainless Steel Ice Bath (304)',    amount:  384900, ship: 'ice_bath',  tags: ['cold', 'indoor', 'outdoor'] },
  steel_bath_316:   { name: 'Stainless Steel Ice Bath (316)',    amount:  439900, ship: 'ice_bath',  tags: ['cold', 'indoor', 'outdoor'] },
  // ── Indoor Saunas — Infrared ───────────────────────────────────────────
  aurora_2p:        { name: 'Aurora 2P Infrared Sauna',          amount:  474900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  aurora_3p:        { name: 'Aurora 3P Infrared Sauna',          amount:  574900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  aurora_4p:        { name: 'Aurora 4P Infrared Sauna',          amount:  684900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  solara_2p:        { name: 'Solara 2P Infrared Sauna',          amount:  444900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  solara_3p:        { name: 'Solara 3P Infrared Sauna',          amount:  544900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  // ── Indoor Saunas — Traditional ────────────────────────────────────────
  tampere_small:    { name: 'Tampere Sauna (1-2 Person)',        amount:  834900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  tampere_large:    { name: 'Tampere Sauna (3-4 Person)',        amount:  934900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  lahti_2p:         { name: 'Lahti Sauna (2 Person)',            amount:  804900, ship: 'sauna',     tags: ['heat', 'indoor'] },
  lahti_3p:         { name: 'Lahti Sauna (3 Person)',            amount:  904900, ship: 'sauna',     tags: ['heat', 'indoor'] },
};

// ---------------------------------------------------------------------------
// BUNDLE SKUs
// ---------------------------------------------------------------------------
export const BUNDLES = {
  bath_4ft_std:  { items: ['ice_bath_4ft', 'chiller_standard'] },
  bath_5ft_std:  { items: ['ice_bath_5ft', 'chiller_standard'] },
  bath_4ft_prem: { items: ['ice_bath_4ft', 'chiller_premium']  },
  bath_5ft_prem: { items: ['ice_bath_5ft', 'chiller_premium']  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

// Resolve a SKU (product or bundle) to its constituent product IDs.
export function resolveSkuToItems(sku) {
  if (BUNDLES[sku]) return BUNDLES[sku].items;
  if (PRODUCTS[sku]) return [sku];
  throw new Error(`Unknown SKU: ${sku}`);
}

// Convert "PALMERSTON NORTH" → "Palmerston North" (for Stripe checkout label).
export function prettyCity(region) {
  return region.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// FREIGHT CONSOLIDATION FACTORS
// ---------------------------------------------------------------------------
// Per-additional-unit freight factor.
// 0.5 = each extra unit at half rate (2 = 1.5×, 3 = 2×, …)
// 1   = no discount (N × rate), i.e. current behaviour
export const FREIGHT_FACTOR = { ice_bath: 0.5, chiller: 1, sauna: 1 };

// Freight for N like units to one region. First unit full rate, each
// additional unit at `factor` of the rate. Rounded to a whole dollar so the
// displayed total matches the Stripe charge.
function unitsFreight(n, rate, factor) {
  return n <= 0 ? 0 : Math.round(rate * (1 + (n - 1) * factor));
}

// ---------------------------------------------------------------------------
// CALCULATE SHIPPING
// ---------------------------------------------------------------------------
// productIds: flat array with bundles AND quantities already expanded
//             (e.g. 2× ice_bath_4ft → ['ice_bath_4ft', 'ice_bath_4ft'])
// region:     depot key — required if cart has a bath, chiller, or sauna
export function calculateShipping(productIds, region) {
  const cats = productIds.map(id => PRODUCTS[id].ship);
  const baths       = cats.filter(c => c === 'ice_bath').length;
  const chillers    = cats.filter(c => c === 'chiller').length;
  const saunas      = cats.filter(c => c === 'sauna').length;
  const accessories = cats.filter(c => c === 'accessory').length;

  let total = 0;

  // Region-rated: baths, surplus chillers, AND saunas all use the depot.
  if (baths > 0 || chillers > 0 || saunas > 0) {
    const rates = SHIPPING_RATES[region];
    if (!rates) throw new Error(`Unknown region: ${region}`);
    total += unitsFreight(baths,  rates.ice_bath, FREIGHT_FACTOR.ice_bath);
    total += unitsFreight(saunas, rates.sauna,    FREIGHT_FACTOR.sauna);
    total += Math.max(0, chillers - baths) * rates.chiller;
  }

  // Accessories: free alongside any bath/chiller, else $20 each. (Unchanged.)
  if (baths === 0 && chillers === 0) {
    total += accessories * ACCESSORY_SOLO_RATE;
  }

  return total;
}
