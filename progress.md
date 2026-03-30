# Project Progress — The Ice Bath NZ (v2)

Last updated: 2026-03-31

---

## Key Decisions

### URL Structure
- Kept old site's `/product-page/[slug]` pattern — product pages live in `product-page/` subfolder
- `vercel.json` uses `cleanUrls: true` so `.html` extensions are stripped from live URLs
- Renamed `science.html` → `benefits.html` to match old site's `/benefits` URL
- All old product slugs redirect to new canonical slugs via `vercel.json` redirects

### Products (3 only)
- **Ice Bath** → `product-page/ice-bath-nz.html` — 4ft ($784) and 5ft ($888) on one page with JS size selector (product renamed from "Ice Bath NZ" to "Ice Bath")
- **Chiller / Premium Chiller** → `product-page/ice-bath-chiller.html` — model selector with live price switching
- **Barrel Sauna** → `product-page/barrel-sauna.html` — $9,899, 6kW Finnish heater, cedar construction

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
│   └── bath tub & chiller no bg.png
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
- [x] Renamed product "Ice Bath NZ" → "Ice Bath" across all instances on ice-bath-nz.html
- [x] Added Chiller / Premium Chiller model selector to ice-bath-chiller.html (NZ$2,712 / NZ$3,612)
- [x] Fixed sauna page chiller related card price ($899 → $2,712)
- [x] Removed team section from about-us.html; added border-top to CTA for visual separation
- [x] Updated copyright year © 2026 → © 2021 across all 8 pages
- [x] Generated sitemap.xml with all 8 URLs
- [x] Fixed infinite redirect loop on barrel-sauna Vercel URL (self-referencing vercel.json rule removed)
- [x] Removed stale "Portable Pod" references from ice-bath-chiller.html related cards

### Pending
- [ ] Replace placeholder images on chiller and sauna pages with real photography

---

## Prices
| Product                    | Price     |
|----------------------------|-----------|
| Ice Bath 4ft               | NZ$784    |
| Ice Bath 5ft               | NZ$888    |
| Chiller (standalone)       | NZ$2,712  |
| Premium Chiller (standalone)| NZ$3,612 |
| 4ft + Chiller bundle       | NZ$3,479  |
| 5ft + Chiller bundle       | NZ$3,609  |
| 4ft + Premium Chiller      | NZ$4,379  |
| 5ft + Premium Chiller      | NZ$4,509  |
| Barrel Sauna               | NZ$9,899  |
