# Stripe + Vercel Setup

One-time setup for the new variable-shipping checkout flow.

---

## 1. Add the Stripe secret key to Vercel

You need your **Stripe secret key** (starts with `sk_live_` for production
or `sk_test_` for testing). Find it at:

> https://dashboard.stripe.com/apikeys

In Vercel:

1. Open the project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** your `sk_live_...` (or `sk_test_...` while testing)
   - **Environments:** check Production, Preview, and Development
3. **Save**, then go to **Deployments** and click **Redeploy** on the
   latest deployment so the env var takes effect.

> ⚠️ **Never** commit the secret key to GitHub. The serverless function
> reads it from `process.env.STRIPE_SECRET_KEY` at runtime.

---

## 2. Install the Stripe Node library

The new `package.json` already lists `stripe` as a dependency. Vercel runs
`npm install` automatically on every deploy, so just commit and push:

```bash
git add package.json api/ js/ INTEGRATION.md STRIPE_SETUP.md
git commit -m "Add variable shipping via Stripe Checkout Session API"
git push
```

If you want to test locally first:

```bash
npm install
```

---

## 3. Test it end-to-end

**With a test key (`sk_test_...`):**

1. Set `STRIPE_SECRET_KEY` to your test key in Vercel.
2. Redeploy.
3. Visit a product page, pick a region, click Buy Now.
4. On the Stripe Checkout page, use test card `4242 4242 4242 4242`,
   any future expiry, any 3-digit CVC, any postcode.
5. Confirm:
   - Subtotal is correct
   - Shipping line shows the right city name and amount
   - Total = subtotal + shipping
6. Check the resulting test payment in your Stripe Dashboard — the
   shipping address you entered should be visible.

**Switch to live:** swap `sk_test_...` for `sk_live_...` in Vercel and
redeploy.

---

## 4. (Optional) Local development

The existing `serve.mjs` is a pure static-file server, so it can't run the
serverless function. For local testing of the API, use Vercel's CLI:

```bash
npm i -g vercel
vercel dev
```

This runs both the static site **and** the `/api/` functions on
`http://localhost:3000`. You'll need a `.env.local` file:

```
STRIPE_SECRET_KEY=sk_test_...
```

(Add `.env.local` to `.gitignore` — it should not be committed.)

---

## 5. What the customer sees

1. Product page → picks variant (size / model) → picks Shipping Region
2. Inline price note updates: e.g. *"+ $80 shipping to Auckland"*
3. Clicks Buy Now → button shows "Redirecting…" briefly
4. Stripe Checkout opens with:
   - Line items (product, or bundle as 2 line items)
   - **Shipping** line: e.g. "Auckland — $80.00"
   - Total
5. Customer enters card + shipping address (NZ-only) and pays
6. Stripe redirects to `/?success=true&session_id=...`

---

## 6. What's stored on each Stripe payment

The serverless function attaches metadata to every Checkout Session:

```json
{
  "sku": "bath_4ft_prem",
  "region": "CHRISTCHURCH",
  "shipping_nzd": "200"
}
```

Useful for fulfilment — pull it from any payment in the Stripe Dashboard
or via the API to know exactly what's being shipped where.

---

## Troubleshooting

| Symptom                                          | Fix                                                       |
|--------------------------------------------------|-----------------------------------------------------------|
| 500 error: "Stripe not configured"               | `STRIPE_SECRET_KEY` env var not set in Vercel — see step 1 |
| 400 error: "Unknown SKU"                         | Check `SKU_MAP` on the product page matches `js/shipping.js` |
| 400 error: "Unknown shipping region"             | Region string mismatch — must match keys in `SHIPPING_RATES` exactly (uppercase) |
| Buy button stuck on "Redirecting…"               | Open browser DevTools → Network → look at `/api/create-checkout` response |
| Shipping shows $0.00 at Stripe checkout          | Region wasn't passed — check the dropdown has a value selected before submit |
