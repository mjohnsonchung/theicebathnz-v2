# Project Progress — The Ice Bath NZ (v2)

Last updated: 2026-07-12 (session 43)

---

## Key Decisions

### URL Structure
- Kept old site's `/product-page/[slug]` pattern — product pages live in `product-page/` subfolder
- `vercel.json` uses `cleanUrls: true` so `.html` extensions are stripped from live URLs
- Renamed `science.html` → `benefits.html` to match old site's `/benefits` URL
- All old product slugs redirect to new canonical slugs via `vercel.json` redirects

### Products
- **Ice Bath** → `product-page/ice-bath-nz.html` — 4ft ($784) and 5ft ($888) on one page with JS size selector (product renamed from "Ice Bath NZ" to "Ice Bath")
- **Ice Bath Chiller** → `product-page/ice-bath-chiller.html` — standard chiller only, NZ$2,399 (variant toggle removed session 43)
- **Premium Ice Bath Chiller** → `product-page/premium-chiller.html` — standalone premium page, NZ$3,299, WiFi + 7" LCD (split from chiller page session 43)
- **Stainless Steel Ice Bath** → `product-page/stainless-steel-ice-bath.html` — 304/316 grade selector
- **All-in-One Ice Bath** → `product-page/all-in-one-ice-bath.html` — single SKU NZ$10,899
- **Barrel Sauna** → `product-page/barrel-sauna.html` — 2P/4P/6P size selector; cedar, 6kW heater; from NZ$7,500
- **Square Sauna** → `product-page/square-sauna.html` — single SKU NZ$9,999; Thermo Hemlock, 6kW, LED, stadium seating
- **Outdoor Sauna (category)** → `product-page/outdoor-sauna.html` — lightweight category page linking to barrel + square
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

### Design System
- Typography: **Cormorant Garamond** (display/serif) + **Jost** (body/sans)
- Base palette: `--void: #020B15`, `--deep: #060E1A`, `--surface: #0A1828`, `--elevated: #0D2040`, `--border: rgba(255,255,255,0.07)`
- Ice bath accent: `--ice: #5BC8F5` (blue)
- Sauna accent: `--ember: #E8832A` (amber) — product-specific, not global brand
- All product pages share the same nav/footer/token structure; only accent colors differ

### Git / Deployment
- GitHub repo: `mjohnsonchung/theicebathnz-v2`
- Vercel connected and deployed ✓
- `.gitignore` excludes: `temporary screenshots/`, `*.psd`, `node_modules/`, `.DS_Store`, `Thumbs.db`

---

## File Map

```
/
├── index.html              — Homepage
├── package.json            — NEW: stripe dep, ESM module type
├── api/
│   └── create-checkout.js  — NEW: Stripe Checkout Session endpoint
├── js/
│   ├── shipping.js         — rates, products, bundles, calculateShipping (single source of truth)
│   ├── cart.js             — NEW: localStorage cart state (getLines, addItem, setQty, etc.)
│   └── cart-ui.js          — NEW: cart drawer + nav badge + region selector + checkout
├── INTEGRATION.md          — NEW: per-page wiring instructions
├── STRIPE_SETUP.md         — NEW: env var + deploy steps
├── buy-now.html            — Product catalog (/buy-now) — 3 product cards → product pages
├── benefits.html           — Science/benefits page (was science.html)
├── about-us.html
├── contact.html
├── faq.html
├── vercel.json             — Redirects + clean URLs
├── sitemap.xml             — XML sitemap (all 9 pages, domain: theicebathnz.co.nz)
├── .gitignore
├── serve.mjs               — Local dev server (port 3000, clean URL fallback added)
├── screenshot.mjs          — Puppeteer screenshot tool (1440×900)
├── mobile-screenshot.mjs   — Puppeteer mobile screenshot (390×844, iPhone viewport)
├── Image Reference Guide/  — Customer-facing folder with all 151 site images, labeled by location + README
├── brand assets/           — Logo, product images
│   └── Ice Bath/           — Reorganised; bath tub & chiller images moved here
└── product-page/
    ├── ice-bath-nz.html    — Ice Bath (4ft / 5ft size selector)
    ├── ice-bath-chiller.html — Standard Chiller (NZ$2,399, no variant toggle)
    ├── premium-chiller.html — Premium Chiller (NZ$3,299, WiFi + 7" LCD)
    ├── barrel-sauna.html   — Barrel Sauna (2P / 4P / 6P size selector)
    ├── square-sauna.html   — Square Sauna (single SKU)
    ├── outdoor-sauna.html  — Outdoor Saunas category page (links to barrel + square)
    ├── indoor-sauna.html   — Indoor Saunas category page (links to 7 indoor saunas)
    ├── aurora-2p-infrared-sauna.html — Aurora 2P Infrared Sauna ($4,749)
    ├── aurora-3p-infrared-sauna.html — Aurora 3P Infrared Sauna ($5,749)
    ├── aurora-4p-infrared-sauna.html — Aurora 4P Infrared Sauna ($6,849)
    ├── solara-2p-infrared-sauna.html — Solara 2P Infrared Sauna ($4,449)
    ├── solara-3p-infrared-sauna.html — Solara 3P Infrared Sauna ($5,449)
    ├── tampere-sauna.html  — Tampere Sauna (1-2P $8,349 / 3-4P $9,349)
    ├── lahti-sauna.html    — Lahti Sauna (2P $8,049 / 3P $9,049)
    ├── stainless-steel-ice-bath.html — Stainless Steel Ice Bath (304 / 316 selector)
    ├── all-in-one-ice-bath.html — All-in-One Ice Bath & Chiller
    ├── hose-attachment.html — Hose Attachment accessory
    └── ice-bath-cover.html — Ice Bath Cover accessory
```

---

## Current State

### Completed
- [x] File restructure — all pages in correct locations with correct slugs
- [x] `vercel.json` — all old URL redirects mapped
- [x] Ice bath page — 4ft/5ft size selector with animated price flip, dynamic specs
- [x] Sauna page — full build with amber accent theme, contrast therapy CTA
- [x] Git initialized + pushed to GitHub (`mjohnsonchung/theicebathnz-v2`)
- [x] Vercel connected and deployed
- [x] Chiller addon toggle → rebuilt as 3-option "Choose Setup" selector (No Chiller / + Chiller / + Premium Chiller) with live bundle pricing
- [x] Fixed all sauna related card prices ($449 → $9,899) on ice bath and chiller pages
- [x] Updated all homepage product card prices (Ice Bath from NZ$784, Chiller NZ$2,712, Sauna NZ$9,899)
- [x] Updated chiller page standalone price ($899 → $2,712)
- [x] Updated chiller related card on ice bath page ($899 → $2,712)
- [x] Added Chiller / Premium Chiller model selector to ice-bath-chiller.html (NZ$2,712 / NZ$3,612)
- [x] Fixed sauna page chiller related card price ($899 → $2,712)
- [x] Removed team section from about-us.html; added border-top to CTA for visual separation
- [x] Updated copyright year © 2026 → © 2021 across all 8 pages
- [x] Generated sitemap.xml with all 8 URLs
- [x] Fixed infinite redirect loop on barrel-sauna Vercel URL (self-referencing vercel.json rule removed)
- [x] Removed stale "Portable Pod" references from ice-bath-chiller.html related cards
- [x] Renamed all product-facing "Ice Bath NZ" → "Ice Bath" across homepage and chiller page (brand logo/footer retains "The Ice Bath NZ")
- [x] Chiller homepage card updated to show "from NZ$2,712"
- [x] Removed all "Frost Chiller" references from ice-bath-chiller.html — now consistently "Ice Bath Chiller"
- [x] Premium variant toggle now switches full page content: product name, tagline, price (NZ$3,299 sale / NZ$4,999 orig), highlights, features section, and specs grid
- [x] Premium Ice Bath Chiller content added: WiFi app control, 3–40°C range, 7" LCD, complete kit details, 1-year warranty
- [x] Square Sauna variant toggle added to barrel-sauna.html (Cedar Barrel / Square Sauna selector)
- [x] Square Sauna content: 8kW heater, Thermo Hemlock, two-tier stadium seating, LED lighting, bitumen roof, NZ$9,999
- [x] Real barrel sauna photos wired up (IMG_5375.jpg hero, IMG_5378.JPG specs)
- [x] Square Sauna photos wired up from brand assets/Square Sauna/
- [x] Fixed broken ice bath image paths — images are in brand assets/Ice Bath/ subfolder; updated across index.html, ice-bath-nz.html, ice-bath-chiller.html
- [x] Wired Stripe Payment Links into all 3 product pages — direct to checkout (no cart): 6 combos on ice-bath-nz (size × chiller), 2 variants on chiller page, 2 variants on sauna page

