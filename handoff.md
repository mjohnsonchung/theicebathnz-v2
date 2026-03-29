# theicebathnz.co.nz — 8-Page Site Complete, Ready for Next Phase

## Situation
Building a static multi-page site for theicebathnz.co.nz (ice bath equipment, NZ). Three new pages (About Us, Contact, FAQ) were built this session, completing the full 8-page site. All nav and footer links are now wired to real pages. No GitHub push yet (user preference).

## Current State
- Branch: `master`
- Uncommitted changes: `index.html` (M), all others (??) — all 8 pages are untracked/modified, never committed except the initial hero-fix commits
- Tests: none (static site)
- What works: all 8 pages render correctly at desktop; nav/footer fully wired between pages; accordion + filter JS functional on FAQ; contact form shows success state; screenshot workflow functional
- What's incomplete: no Stripe, no email signup backend; Frost Chiller and Portable Pod use placeholder images; no mobile polish pass on the 3 new pages yet, no dry sauna product listing or product page yet.

## Key Files
- `index.html` — main landing page; nav now points to about.html/contact.html (not #about/#contact)
- `about.html` — new: editorial hero, 3 value cards, 3 story rows (alternating layout), 4 team cards, CTA
- `contact.html` — new: editorial hero, 2-col (styled form + info panel), form has ice-blue focus states, success state on submit
- `faq.html` — new: hero + filter pills, sticky sidebar with scroll-spy, 4 accordion sections (18 questions), CTA
- `arctic-steel-pro.html` — flagship product page; updated nav + footer links
- `science.html` — editorial content page; updated nav + footer links
- `brand assets/bath tub & chiller no bg.png` — real product photo used in Arctic Pro pages

## Decisions Made
- No GitHub push until user explicitly requests
- About/Contact/FAQ nav links updated on ALL pages including index.html (was #about/#contact anchors, now standalone pages)
- About page hero deco: large italic stacked words "Cold / Craft" with outline stroke effect (not a real image)
- Story section visuals: pure CSS atmospheric panels with decorative outline text (not placeholder images) — intentional, keeps it editorial
- FAQ accordion: one-open-at-a-time within each section, JS filter hides/shows entire category sections
- Contact form: static HTML with JS success state — no backend (Stripe/email TBD)
- Team on About page: 4 fictional Auckland team members (James Mitchell, Sarah Rowe, Tom Keane, Aroha Parata) — placeholders for real team

## Failed Approaches
- Edit tool requires file to have been Read in the same conversation — always Read before Edit, even if you think you've seen the file
- portable-pod.html CSS is stored as single long line — must Grep for exact string before editing; multi-line match will fail

## Active Constraints
- Always invoke `frontend-design` skill before writing any frontend code
- Full node path: `/c/Program\ Files/nodejs/node.exe`
- Never push to GitHub without explicit user instruction
- portable-pod.html CSS is single-line format — Grep exact string before any Edit
- serve.mjs must URL-decode paths (handles filenames with spaces/&)
- Puppeteer headless doesn't trigger IntersectionObserver — screenshot.mjs uses page.evaluate() to force `.in` class on `.reveal` elements
- placehold.co images: use `#0D2A48/5BC8F5` for dark-background contrast

## Next Steps
1. **Mobile polish pass** on about.html, contact.html, faq.html — screenshot at 390px width and fix any layout breaks
2. **Commit** all 8 pages when user is ready (has been deferring; group into one meaningful commit)
3. **Stripe integration** — confirm product IDs and Stripe account before implementing buy buttons
4. **Email signup backend** — confirm provider (Mailchimp, ConvertKit, or custom) before wiring newsletter form
5. **Real product photos** for Frost Chiller and Portable Pod — request from client
6. **Replace fictional team** on about.html with real team info when client provides

## Open Questions
- Which Stripe plan/product IDs to use? Account connected?
- Email signup provider — Mailchimp, ConvertKit, or something else?
- Real product photos for Frost Chiller + Portable Pod — when available?
- Real team details for About page — names, roles, bios?
- Push to GitHub / deploy — when does user want this live?
