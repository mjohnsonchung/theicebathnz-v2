// =============================================================================
// /api/create-checkout
// =============================================================================
// POST endpoint. Accepts { sku, region, success_url, cancel_url } and returns
// a Stripe Checkout Session URL with the correct line items + shipping rate
// for the customer's selected Mainfreight region.
//
// Replaces the old static Stripe Payment Links: each Buy button on the site
// now POSTs here, gets a one-time checkout URL, and redirects.
//
// Required env var (set in Vercel dashboard → Settings → Environment Variables):
//   STRIPE_SECRET_KEY  — your Stripe live or test secret key (sk_live_… / sk_test_…)
// =============================================================================

import Stripe from 'stripe';
import {
  PRODUCTS,
  resolveSkuToItems,
  calculateShipping,
  prettyCity,
  SHIPPING_RATES,
} from '../js/shipping.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Allow POST only. Same-origin requests from the site, so no CORS needed.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured (missing STRIPE_SECRET_KEY)' });
  }

  try {
    const { sku, region, success_url, cancel_url } = req.body || {};

    if (!sku || !region || !success_url || !cancel_url) {
      return res.status(400).json({ error: 'Missing required field (sku, region, success_url, cancel_url)' });
    }

    // Resolve SKU to one or more line items (handles both single products and bundles)
    let productIds;
    try {
      productIds = resolveSkuToItems(sku);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (!SHIPPING_RATES[region]) {
      return res.status(400).json({ error: `Unknown shipping region: ${region}` });
    }

    // Build Stripe line items from the product catalog
    const line_items = productIds.map(id => {
      const p = PRODUCTS[id];
      return {
        price_data: {
          currency: 'nzd',
          product_data: { name: p.name },
          unit_amount: p.amount, // already in cents
        },
        quantity: 1,
      };
    });

    // Calculate shipping (NZD whole dollars) → convert to cents for Stripe
    const shippingNZD = calculateShipping(productIds, region);
    const cityLabel = prettyCity(region);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['NZ'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingNZD * 100, currency: 'nzd' },
          display_name: cityLabel, // e.g. "Auckland", "Palmerston North"
        },
      }],
      // Track which SKU and region for fulfilment reports
      metadata: { sku, region, shipping_nzd: String(shippingNZD) },
      success_url,
      cancel_url,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout]', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