- [x] Replaced hello@theicebathnz.co.nz → info@theicebathnz.co.nz across all 8 files (10 occurrences)
- [x] Updated phone number to +64 212103737 on contact page
- [x] Wired up Formspree contact form (ID: xaqlbwrz, endpoint: formspree.io/f/xaqlbwrz) using @formspree/ajax CDN — field-level errors, aria-invalid styling, success state
- [x] Homepage heading: "serious cold" now has the italic/blue em styling (was "Ice Bath")
- [x] Homepage body copy updated: G90 galvanised steel, 4ft/5ft sizes, 3°C chiller spec (replaced 304-grade stainless)
- [x] Homepage spec tiles updated: Capacity 350–500L, Cools To 3°C, Motor 1HP, Steel G90 Galv.
- [x] ice-bath-nz.html: 5ft capacity corrected ~450L → ~500L (JS data + highlight text)
- [x] ice-bath-nz.html: chiller feature card temp updated "from 2°C to 35°C" → "down to 3°C"
- [x] ice-bath-chiller.html (standard): tagline, highlights, feature cards, and spec tiles all updated to match official spec sheet — 3°C min, 1HP motor, UV + particle filtration, -10°C outdoor rated, self-priming pump
- [x] about-us.html: all "304-grade stainless" references replaced with G90 galvanised steel (Purity value, story copy, story stat visual)
- [x] about-us.html CTA: removed stale "Arctic Steel Pro / Portable Pod" product names
- [x] ice-bath-nz.html: James K testimonial updated to real quote
- [x] index.html: homepage testimonials updated — real customer photos (James K, Gem R, Tom S from Customer Photos/), real review copy
- [x] Cart icon removed from nav on all 8 pages; no-cart decision confirmed — buy buttons will go direct to Stripe checkout
- [x] Homepage product card buttons changed from "Add to Cart" → "Buy Now"; stale cart JS (e.preventDefault) removed so card links navigate to product pages
- [x] Homepage copy updates: banner "Free Delivery NZ" → "Delivery Nation Wide", "2-Year Warranty" → "1–2-Year Warranty" (both instances); Best Seller tagline updated to Galv steel / reliable cooling copy; How It Works step 01 removes "portable pods" reference; step 03 removes app reference; CTA section delivery line updated; trust row labels updated to match
- [x] Homepage product card taglines updated: Ice Bath trimmed (removed "strong, stable, made to perform"), Chiller updated to 1.5hr/summer copy, Sauna updated to sauna-specific copy (removed portable pod copy)
- [x] ice-bath-nz.html: chiller info panel added — selecting +Chiller or +Premium reveals inline summary (key specs + "View full chiller specs →" link); hides on "No Chiller"
- [x] ice-bath-nz.html: all "free shipping" removed (price note, JS, order CTA sub, trust row → "NZ Delivery")
- [x] ice-bath-nz.html: warranty updated to 1-year throughout (highlights bullet, specs grid, trust row, order CTA sub)
- [x] ice-bath-chiller.html: all "free shipping" removed (price note, JS data for both variants, order CTA sub, trust row → "NZ Delivery")
- [x] ice-bath-chiller.html (standard): warranty updated to 1-year throughout (highlights bullet, static spec grid, trust row, order CTA sub, JS data)
- [x] ice-bath-chiller.html: both variants cool only to 3°C (no heating on either); all heating/40°C/warm references removed from premium variant — variant sub, tagline, highlights, featuresSub, feature card, spec
- [x] about-us.html: Founded year corrected 2024 → 2023; Precision value pill updated to "Cools to 3°C"; Origin story copy updated (removed "triple-wall insulation" line)

- [x] faq.html: replaced all placeholder FAQ content with real copy from old site; restructured into 2 tab groups — "Ice Bath & Chiller" (11 questions) and "Sauna" (6 questions); removed sidebar nav; tab switcher in hero
- [x] Pushed to GitHub (session 7)

- [x] buy-now.html: product catalog page built at `/buy-now` — slim page hero, 3 product cards (Ice Bath, Chiller, Sauna) each linking to their product page; real photos used for all 3 cards
- [x] Homepage "View All Products" button updated from dead `href="#"` → `buy-now.html`
- [x] vercel.json: removed stale `/buy-now → /` redirect (was overriding the new page); redirected `/category/all-products` → `/buy-now`
- [x] Pushed to GitHub (session 8)

- [x] ice-bath-chiller.html: Premium variant specs reduced to 4 cells — removed "Delivery 5–7 wks" and "Includes Full Kit" (session 10)
- [x] ice-bath-chiller.html: Standard Chiller specs reduced to 4 cells — removed "Outdoor Use -10°C" and "Pump Self-priming" (session 10)

- [x] Mobile polish pass — all 9 pages (session 9)
  - Reduced section padding to mobile-appropriate values (5rem / 4rem)
  - Nav padding: 2.5rem → 1.25rem on all pages
  - Footer legal links: flex-wrap added so they wrap on small screens
  - Fixed all `index.html#products` links → `buy-now.html` (mobile menus + CTAs)
  - benefits.html: hero stats flex-wrap, card paddings reduced, CTA stacks vertically
  - faq.html: tab buttons flex: 1 so they fill full width and don't clip
  - contact.html: submit button full-width on mobile
  - ice-bath-nz.html: chiller selector flex-wrap (2+1 layout at 390px)
  - serve.mjs: added clean URL fallback (tries path.html and path/index.html)
  - Created mobile-screenshot.mjs (390×844 iPhone viewport)
- [x] sitemap.xml updated: domain → theicebathnz.co.nz, added /buy-now, added lastmod dates (session 9)

- [x] Real product photos wired across all pages (session 10)
  - Standard Chiller `No bg standard chiller.png` → homepage card, buy-now card, chiller hero + JS standard variant
  - Premium Chiller `premium chiller (front no bg).png` → chiller page JS premium variant + specs toggle
  - Barrel Sauna `Main Hero no bg.png` → homepage card, buy-now card, sauna hero; interior shot for specs
  - Square Sauna `main hero no bg.png` → sauna page JS square variant; `Inside sauna wide angle.jpg` for specs
  - All remaining `placehold.co` product images replaced on index, buy-now, chiller page, sauna page
  - Related product cards on sauna + chiller pages now show real images
- [x] Favicon added to all 9 pages — `brand assets/Site Favicon/Minimalistic ice cube in blue.png` (session 10)
- [x] Favicon cropped — removed ~26% transparent padding so icon fills frame; all 9 pages updated to `favicon-cropped.png` (session 11)
- [x] buy-now.html expanded from 3 → 5 product cards (session 10)
  - Chiller split into: Ice Bath Chiller (NZ$2,712) + Premium Chiller (NZ$3,299)
  - Sauna split into: Barrel Sauna (NZ$9,899) + Square Sauna (NZ$9,999)
  - Both chiller cards link to `ice-bath-chiller.html`; both sauna cards link to `barrel-sauna.html`
  - Layout: 3-col grid — row 1: Ice Bath, Std Chiller, Premium Chiller; row 2: Barrel Sauna, Square Sauna

