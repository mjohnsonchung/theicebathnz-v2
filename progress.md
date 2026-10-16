# Project Progress — The Ice Bath NZ (v2)

Last updated: 2026-10-16 (session 59)

---

## Product Photos Workflow (`product-photos/`)

The `product-photos/` folder is the **single source of truth** for which images are currently live on the site. It has 18 subfolders (one per product) with clearly named files.

### Naming Convention
- `PRODUCT NAME CATALOG.webp` — buy-now / category page card image
- `PRODUCT NAME HERO.webp` — product page hero background (desktop)
- `PRODUCT NAME HERO MOBILE.webp` — product page hero background (mobile, if separate)
- `PRODUCT NAME CAROUSEL PIC1.webp`, `PIC2`, `PIC3`… — specs carousel images in order

### How to Update Photos
1. **Client uploads** new photo(s) to the relevant subfolder with `NEW` suffix (e.g. `TAMPERE SAUNA HERO NEW.png`)
2. **Claude session** picks up the new files and:
   - Converts to WebP (quality 82 via sharp)
   - Updates the product page HTML `src` paths if needed (e.g. adding/removing carousel slides)
   - Replaces the old photo in `product-photos/` with the new WebP (same clean name, no "NEW" suffix)
   - Deletes the source PNG from `product-photos/`
3. **Rule: `product-photos/` only contains current, live images.** Old/replaced photos are deleted, not kept. No "NEW", "old", "v2" suffixes should remain after processing.

### Products with Mobile Hero Images
All products now have separate `HERO MOBILE` files in `product-photos/`. HTML product pages use `<picture>` elements with `<source media="(max-width: 768px)">` for mobile heroes, or CSS `background-image` media queries for Solara 2P/3P and Stainless Steel.

### Image Path Convention (as of session 46)
All product page HTML files now reference images via `../product-photos/[Folder]/[FILENAME].webp` — the old scattered `brand assets/` paths have been fully migrated.

---

## Key Decisions

### URL Structure
- Kept old site's `/product-page/[slug]` pattern — product pages live in `product-page/` subfolder
- `vercel.json` uses `cleanUrls: true` so `.html` extensions are stripped from live URLs
- Renamed `science.html` → `benefits.html` to match old site's `/benefits` URL
- All old product slugs redirect to new canonical slugs via `vercel.json` redirects

### Products
- **Ice Bath** → `product-page/ice-bath-nz.html` — 4ft ($784) and 5ft ($888) on one page with JS size selector (product renamed from "Ice Bath NZ" to "Ice Bath")
- **Ice Bath Chiller** → `product-page/ice-bath-chiller.html` — standard chiller only, NZ$2,599 (variant toggle removed session 43)
- **Premium Ice Bath Chiller** → `product-page/premium-chiller.html` — standalone premium page, NZ$3,299, WiFi + 7" LCD (split from chiller page session 43)
- **Stainless Steel Ice Bath** → `product-page/stainless-steel-ice-bath.html` — 304/316 grade selector
- **All-in-One Ice Bath** → `product-page/all-in-one-ice-bath.html` — single SKU NZ$10,899
- **Barrel Sauna** → `product-page/barrel-sauna.html` — 2P/4P/6P size selector; cedar, 6kW heater; from NZ$7,500
- **Square Sauna** → `product-page/square-sauna.html` — single SKU NZ$9,999; Thermo Hemlock, 6kW, LED, stadium seating
- **Outdoor Sauna (category)** → `product-page/outdoor-sauna.html` — lightweight category page linking to barrel, square, vesta 2P + 4P
- **Indoor Sauna (category)** → `product-page/indoor-sauna.html` — category page linking to 7 indoor saunas
- **Aurora 2P Infrared** → `product-page/aurora-2p-infrared-sauna.html` — single SKU ~~$6,349~~ $4,749; Canadian Hemlock, 1750W
- **Aurora 3P Infrared** → `product-page/aurora-3p-infrared-sauna.html` — single SKU ~~$7,449~~ $5,749; Wi-Fi control, 2100W
- **Aurora 4P Infrared** → `product-page/aurora-4p-infrared-sauna.html` — single SKU ~~$8,849~~ $6,849; Wi-Fi control, 2300W
- **Solara 2P Infrared** → `product-page/solara-2p-infrared-sauna.html` — single SKU ~~$5,949~~ $4,449; carbon panels, 1800W
- **Solara 3P Infrared** → `product-page/solara-3p-infrared-sauna.html` — single SKU ~~$7,149~~ $5,449; carbon panels, 2150W
- **Tampere Traditional** → `product-page/tampere-sauna.html` — size selector: 1-2P ($8,349) / 3-4P ($9,349); Canadian Hemlock, 4.5kW/6kW
- **Lahti Traditional** → `product-page/lahti-sauna.html` — size selector: 2P ($8,049) / 3P ($9,049); Japanese Cedar, corner glass
- **Hose Attachment** → `product-page/hose-attachment.html` — accessory NZ$79
- **Ice Bath Cover** → `product-page/ice-bath-cover.html` — accessory NZ$199
- **Vesta 2P Outdoor Infrared** → `product-page/vesta-2p-outdoor-sauna.html` — single SKU ~~$11,349~~ $8,439; aluminium exterior, full-spectrum heaters, optional Low EMF upgrade (+$649)
- **Vesta 4P Outdoor Infrared** → `product-page/vesta-4p-outdoor-sauna.html` — single SKU ~~$12,849~~ $9,539; aluminium exterior, full-spectrum heaters, optional Low EMF upgrade (+$649)
- **Warranty** → `warranty.html` — warranty terms for saunas (2-year structural, 1-year electrical) and ice baths (1-year), styled as legal page

