# Project Progress — The Ice Bath NZ (v2)

Last updated: 2026-04-13 (session 6)

---

## Key Decisions

### URL Structure
- Kept old site's `/product-page/[slug]` pattern — product pages live in `product-page/` subfolder
- `vercel.json` uses `cleanUrls: true` so `.html` extensions are stripped from live URLs
- Renamed `science.html` → `benefits.html` to match old site's `/benefits` URL
- All old product slugs redirect to new canonical slugs via `vercel.json` redirects

### Products (3 only)
- **Ice Bath** → `product-page/ice-bath-nz.html` — 4ft ($784) and 5ft ($888) on one page with JS size selector (product renamed from "Ice Bath NZ" to "Ice Bath")
- **Ice Bath Chiller / Premium Ice Bath Chiller** → `product-page/ice-bath-chiller.html` — model selector; toggling Premium switches full page content (name, tagline, price, highlights, features, specs)
- **Barrel Sauna / Square Sauna** → `product-page/barrel-sauna.html` — variant toggle; Barrel ($9,899, cedar, 6kW) and Square ($9,999, Thermo Hemlock, 8kW, LED, stadium seating)

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
├── benefits.html           — Science/benefits page (was science.html)
├── about-us.html
├── contact.html
├── faq.html
├── vercel.json             — Redirects + clean URLs
├── sitemap.xml             — XML sitemap (all 8 pages)
├── .gitignore
├── serve.mjs               — Local dev server (port 3000)
├── screenshot.mjs          — Puppeteer screenshot tool
├── brand assets/           — Logo, product images
│   └── Ice Bath/           — Reorganised; bath tub & chiller images moved here
└── product-page/
    ├── ice-bath-nz.html    — Ice Bath (4ft / 5ft size selector)
    ├── ice-bath-chiller.html — Chiller / Premium Chiller model selector
    └── barrel-sauna.html
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

### Pending
- [ ] Mobile polish pass for each page
- [ ] photos throughout entire website
- [ ] Favicon for website
---

## Prices
| Product                    | Price     |
|----------------------------|-----------|
| Ice Bath 4ft               | NZ$784    |
| Ice Bath 5ft               | NZ$888    |
| Chiller (standalone)       | NZ$2,712  |
| Premium Ice Bath Chiller (sale) | NZ$3,299 |
| Premium Ice Bath Chiller (orig) | NZ$4,999 |
| 4ft + Chiller bundle       | NZ$3,479  |
| 5ft + Chiller bundle       | NZ$3,609  |
| 4ft + Premium Chiller      | NZ$4,379  |
| 5ft + Premium Chiller      | NZ$4,509  |
| Barrel Sauna               | NZ$9,899  |
| Square Sauna               | NZ$9,999  |