- [x] Homepage "Why cold changes everything" section: new ice close-up photo (brand assets/Homepage/why the cold change everything photo.jfif) (session 12)
- [x] Homepage "Engineered for serious cold" feature section: new outdoor/glacial photo (brand assets/Homepage/Engineered for serious cold section.jfif) (session 12)
- [x] ice-bath-nz.html specs section: replaced single image with 3-photo click-only carousel (for the specs section.avif / 2 / 3) — prev/next buttons + dot indicators (session 12)
- [x] ice-bath-chiller.html specs section: replaced old unedited chiller photo with new back-of-chiller photo (brand assets/Standard Chiller/photo of back of chiller.avif) (session 12)

- [x] Homepage benefits section: removed floating chiller sub-image, main photo only (session 12)
- [x] Homepage feature section spec cells updated: Steel Grade / Hot-Dipped / Outdoors / Warranty — removed ice-bath-centric cells (session 12)
- [x] Homepage feature section: "View Specs" button removed; "Shop Ice Bath" → "Shop Ice Baths" pointing to /buy-now (session 12)
- [x] Homepage hero: "The Science" ghost button updated from #science anchor → /benefits (session 12)

- [x] Image optimisation — all brand assets converted to WebP (quality 82); favicons re-optimised as PNG; AVIFs kept as-is (session 12)
  - 7.3MB → 1.6MB total (77% reduction); biggest wins: product hero PNGs (88–96% each)
  - 17 new optimised files added to brand assets/; 34 src/href references updated across all 9 HTML pages

- [x] faq.html: delivery FAQ updated — Mainfreight depot collection / $100 flat rate NI / South Island surcharge (session 13)
- [x] Chiller badge changed from "New Arrival" → "Top Seller" on index.html, buy-now.html, ice-bath-chiller.html (4 locations) (session 13)
- [x] Created privacy-policy.html, terms-of-service.html, cookie-policy.html — themed to match site, content ported from Wix (session 13)
- [x] Footer legal links updated on all 9 pages — old Wix absolute URLs replaced with local relative paths (session 13)
- [x] vercel.json: /cookies → /cookie-policy redirect added (session 13)
- [x] sitemap.xml: 3 new legal pages added (session 13)
- [x] Pushed to GitHub (session 13)

- [x] Variable shipping by Mainfreight depot — replaces static Stripe Payment Links with dynamic Checkout Sessions (session 14)
  - New `/api/create-checkout.js` Vercel serverless function
  - New `/js/shipping.js` — single source of truth for 25 depot rates + product catalog + bundle SKUs
  - New `/js/checkout.js` — frontend helpers: `populateRegionSelect()`, `goToCheckout()`, `setupCheckout()`
  - New `package.json` — adds `stripe` dep and `type:module`
  - All 3 product pages now have a "Shipping Region" `<select>` above Buy Now (North Island / South Island optgroups, prices shown next to each city)
  - Bundle rule: bath + chiller ships at bath rate only (chiller rides for free) — toggle via `BUNDLE_RULE` const
  - Timaru ice-bath rate corrected $22 → $220 (typo in source spreadsheet)
  - Stripe Checkout shipping line shows the city name (e.g. "Auckland", "Palmerston North")
  - Setup: `STRIPE_SECRET_KEY` env var added in Vercel; see STRIPE_SETUP.md
  - Old Stripe Payment Links retained (not deleted) until live testing complete

- [x] Shipping region picker moved into hero selector area on all 3 product pages (session 15)
  - Dropdown now sits directly after the variant/size/chiller toggle cards, before the price block
  - Restyled to match toggle aesthetic: same small-caps label, `--surface` bg, `0.75rem` border-radius, custom chevron arrow
  - Focus accent: `--ice` on ice bath & chiller pages, `--ember` on sauna page
  - Buy button (`#buy-button`) moved up to hero actions — select region and buy in one place
  - Order CTA section below simplified: duplicate form elements removed, replaced with "Configure & Buy Above" scroll-up link

- [x] `api/create-checkout.js` updated to accept `items` array instead of single `sku` — each SKU resolved via `resolveSkuToItems()` and flattened; full product list passed to `calculateShipping()`; metadata updated to `items: items.join(',')` (session 16)
- [x] `js/configurator.js` created — `setupConfigurator()` module with live order summary panel: line items, subtotal (multi-item only), shipping, total; dynamic freight category (dominant category repopulates dropdown when items change); buy button disabled until region selected; total shows subtotal+ until region picked; errors shown inline via `#buy-error`; returns `{ refresh() }` for variant change hooks (session 16)

- [x] Phase 3 complete — ice-bath-nz.html: price block replaced with `#order-summary`; old `setupCheckout` module replaced with `setupConfigurator`; `updatePrice()` simplified to keep only chiller hints + CTA label updates; `data-chiller="chiller"` correctly maps to `chiller_standard` SKU (session 17)
- [x] Phase 4 complete — ice-bath-chiller.html: price block replaced with `#order-summary`; "Add an Ice Bath?" cross-sell added (No Bath / +4ft / +5ft); `selectBathAddon()` handler added; `setupConfigurator` wired with dynamic `getItems()` — dominant freight category auto-switches to `ice_bath` when bath is added; `setupCheckout` module replaced (session 17)

- [x] Order summary reveal — `#order-summary` now hidden (height 0) until user selects a shipping region; on first selection, panel fades in with `cfgReveal` animation (matches hero cascade pattern) and gains `margin-bottom: 2rem` gap before the buy/contact buttons; implemented via `cfg-visible` class + `hasBeenRevealed` flag in `js/configurator.js` (session 18)
- [x] Phase 5 complete — barrel-sauna.html: static `.product-price-block` removed; `#order-summary` + `#buy-error` added; `setupCheckout` replaced with `setupConfigurator`; `.variant-option.active` / `data-variant` used as state reader; `.cfg-total` overridden to amber (`var(--ember)`) for sauna accent; stale price-update lines removed from `selectVariant()` (session 18)

- [x] Standard chiller price corrected NZ$2,712 → NZ$2,399 across all files: shipping.js (source of truth), ice-bath-chiller.html (variant hint, CTA, JS data), ice-bath-nz.html (related card, priceMatrix), buy-now.html, index.html, barrel-sauna.html related card (session 19)
- [x] ice-bath-nz.html chiller toggle hints changed to show price deltas: No Chiller = no price, + Chiller = +$2,399, + Premium = +$3,299 (removed full bundle price display); `updatePrice()` no longer overwrites the now-static hint spans (session 19)
- [x] "Free NZ Delivery" and "Free delivery across New Zealand" removed site-wide — replaced with "Delivery NZ Wide" / "Delivery across New Zealand" (barrel-sauna.html trust row, priceNote, ctaSub for both variants) (session 19)

- [x] SEO meta tags added to all 12 pages (session 20)
  - `<meta name="description">` — unique copy per page, ~155 chars, includes key specs/prices
  - `<link rel="canonical">` — absolute URLs (domain: theicebathnz.co.nz)
  - Open Graph: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
  - Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - Product pages use product hero images; info/legal pages use brand lifestyle shot
  - OG titles on product pages include price (e.g. "Ice Bath — From NZ$784 | The Ice Bath NZ")

