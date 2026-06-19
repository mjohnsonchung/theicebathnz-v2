// =============================================================================
// /api/create-checkout — Stripe Checkout Session
// =============================================================================
// POST endpoint. Accepts:
//   {
//     items:       [{ sku, qty }]  — or legacy string[] (each qty=1)
//     region:      string          — Mainfreight depot key (required if bath/chiller in cart)
//     saunaFreight: string         — SAUNA_FREIGHT key (required if sauna in cart)
//     success_url: string
//     cancel_url:  string
//   }
//
// Required env var (Vercel dashboard → Settings → Environment Variables):
//   STRIPE_SECRET_KEY  — sk_live_… or sk_test_…
// =============================================================================

import Stripe from 'stripe';
import {
  PRODUCTS,
  SAUNA_FREIGHT,
  SHIPPING_RATES,
  resolveSkuToItems,
  calculateShipping,
  prettyCity,
} from '../js/shipping.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured (missing STRIPE_SECRET_KEY)' });
  }

  try {
    const { items, region, saunaFreight, success_url, cancel_url } = req.body || {};

    // ── Validate items ──────────────────────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }
    if (!success_url || !cancel_url) {
      return res.status(400).json({ error: 'Missing success_url or cancel_url' });
    }

    // Normalise: accept both [{ sku, qty }] and legacy ['sku1', 'sku2']
    const normalisedItems = items.map(item => {
      if (typeof item === 'string') return { sku: item, qty: 1 };
      if (item && typeof item.sku === 'string' && typeof item.qty === 'number') return item;
      throw new Error(`Invalid item shape: ${JSON.stringify(item)}`);
    });

    // ── Expand SKUs to product IDs (flat, with quantities) ──────────────────
    let productIds;
    try {
      productIds = normalisedItems.flatMap(({ sku, qty }) => {
        const ids = resolveSkuToItems(sku);
        const result = [];
        for (let i = 0; i < qty; i++) result.push(...ids);
        return result;
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // ── Determine what's in the cart ────────────────────────────────────────
    const cats = productIds.map(id => PRODUCTS[id]?.ship);
    const hasBathOrChiller = cats.includes('ice_bath') || cats.includes('chiller');
    const hasSauna         = cats.includes('sauna');

    // ── Conditional validation ──────────────────────────────────────────────
    if (hasBathOrChiller) {
      if (!region) {
        return res.status(400).json({ error: 'region is required for bath/chiller orders' });
      }
      if (!SHIPPING_RATES[region]) {
        return res.status(400).json({ error: `Unknown shipping region: ${region}` });
      }
    }
    if (hasSauna) {
      if (!saunaFreight || !SAUNA_FREIGHT[saunaFreight]) {
        return res.status(400).json({
          error: `saunaFreight is required for sauna orders. Valid options: ${Object.keys(SAUNA_FREIGHT).join(', ')}`,
        });
      }
    }

    // ── Build Stripe line items (aggregate by product ID) ───────────────────
    const counts = {};
    for (const id of productIds) {
      counts[id] = (counts[id] || 0) + 1;
    }

    const line_items = Object.entries(counts).map(([id, qty]) => {
      const p = PRODUCTS[id];
      return {
        price_data: {
          currency: 'nzd',
          product_data: { name: p.name },
          unit_amount: p.amount, // already in cents
        },
        quantity: qty,
      };
    });

    // ── Calculate shipping ──────────────────────────────────────────────────
    const shippingNZD = calculateShipping(productIds, region || null, saunaFreight || null);

    // Determine display name for the shipping line
    let shippingDisplayName = 'Shipping';
    if (hasBathOrChiller && region) {
      shippingDisplayName = prettyCity(region);
      if (hasSauna && saunaFreight) {
        shippingDisplayName += ` + ${SAUNA_FREIGHT[saunaFreight].label}`;
      }
    } else if (hasSauna && saunaFreight) {
      shippingDisplayName = SAUNA_FREIGHT[saunaFreight].label;
    }

    // ── Create Stripe Checkout Session ──────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['NZ'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingNZD * 100, currency: 'nzd' },
          display_name: shippingDisplayName,
        },
      }],
      metadata: {
        items: normalisedItems.map(i => `${i.sku}x${i.qty}`).join(','),
        region:         region         || '',
        saunaFreight:   saunaFreight   || '',
        shipping_nzd:   String(shippingNZD),
      },
      success_url,
      cancel_url,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout]', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