### Design System
- Typography: **Cormorant Garamond** (display/serif) + **Jost** (body/sans)
- Base palette: `--void: #020B15`, `--deep: #060E1A`, `--surface: #0A1828`, `--elevated: #0D2040`, `--border: rgba(255,255,255,0.07)`
- Ice bath accent: `--ice: #5BC8F5` (blue)
- Sauna accent: `--ember: #E8832A` (amber) — product-specific, not global brand
- All product pages share the same nav/footer/token structure; only accent colors differ

### Git / Deployment
- GitHub repo: `mjohnsonchung/theicebathnz-v2`
- Vercel connected and deployed ✓
- Vercel publishes `master` straight to the live site (theicebathnz.co.nz). Every other pushed branch gets its own preview link, so changes go on a branch, Matt checks the preview, then merges (from session 58)
- `.vercelignore` keeps `*.md` notes and `*.mjs` dev scripts off the live site (session 58)
- `.gitignore` excludes: `temporary screenshots/`, `*.psd`, `node_modules/`, `.DS_Store`, `Thumbs.db`

---

## File Map

```
/
├── index.html              — Homepage
├── buy-now.html            — Product catalog (/buy-now)
├── benefits.html           — Science/benefits page (was science.html)
├── about-us.html, contact.html, faq.html
├── warranty.html           — Warranty page (sauna 2yr structural/1yr electrical, ice bath 1yr)
├── privacy-policy.html, terms-of-service.html, cookie-policy.html
├── api/
│   └── create-checkout.js  — Vercel function: creates Stripe Checkout Sessions
├── js/
│   ├── shipping.js         — rates, products, bundles, calculateShipping (single source of truth for prices)
│   ├── cart.js             — localStorage cart state (getLines, addItem, setQty, etc.)
│   └── cart-ui.js          — cart drawer + nav badge + region selector + checkout
├── product-page/           — 20 product and category pages (see Products above)
├── product-photos/         — live product images, one folder per product (see Product Photos Workflow)
├── Customer Photos/        — customer photos used on the homepage
├── brand assets/           — logo, favicon, homepage and older product images
│   └── Client Logos/       — white "Trusted by" logos on the homepage (session 59)
├── package.json            — stripe dependency, ESM module type (needed by the api/ function)
├── vercel.json             — redirects + clean URLs
├── .vercelignore           — keeps *.md and *.mjs off the live site
├── sitemap.xml, robots.txt
├── serve.mjs               — local dev server (port 3000)
├── screenshot.mjs, mobile-screenshot.mjs, screenshot-section.mjs — Puppeteer screenshots (Matt's PC)
├── clip-values.mjs         — dev helper
├── CLAUDE.md               — rules for Claude sessions
├── progress.md             — this file; progress-archive.md holds finished work
├── STRIPE_SETUP.md         — env var + deploy steps
└── CLAUDE_CODE_BRIEF.md    — brief for the cart checkout build
```

---

## Current State

### Completed
Finished work from sessions 1–57 is in [progress-archive.md](progress-archive.md). Read it only when you need the history of a change.

- [x] **Session 58 (2026-10-16): notes cleanup.** Moved the finished-work list to `progress-archive.md`. Added `.vercelignore` so notes (`*.md`) and dev scripts (`*.mjs`) are no longer published on the live site; before this, `/progress.md`, `/CLAUDE.md`, `/STRIPE_SETUP.md` and `/CLAUDE_CODE_BRIEF.md` were publicly readable. Refreshed the file map. Added cloud-session notes to `CLAUDE.md`.

- [x] **Session 59 (2026-10-16): "Trusted by" logo band on the homepage.** The client's ask, via Matt: logos of commercial brands the client has sold to, shown in one tone (grey, white or black) rather than their own colours. Eight logos (Blues, Sports Physio Lab, M2 Training Club, BFT, Sauna Collective, O-Studio, The Wellness Club, WI) were converted from the client's JPEGs to white-on-transparent WebPs in `brand assets/Client Logos/`, and sit in a new band under the trust bar at 66% opacity. Each logo's display width is set by eye with an inline `--w` so they carry similar visual weight; 8 per row on desktop, 4 under 1100px, 3 under 768px. WI's full name isn't known, so its alt text is "WI".

### Pending
- [ ] Configure GA4 tag inside GTM (Measurement ID `G-MF5374TSTP`, timezone Auckland, currency NZD)
- [ ] Add Meta Pixel tag inside GTM (client to provide Pixel ID from their Business Manager)
- [ ] Publish GTM container and verify tags fire (Tag Assistant, GA4 Realtime, Meta Pixel Helper)
- [ ] Verify sitemap.xml is submitted in Search Console

---

## Prices
Found in shipping.js (Single Source of Truth)     |