- [x] barrel-sauna.html renamed to outdoor-sauna.html — all internal links, canonical, og:url, og:title, twitter:title, productPath updated; vercel.json adds permanent redirect /product-page/barrel-sauna → /product-page/outdoor-sauna; sitemap updated (session 21)
- [x] robots.txt created — allows all, disallows /api/, references sitemap (session 21)
- [x] Legal pages (privacy-policy, terms-of-service, cookie-policy) removed from sitemap.xml; noindex,nofollow added to all 3 (session 21)
- [x] benefits.html title fixed to match og:title: "The Science of Cold Therapy — The Ice Bath NZ" (session 21)
- [x] Footer nav inconsistency fixed: "Ice Bath NZ" changed to "Ice Bath" on about-us, benefits, contact, faq (session 21)
- [x] og:type changed "website" to "product" on all 3 product pages (session 21)
- NOTE: JSON-LD structured data not yet added anywhere — Product schema on product pages, FAQPage on faq, Organization/WebSite on homepage would unlock Google rich results; implement when ready

- [x] Google Analytics GA4 added to all 12 pages — Measurement ID G-MF5374TSTP inserted in `<head>` (session 22)

- [x] Shipping region dropdown: dollar costs removed from option labels — cities only ("Auckland", not "Auckland — $80"); shipping still calculated and shown in order summary + Stripe checkout (session 23)
- [x] Favicon replaced — new ice cube photo (`Theicebathfavicon.png`) optimised to 64×64px PNG, 5.5KB (down from 1.8MB); saved as `favicon-cropped-opt.png`; all 12 pages already referenced that filename (session 23)
- [x] Homepage og:image + twitter:image updated → `bath tub & chiller no bg.webp` (was Engineered-for-serious-cold photo) (session 23)

- [x] Accessory toggles added to ice-bath-nz.html and ice-bath-chiller.html (session 24)
  - Two new accessories: "Ice Bath Cover" (NZ$199, free shipping) and "Hose Attachment" (NZ$79, free shipping)
  - Appear as an "ACCESSORIES" selector section between the existing selectors and the shipping region picker
  - Checkbox-style behaviour — both can be selected simultaneously (independent toggle, unlike radio-style selectors)
  - Styling matches existing toggle cards exactly (`.chiller-option` / `.bath-addon` aesthetic)
  - Mobile responsive: wrap to 2-column at ≤768px
  - Both SKUs added to `js/shipping.js` PRODUCTS catalog; `accessory` shipping rates set to $0 (free shipping bundled with main product)
  - `getItems()` on both pages now includes any active accessory SKUs; order summary panel updates in real time

- [x] Accessory prices updated (session 25)
  - Ice Bath Cover: NZ$20 → NZ$199 (free shipping retained)
  - Hose Attachment: NZ$20 → NZ$79 (free shipping retained)
  - Updated in: `js/shipping.js` (cents: 2000→19900 / 2000→7900), price hints in `ice-bath-nz.html` and `ice-bath-chiller.html`

- [x] Phase 6: Stripe checkout flow smoke tested and confirmed on all 3 product pages (session 25)

- [x] Homepage og:image + twitter:image updated → `main pic v2.webp` (session 26)
- [x] Barrel Sauna 2/4/6 person size selector added to outdoor-sauna.html (session 26)
  - New sub-selector "Choose Size" appears under Barrel variant: 2 Person ($7,500), 4 Person ($9,899), 6 Person ($11,899)
  - `barrelSizePrices` lookup object + `activeBarrelSize` state; `selectBarrelSize()` updates CTA + triggers configurator refresh
  - `window._saunaCfg = config` pattern for cross-script access between module and non-module scripts
  - `js/shipping.js`: added `sauna_barrel_2p` (750000¢) and `sauna_barrel_6p` (1189900¢); renamed `sauna_barrel` → 'Barrel Sauna (4 Person)'
- [x] buy-now.html barrel sauna card updated: image → `main-photo.webp`, price → `from NZ$7,500` (session 26)
- [x] buy-now.html: image carousels added to all 5 product cards (session 26)
  - `.carousel-track` / `.carousel-slide` / `.carousel-btn` / `.carousel-dots` CSS classes added
  - `carouselMove()`, `carouselPrev()`, `carouselNext()`, `carouselDot()` JS helpers
  - Prev/next buttons use `e.stopPropagation()` to prevent link navigation
  - Image sets: Ice Bath (3 slides), Std Chiller (3), Premium Chiller (2), Barrel Sauna (3), Square Sauna (3)
- [x] Batch WebP conversion — ~30 new brand asset images converted at quality 82 (session 26)
  - Barrel Sauna: main-photo, lifestyle-night, lifestyle-pool, interior-bench, interior-heater
  - Standard Chiller: main-photo, img-6627, img-6644, img-6645, img-6652
  - Premium Chiller: main-photo, chiller-side
  - Ice Bath: review-pic, review-pic-1, review-pic-2
  - Hose attachment: main-photo, img-0597
  - Stainless Steel Ice Bath (NEW): main-photo, image-1/2/3/4, lifestyle-gym/2/3/4
  - All in one Ice Bath (New): main-photo, lifestyle-1/2
  - Square Sauna: lifestyle-1/2/3/4/5, great-pic
- [x] outdoor-sauna.html hero updated to `main-photo.webp`; specs image updated to `interior-heater.webp` (session 26)

- [x] ice-bath-nz.html photo updates (session 26)
  - Hero image: `bath tub & chiller no bg.webp` → `main pic v2.webp`
  - OG/Twitter meta images updated to match
  - Accessory thumbnail + lightbox added: hose_attachment toggle shows 68×68px thumbnail; clicking opens full-screen lightbox with ✕ close button
  - `.acc-thumb-wrap` CSS: max-height 0→90px transition on `.active` (reveal animation)
  - `.acc-lightbox` CSS: fixed overlay z-index 300, `openLightbox(src)` / `closeLightbox()` JS
  - Ice Bath Cover has no thumbnail (no photo available yet)
- [x] ice-bath-chiller.html photo updates (session 26)
  - Standard hero: `No bg standard chiller.webp` → `main-photo.webp` (both static src and variantData.chiller.imgSrc)
  - Standard specs: `photo of back of chiller.avif` → `img-6627.webp`; variantData specsImgSrc also updated
  - Premium hero: `premium chiller (front no bg).webp` → `main-photo.webp`
  - Premium specs: old unedited JPG → `chiller-side.webp`
  - OG/Twitter meta images updated to `main-photo.webp`
  - Same accessory thumbnail + lightbox added for hose_attachment

- [x] New product pages created — all 4 new products (session 27)
  - `product-page/stainless-steel-ice-bath.html` — 304/316 grade selector, chiller bundle, accessories, carousel (image-1, image-2, lifestyle-gym)
  - `product-page/all-in-one-ice-bath.html` — single SKU, no selectors, 3-slide carousel (main-photo, lifestyle-1/2)
  - `product-page/hose-attachment.html` — simple accessory page, 2-image carousel, related products section
  - `product-page/ice-bath-cover.html` — accessory page, no hero image, specs grid only, related products section
  - `js/shipping.js` updated with 3 new SKUs: `allinone_bath` (1089900¢), `steel_bath_304` (384900¢), `steel_bath_316` (439900¢)
- [x] buy-now.html: 4 new product cards added — Stainless Steel Ice Bath, All-in-One Ice Bath, Hose Attachment, Ice Bath Cover (session 27)
  - Grid now has 9 cards total (5 existing + 4 new)
  - Each new card has carousel (except Ice Bath Cover which shows a branded SVG placeholder)
  - New chips: "New" for Stainless Steel + All-in-One, "Accessory" for Hose + Cover
- [x] sitemap.xml: 4 new URLs added (stainless-steel-ice-bath, all-in-one-ice-bath, hose-attachment, ice-bath-cover), lastmod 2026-05-30 (session 27)
- [x] vercel.json: 6 new redirect aliases added for new pages (session 27)

- [x] buy-now.html product grid carousel image tweaks (session 28)
  - Ice Bath: removed no-bg hero from carousel; `for the specs section.webp` is now slide 1
  - Standard Chiller: removed no-bg main-photo; `img-6627.webp` is now slide 1
  - Stainless Steel: removed no-bg main-photo; `image-1.webp` is now slide 1
  - Hose Attachment: swapped order — `img-0597.webp` is now slide 1 (main-photo moved to slide 2)
  - All 4 cards reduced from 3 → 2 dots where applicable
- [x] outdoor-sauna.html: Square Sauna specs image fixed — `Inside sauna wide angle.webp` (missing file) → `lifestyle-2.webp` (session 28)

- [x] outdoor-sauna.html: variant selector (Choose Model / Choose Size) moved below product name + tagline to match ice-bath-nz.html layout (session 28)
- [x] outdoor-sauna.html: barrel sauna hero changed to no-bg version — `Main Hero no bg.webp` (both static src and variantData.barrel.imgSrc) (session 28)

- [x] "You might also need these" related cards — fixed all broken/placeholder images across all product pages (session 29)
  - `ice-bath-nz.html`: Chiller placehold.co → `Standard Chiller/main-photo.webp`; Sauna placehold.co → `Barrel Sauna/Main Hero no bg.webp`
  - `ice-bath-chiller.html`: Ice Bath `bath tub & chiller no bg.webp` (missing file) → `Ice Bath/for the specs section.webp`
  - `stainless-steel-ice-bath.html`: Chiller placehold.co → `Standard Chiller/main-photo.webp`; Sauna placehold.co → `Barrel Sauna/Main Hero no bg.webp`
  - `all-in-one-ice-bath.html`: Ice Bath `bath tub & chiller no bg.webp` (missing) → `Ice Bath/for the specs section.webp`
  - `outdoor-sauna.html`: Ice Bath `bath tub & chiller no bg.webp` (missing) → `Ice Bath/for the specs section.webp`; Chiller `No bg standard chiller.webp` (missing) → `Standard Chiller/main-photo.webp`
- [x] URL query param variant pre-selection (session 29)
  - `outdoor-sauna.html`: `?variant=square` or `?variant=barrel` auto-selects via IIFE at end of main script
  - `ice-bath-chiller.html`: `?variant=premium` or `?variant=chiller` auto-selects via IIFE
  - `buy-now.html`: Square Sauna card → `outdoor-sauna.html?variant=square`; Premium Chiller card → `ice-bath-chiller.html?variant=premium`

- [x] Specs-section photo carousels added to chiller + sauna pages (session 30)
  - `ice-bath-chiller.html`: Standard variant → 4-slide carousel (img-6627, img-6644, img-6645, img-6652); Premium variant → single image (chiller-side.webp only; hose photo removed — broken); variant switch auto-hides old carousel + resets to slide 0
  - `outdoor-sauna.html`: Barrel variant → 4-slide carousel (interior-heater, interior-bench, lifestyle-pool, lifestyle-night); Square variant → 4-slide carousel (lifestyle-2, great-pic, lifestyle-1, lifestyle-3); amber (#E8832A) dot accent matches sauna theme
  - Pages already with carousels (`ice-bath-nz.html`, `stainless-steel-ice-bath.html`, `all-in-one-ice-bath.html`) unchanged
  - `brand assets/Homepage/` folder committed to git (was untracked — `why the cold change everything photo.webp` + `Engineered for serious cold section.webp`)

- [x] Homepage broken images fixed + no-bg product photos applied (session 30)
  - Hero: `bath tub & chiller no bg.webp` (missing file) → `main pic v2.webp`
  - Ice Bath card: same missing file → `main pic v2.webp`
  - Chiller card: `No bg standard chiller.webp` (missing file) → `main-photo.webp`
  - Barrel Sauna card: `main-photo.webp` (had background) → `Main Hero no bg.webp`
  - OG/Twitter meta was already correct (`main pic v2.webp`) from session 26

- [x] Homepage hero replaced — `IMG_6632_edited.png` converted to `img-6632-edited.webp` (brand assets/Ice Bath/); scaled to 75% on desktop via `transform: scale(0.75)` anchored to bottom-right; mobile unchanged (session 31)
- [x] ice-bath-nz.html hero updated to `img-6632-edited.webp` (same photo as homepage hero) (session 31)

- [x] **Cart + Shipping Rework — full implementation (session 32)**
  - `js/shipping.js` rewritten: `chiller_standard.amount` fixed 271200 → 239900; `sauna` + `accessory` columns removed from `SHIPPING_RATES`; `BUNDLE_RULE` removed; new `ACCESSORY_SOLO_RATE = 20`; new `SAUNA_FREIGHT` constant (own_freight $0, pickup_akl $0, north_island $349, south_island $449); new `islandOf(region)` helper; `calculateShipping()` replaced with new logic (baths × rate; surplus chillers × chiller rate; accessories free alongside bath/chiller else $20 each; saunas × sauna freight cost)
  - `js/cart.js` created — localStorage-backed cart (`tibnz_cart_v1`); `{ sku, qty }` line shape; exports: `getLines`, `addItem`, `setQty`, `removeLine`, `clear`, `getCount`, `expandToProductIds`, `subscribe`; validates stored lines against catalog on load
  - `js/cart-ui.js` created — self-initialising module; injects cart icon + badge into `.nav-right` on every page; slide-in drawer from right with: line items + qty steppers + remove buttons; region dropdown (shown only if bath/chiller in cart); sauna freight selector (shown only if sauna in cart; auto-pre-selects NI/SI from region, user can override); live subtotal / shipping / total; checkout button disabled until required selections made; empty state with link to /buy-now; POSTs `{ items: [{ sku, qty }], region?, saunaFreight? }` to `/api/create-checkout`
  - All 7 product pages updated: `setupConfigurator` removed; per-page `#ship-region`, `#order-summary`, `#ship-note`, `.shipping-region` CSS removed; "Order Now" replaced with "Add to Cart" + "Buy Now" buttons (both add items and open the cart drawer); live hero price display added (updates with variant/accessory selection); pages now import `addItem` + `openDrawer` from the new modules
  - `api/create-checkout.js` updated: accepts `[{ sku, qty }]` (or legacy string array); selective validation (region only if bath/chiller, saunaFreight only if sauna); aggregates line items by product ID with correct `quantity`; updated metadata encoding `skuxqty` format; updated `display_name` logic
  - Stale files deleted: `api/js/` (duplicate shipping.js + checkout.js), `js/checkout.js`, `js/configurator.js`
  - `cart-ui.js` added to all non-product pages: `index.html`, `buy-now.html`, `about-us.html`, `benefits.html`, `contact.html`, `faq.html`
- [x] `cart-ui.js` render() selection-preservation bug fixed (session 32)
  - Root cause: `footer.innerHTML = ''` destroyed the DOM nodes, then code tried to read `.value` back from the now-empty footer via `footer.querySelector(...)` — always returned `''`
  - Fix: snapshot `prevRegion = regionSelect?.value` and `prevSauna = saunaSelect?.value` from the module-level vars (which still point to the old nodes) BEFORE clearing footer; use those snapshots to restore selections after rebuild
  - Result: region + sauna selections now survive re-renders triggered by qty changes; checkout button stays enabled correctly
- [x] Multi-bath freight consolidation added to `js/shipping.js` (session 32)
  - New `FREIGHT_FACTOR` export: `{ ice_bath: 0.5, chiller: 1, sauna: 1 }` — extensible per-category factor
  - New `unitsFreight(n, rate, factor)` helper: first unit full rate, each additional at `factor` × rate, rounded to whole dollar
  - `calculateShipping()` updated: `baths * rates.ice_bath` → `unitsFreight(baths, rates.ice_bath, FREIGHT_FACTOR.ice_bath)`
  - Chiller nesting logic unchanged; accessories and saunas unchanged
  - Result: 2 baths = 1.5× rate (e.g. Christchurch $400 → $300); 3 baths = 2×; odd rates round (Rotorua 2 baths = $248)

- [x] **Sauna shipping simplified — uses depot region instead of separate selector (session 33)**
  - `js/shipping.js`: `SHIPPING_RATES` gains `sauna` column (NI depots = $349, SI depots = $449); `SAUNA_FREIGHT` constant, `islandOf()` helper, `SI_START`/`NORTH_ISLAND` consts all deleted; `calculateShipping()` signature drops `saunaFreightKey` — saunas now use `unitsFreight(saunas, rates.sauna, FREIGHT_FACTOR.sauna)` from the depot table; per-sauna pricing (no consolidation): 2 saunas = 2× rate
  - `js/cart-ui.js`: `SAUNA_FREIGHT`/`islandOf` imports removed; `saunaSelect` variable + `buildSaunaSelect()` function deleted; `needsRegion` now includes `hasSauna` (region dropdown appears for sauna-only carts); sauna freight selector DOM block removed entirely; shipping compute simplified to 2-arg `calculateShipping(expandedIds, region)`; `canCheckout` drops `saunaReady`; `handleCheckout()` no longer sends `saunaFreight` in payload
  - `api/create-checkout.js`: `SAUNA_FREIGHT` import removed; `saunaFreight` removed from request body destructuring; unified `needsRegion` validation covers bath/chiller/sauna; `calculateShipping()` called with 2 args; display name simplified to `prettyCity(region)`; `saunaFreight` removed from Stripe metadata

- [x] **Sauna page split + buy-now category navigation (session 34)**
  - `js/shipping.js`: `tags` array added to all 13 products — `['cold']`, `['heat','outdoor']`, `['accessory','cold']` — used for buy-now filter tabs
  - `product-page/barrel-sauna.html` **created**: extracted barrel-only content from outdoor-sauna.html; 2P/4P/6P size sub-selector; SEO: "Barrel Sauna — From NZ$7,500 | TIBNZ"; cart integration via `addItem`/`openDrawer`; related products: Square Sauna + Ice Bath
  - `product-page/square-sauna.html` **created**: extracted square-only content; single SKU `sauna_square` NZ$9,999; SEO: "Square Sauna — NZ$9,999 | TIBNZ"; related products: Barrel Sauna + Ice Bath
  - `product-page/outdoor-sauna.html` **rewritten**: product page → lightweight category page (~250 lines); "Find your heat ritual." heading; 2-card grid linking to barrel + square pages; JS redirect for legacy `?variant=square` → `/product-page/square-sauna` and `?variant=barrel` → `/product-page/barrel-sauna`; SEO: "Outdoor Saunas — From NZ$7,500 | TIBNZ"
  - `buy-now.html` **rewritten**: state machine with 6 states (HOME / COLD / HEAT / OUTDOOR / INDOOR / ALL)
    - HOME: full-viewport Cold Therapy / Heat Therapy split screen with real brand images; "View All Products" button
    - COLD: back button + "Cold Therapy" heading + 7-card grid (all cold + accessory products)
    - HEAT: Indoor Saunas (Coming Soon badge) / Outdoor Saunas sub-split
    - OUTDOOR: back button + "Outdoor Saunas" heading + 2-card grid (barrel + square)
    - INDOOR: "Coming Soon" page with "Register Interest" CTA
    - ALL: "All Products" heading + filter tabs (All / Cold Therapy / Heat Therapy) + full 9-card grid
    - Smooth fade transitions between states; `prefers-reduced-motion` respected
    - Product cards have `data-tags` attribute for JS filtering; no card HTML duplication
    - Barrel Sauna card href → `product-page/barrel-sauna.html`; Square Sauna → `product-page/square-sauna.html`
    - Meta description: "from NZ$9,899" → "from NZ$7,500"
  - `vercel.json`: removed `/product-page/barrel-sauna → outdoor-sauna` redirect (was blocking new file); changed `/product-page/premium-square-sauna` → `/product-page/square-sauna`
  - `sitemap.xml`: added `/product-page/barrel-sauna` + `/product-page/square-sauna` (priority 0.9); outdoor-sauna priority lowered to 0.8
  - `ice-bath-nz.html` + `ice-bath-chiller.html`: related sauna card price fixed `NZ$9,899` → `from NZ$7,500`
  - **Bug fixes (session 34 cont.):**
    - buy-now.html Cold Therapy split background changed from `img-6632-edited.webp` → `engineered-for-serious-cold.webp` (converted from `The Ice Bath — engineered for serious cold..png` via sharp, 169KB)
    - buy-now.html "View All Products" button centering fixed — `.reveal` class was overriding `transform: translateX(-50%)`; switched to margin-based centering (`left:0; right:0; margin:0 auto; width:fit-content`)
    - buy-now.html HEAT split Indoor/Outdoor heading alignment fixed — wrapped "Coming Soon" badge in `<p class="split-label">` so both halves have identical DOM structure above the heading
    - buy-now.html "Shop All Products" `<h1>` title removed — redundant with the "View All Products" button, not clickable, and had the same `.reveal` transform centering bug; CSS + HTML + mobile rule all deleted
    - buy-now.html back button restyled for visibility — changed from plain text link (`color:var(--mist)`, no background) to pill button with backdrop-blur background, border, `color:var(--snow)`, larger font (0.78→0.82rem), padding + border-radius; matches `.split-back-btn` aesthetic across COLD, OUTDOOR, INDOOR, and ALL states

- [x] **Buy-now filter system overhaul + cold indoor/outdoor split (session 35)**
  - `js/shipping.js`: `indoor`/`outdoor` tags added to all cold products — Ice Bath (`outdoor`), Chillers (`indoor outdoor`), Stainless Steel (`indoor outdoor`), All-in-One (`indoor`), Ice Bath Cover (`indoor outdoor`), Hose Attachment (`outdoor`)
  - `buy-now.html`: product card `data-tags` updated to match shipping.js tags
  - `buy-now.html`: new **Cold indoor/outdoor split screen** (`#splitCold`) — mirrors Heat split pattern; Indoor Cold background = `All in one Ice Bath (New)/lifestyle-1.webp`, Outdoor Cold background = `Stainless Steel Ice Bath (NEW)/lifestyle-4.webp`
  - `buy-now.html`: HOME → Cold Therapy now navigates to cold split screen (was: direct to grid)
  - `buy-now.html`: **filter tabs always visible** on all product grid states (was: ALL state only); two-row layout:
    - Row 1: All Products | Cold Therapy | Heat Therapy
    - Row 2: All | Indoor | Outdoor
  - Two-level filtering: `activeCategory` × `activeLocation` — e.g. "Cold Therapy + Indoor" shows only indoor cold products
  - Category switch resets location to "all" to prevent empty results
  - New states: `cold-split`, `cold-indoor`, `cold-outdoor`; `GRID_STATES` array for cleaner state management
  - Title dynamically updates: "Cold Therapy" (ice accent), "Heat Therapy" (ember accent), "All Products"

- [x] **Image updates (session 35)**
  - Ice Bath Cover photo added to accessory toggle on `ice-bath-nz.html`, `ice-bath-chiller.html`, `stainless-steel-ice-bath.html` — `ice-bath-cover.webp` (converted from `Photo 01-10-2023, 3 29 42 PM.jpg`, 1705KB)
  - Ice Bath Cover accessory + Hose Attachment accessory both now on stainless-steel-ice-bath.html (was hose only)
  - Homepage og:image + twitter:image → `Homepage/homepage-snippet.webp` (converted from `Photo 24-04-2024, 4 53 42 PM.jpg`, 1754KB)
  - Homepage "Why cold changes everything" photo → `Homepage/why-cold-changes-v2.webp` (150KB)
  - Homepage "Engineered for serious cold" photo → `Homepage/img-4712.webp` (1460KB)
  - Stainless Steel Ice Bath main photo updated across product page hero, buy-now card carousel, og:image, twitter:image → `stainless-steel-main.webp` (108KB, converted from `Stainless Steel Ice Bath.png`)
  - 5 new WebP conversions total (quality 82 via sharp)

- [x] **Site-wide polish pass (session 36)**
  - Favicon updated to `brand assets/Logo/7419a4b8-6cc9-4fb8-b3f0-f72537d6b373.png` across all 18 HTML files
  - Homepage hero "Shop the Collection" button → `buy-now.html` (was `#products` anchor)
  - Homepage ticker: removed "Recovery Science" and "1–2-Year Warranty" items
  - Footer copyright updated © 2021 → © 2026 across all 18 pages
  - Buy-now cold split labels: "Indoor Cold" → "Indoor Baths", "Outdoor Cold" → "Outdoor Baths"; small labels "Indoor" → "Premium", "Outdoor" → "NZ weather tested"
  - Buy-now heat split: "Barrel & Square" → "Durable & Effective"
  - Square Sauna buy-now card image → `product-card-main.webp` (converted from `paroduct card main.jpg`)
  - Chiller page: `img-6652.webp` rotated 90° right → `img-6652-rotated.webp`
  - "Configure and Buy Above" button: added `margin-bottom: 2rem` on all product pages
  - Product hero images: `align-items: flex-end` → `center` on 6 product pages (images now vertically centred with H1)
  - Homepage product cards reordered: Ice Bath / Square Sauna / Stainless Steel (left to right); images and copy updated
  - Homepage spacing: products section bottom padding 8rem → 5rem; stats section top padding 5rem → 4rem
  - Homepage feature section: removed "Flagship Product" badge
  - Homepage feature specs: "Rated For" → "Tried and Tested in", "NZ Outdoors" → "The NZ Outdoors"
  - Homepage feature specs: "Warranty" / "1 Year" → "Temp Rating" / "-5°C to 40°C"

- [x] buy-now.html: Indoor Saunas split text updated — "Launching soon for New Zealand" → "Check back soon for premium indoor saunas here in NZ" (session 37)

- [x] **Major indoor sauna expansion (session 38)**
  - **Phase 1: Image conversion** — 63 new images converted to WebP (quality 82) via sharp batch script
    - New brand asset folders: `Aurora 2P/`, `Aurora 3P/`, `Aurora 4P/`, `Solara 2P/`, `Solara 3P/`, `Tampere/`, `Lahti/`, `SAA/`
    - Descriptive naming: `hero-photo-catalog-photo.webp`, `interior-control-panel.webp`, `interior-heaters.webp`, `lifestyle-photo-1.webp`, etc.
    - Updated existing product photos: Barrel Sauna, Square Sauna, Stainless Steel Ice Bath, All-in-One Ice Bath
    - Aurora PDF manuals copied to brand assets
  - **Phase 1: SKUs** — 9 new products added to `js/shipping.js`:
    - `aurora_2p` ($4,749), `aurora_3p` ($5,749), `aurora_4p` ($6,849)
    - `solara_2p` ($4,449), `solara_3p` ($5,449)
    - `tampere_small` ($8,349), `tampere_large` ($9,349)
    - `lahti_2p` ($8,049), `lahti_3p` ($9,049)
    - All tagged `['heat', 'indoor']`
    - Ice Bath tags updated: `indoor` added to `ice_bath_4ft` and `ice_bath_5ft`
  - **Phase 2: Existing product photo updates**
    - `barrel-sauna.html`: hero converted to 9-slide carousel with new photos; specs expanded to 8 slides
    - `square-sauna.html`: hero converted to 6-slide carousel; specs expanded to 8 slides
    - `stainless-steel-ice-bath.html`: hero carousel 4 slides; specs expanded to 5 slides
    - `all-in-one-ice-bath.html`: hero carousel 5 slides; specs expanded to 6 slides
  - **Phase 3: 7 new indoor sauna product pages created**
    - `product-page/aurora-2p-infrared-sauna.html` — single SKU, ~~$6,349~~ $4,749, Low EMF + SAA sections
    - `product-page/aurora-3p-infrared-sauna.html` — single SKU, ~~$7,449~~ $5,749, Low EMF + SAA sections
    - `product-page/aurora-4p-infrared-sauna.html` — single SKU, ~~$8,849~~ $6,849, Low EMF + SAA sections
    - `product-page/solara-2p-infrared-sauna.html` — single SKU, ~~$5,949~~ $4,449, Low EMF + SAA sections
    - `product-page/solara-3p-infrared-sauna.html` — single SKU, ~~$7,149~~ $5,449, Low EMF + SAA sections
    - `product-page/tampere-sauna.html` — size selector (1-2P $8,349 / 3-4P $9,349), SAA section
    - `product-page/lahti-sauna.html` — size selector (2P $8,049 / 3P $9,049), SAA section
    - All pages include: hero carousel, info tabs (Highlights/Specs/Installation/What's Included), features grid, SAA certification, top 4 FAQ accordion, related products, cart integration, GA4
    - Infrared pages include: Low EMF section with full-spectrum explanation
  - **Phase 3: Indoor saunas category page**
    - `product-page/indoor-sauna.html` — two sections: "Infrared Saunas" (5 cards) + "Traditional Saunas" (2 cards); strikethrough + sale prices; contrast CTA banner
  - **Phase 4: buy-now.html updated**
    - Coming Soon indoor section replaced with 7 indoor sauna product cards
    - `.was` CSS class for strikethrough prices
    - Heat split Indoor half updated (no longer "Coming Soon")
    - 7 new cards added to main grid with `data-tags="heat indoor"`
    - Ice Bath card `data-tags` updated to include `indoor`
  - **Phase 5a: FAQ expansion**
    - `faq.html` Sauna tab: expanded from 6 → 28 questions (full FAQ document)
    - Topics: benefits, infrared vs traditional, pain relief, temperature, warm-up, running costs, shipping, installation, EMF, timber, Finnish traditions, safety certifications, WiFi
  - **Phase 5b: Sauna Science on benefits page**
    - `benefits.html`: sticky section nav (Cold Therapy / Sauna Science) with scroll-aware active state
    - Added: How a Sauna Works, Traditional Evidence (Laukkanen JAMA studies), Infrared Evidence (Waon/Beever), NZ Research Highlight (Otago/AUT), Benefits at a Glance comparison, disclaimer
    - SEO meta updated: "The Science of Cold & Heat Therapy"
    - Ember accent tokens added to `:root`
  - **Phase 5c: SAA + FAQ on existing sauna pages**
    - `barrel-sauna.html` + `square-sauna.html`: SAA Certification section + top 4 FAQ accordion added before Related Products
    - FAQ: benefits, traditional vs infrared, temperature, installation difficulty
    - "View all Sauna FAQs →" link to /faq
  - **Phase 6: Wiring**
    - `vercel.json`: 8 new redirects (indoor-saunas, aurora-2p/3p/4p, solara-2p/3p, tampere, lahti)
    - `sitemap.xml`: 8 new URLs (lastmod 2026-07-02, priority 0.9/0.8)
    - Footer links updated across all 25 HTML pages: single "Sauna" → "Outdoor Saunas" + "Indoor Saunas"

- [x] **Product page consistency + catalog fixes (session 39)**
  - **4 indoor sauna pages restructured** to match Aurora 4P template:
    - `aurora-2p-infrared-sauna.html`, `aurora-3p-infrared-sauna.html`, `solara-2p-infrared-sauna.html`, `solara-3p-infrared-sauna.html`
    - All now follow identical section order: Hero → Features (4-col grid) → Specs (carousel + grid) → Info Tabs (4 tabs) → Low EMF → SAA Cert → FAQ → CTA Banner → Order CTA → Related Products → Footer
    - CSS token system, class names, and JS patterns (carousel, tabs, FAQ accordion) all match template exactly
  - **All-in-One Ice Bath hidden from catalog** — product card commented out in `buy-now.html` (product page still exists)
  - **Square Sauna heater wattage corrected** — 8kW → 6kW across 5 files: `square-sauna.html`, `buy-now.html`, `barrel-sauna.html`, `outdoor-sauna.html`, `index.html`
  - **Solara 3P price corrected** — $4,449 → $5,449 in `buy-now.html` Indoor Saunas section (was accidentally changed in prior session)
  - **All 15 product pages converted to background-image hero** — full-bleed background with `brightness(0.83) saturate(0.9)` default → `brightness(1.0) saturate(1.1)` on hover (done in prior session, verified this session)

- [x] **Copy tweaks on infrared sauna pages (session 40)**
  - Removed "EMF so low it's barely measurable." heading from Low EMF section on all 5 infrared pages (Aurora 2P/3P/4P, Solara 2P/3P) — rest of section (badge, 0–3 mG stat, description) remains
  - SAA section copy: "before it leaves the factory" → "before it leaves" on all 5 infrared pages

- [x] **New photo package + catalog updates (session 41)**
  - **WebP conversion** — 79 new images converted from `Website/` folder at quality 82 via sharp; saved to `brand assets/Website/` with subfolders: Aurora 2P/3P/4P, Solara 2P/3P, Square Sauna, Tampere, Lahti, All in One Ice Bath, New Photos of Existing Ice Bath products; plus root `1.1-ratio-of-ice-bath.webp`
  - **Catalog labels** — all "2P", "3P", "4P", "6P" labels changed to "2 Person", "3 Person", "4 Person", "6 Person" across `buy-now.html` (10 replacements in 2 sections)
  - **All-in-One Ice Bath reactivated** in `buy-now.html` catalog (was commented out); new image + tagline
  - **Ice Bath hero photo** — `1.1-ratio-of-ice-bath.webp` applied to `index.html` (hero bg + product card) and `product-page/ice-bath-nz.html` (hero bg)
  - **Responsive hero images** — 3:2 ratio for desktop, 2:3 ratio for mobile across all updated product pages:
    - Aurora 2P/3P/4P: `<picture>` element with `<source media>` swap
    - Solara 2P/3P, Stainless Steel: CSS `background-image` with 768px breakpoint
    - Tampere: `<picture>` element; Lahti + Square Sauna: 3:2 only (no 2:3 available)
  - **Specs carousel updates** — new interior/lifestyle shots added:
    - Aurora 2P: 5 slides; Aurora 3P: 5 slides; Aurora 4P: 5 slides
    - Solara 2P: 4 slides; Solara 3P: 2 slides
    - Tampere: 3 slides; Lahti: 8 slides; Square Sauna: 3 slides
    - Stainless Steel: 6 slides (added 1); All-in-One: 5 slides
  - **All-in-One product page** — hero bg → `image-2.webp`; specs carousel 5 slides; specs grid expanded 4→8 items; What's Included 4→8 items; OG/Twitter meta updated
  - **Catalog card images** — all 7 indoor sauna cards updated in `buy-now.html` and `product-page/indoor-sauna.html` with new no-background WebP images; Square Sauna + Ice Bath cards also updated
  - Note: two hero image approaches used (Aurora `<picture>` vs Solara/SS CSS `background-image`) — may harmonise in future session

- [x] **Hero background alignment + Solara 3P image update (session 42)**
  - Hero background position changed from `65% center` (right-biased) → `left center` on all 15 product pages — shows more of the left side of each image
  - Tablet breakpoint also changed from `60% center` → `left center`
  - Mobile breakpoint unchanged (`center 30%`)
  - Updated both patterns: `object-position` on 12 IMG-element pages + `background-position` on 3 CSS background-image pages (Solara 2P/3P, Stainless Steel)
  - Homepage hero left as-is (uses `object-fit: contain` product cutout, not full-bleed background)
  - Solara 3P catalog/card image updated site-wide: `1.1-ratio-no-background.webp` → `1.1-aspect-ratio-primary-image-new.webp` (converted from new photo package)
  - Updated in: `buy-now.html` (2 locations), `indoor-sauna.html`, `solara-2p-infrared-sauna.html` (related card), `solara-3p-infrared-sauna.html` (og:image + twitter:image)
  - **Product card images: `object-fit: contain`** — no-bg 1:1 product photos now display at natural aspect ratio without cropping
  - `buy-now.html`: `.carousel-slide img` default changed to `contain`; new `.img-cover` utility class for lifestyle/environmental photos that need `cover`; inline `style="object-fit:cover;"` removed from all imgs; hover zoom (`scale(1.05)`) removed
  - `index.html`: `.product-img-frame img` changed to `contain`; hover zoom removed; lifestyle photos (Square Sauna, SS Bath) get inline `style="object-fit:cover;"`
  - `indoor-sauna.html`: hover zoom removed (already had `contain`)
  - 13 product pages: `.related-img img` changed from `cover` to `contain`; hover zoom removed on related cards
- [x] **Image Reference Guide folder created** — customer-facing reference of all 151 images used across the site (session 42)
  - Organized into labeled folders/subfolders by product and page location (Homepage, Buy Now Page, Ice Bath, Barrel Sauna, Aurora 2/3/4P, Solara 2/3P, Tampere, Lahti, Accessories, Shared Assets, etc.)
  - Each image copied with descriptive filename (e.g. `hero-image.webp`, `carousel-control-panel.webp`, `catalog-card-no-bg.webp`)
  - README.md included with: folder structure map, image replacement workflow (add "NEW" suffix), size/format guidelines
  - Purpose: customer can add replacement photos with same filename + "NEW" and they can be easily swapped in

- [x] **Buy-now cold therapy flow simplified (session 43)** — removed indoor/outdoor split screen for cold therapy; clicking "Cold Therapy" goes straight to product grid. Indoor/Outdoor filters only appear for Heat Therapy, styled with orange active-heat buttons.
- [x] **Chiller page split into two standalone pages (session 43)** — `ice-bath-chiller.html` is now standard-only (NZ$2,399), new `premium-chiller.html` for premium (NZ$3,299). Variant toggles removed from both. Add-on selectors (ice bath, accessories) retained.
- [x] **New catalog card images (session 43)** — 8 new product photos converted to WebP and applied to buy-now and indoor-sauna catalog cards (Aurora 2P/3P/4P, Solara 2P/3P, Tampere, Lahti, Galvanised Ice Bath)
- [x] **Homepage CTAs updated (session 43)** — all `#products` links now point to `/buy-now` (hero CTA, nav Products, Shop Now button, bottom CTA)
- [x] **Mobile carousel height increased (session 43)** — specs image carousel 40% taller on mobile (`aspect-ratio: 4/4.2`) across all 14 product pages
- [x] **Footer cleanup (session 43)** — removed all dead `#` links (Accessories, Bundles, Blog, Ambassadors, Careers, Shipping & Returns, Warranty), removed TikTok icon, added real Instagram (`theicebath_nz`) and Facebook URLs across all 26 pages
- [x] **Sitemap updated (session 43)** — all 24 URLs including new `premium-chiller`, all lastmod set to 2026-07-12
- [x] **Vercel redirect added (session 43)** — `ice-bath-chiller-premium` → `premium-chiller`

### Pending
- [ ] (none)

---

## Prices
Found in shipping.js (Single Source of Truth)     |
