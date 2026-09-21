# Launch Tasks & Verification Checklist — 20 Production Milestones

Status key:
- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed

---

| # | Requirement | Status | Key Implementation Files | Verification Criteria |
|---|---|:---:|---|---|
| **01** | **Privacy Policy** | `[~]` | `src/pages/Privacy.tsx`, `src/components/legal/` | Restrained editorial layout, plain-English summary, accurate disclosure of localStorage/analytics, zero fake telemetry. |
| **02** | **Terms & Conditions** | `[~]` | `src/pages/Terms.tsx`, `src/components/legal/` | Factual scope (informational/portfolio), permitted use, IP disclosure, synchronous deterministic load. |
| **03** | **No Frontend Secrets** | `[x]` | `src/services/`, `server.ts`, `vite.config.ts` | Zero API keys, GITHUB_TOKEN, ADMIN_PASSKEY, or Bearer auth in client bundle; GitHub data strictly via static snapshot. |
| **04** | **HTTPS & Security Headers** | `[x]` | `vercel.json`, `server.ts`, `src/config/seo.ts` | Canonical HTTPS (`https://sayammukherjee.in`), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |
| **05** | **Cookie & Consent Management** | `[~]` | `src/components/CookieConsent.tsx`, `src/services/consent.ts` | Slim bottom banner, Accept/Reject/Preferences, persistent choice, footer reopen trigger, zero unconsented tracking. |
| **06** | **SEO Meta Titles & Descriptions** | `[~]` | `src/config/seo.ts`, `src/components/SEO.tsx` | Unique title, description, OG, Twitter card for all 10 routes + 404. Canonical domain unified to `sayammukherjee.in`. |
| **07** | **Social Preview Asset** | `[~]` | `public/og-image.png`, `index.html` | 1200x630 minimal premium editorial card, absolute HTTPS URL in production, valid HTTP 200 response. |
| **08** | **Favicon System** | `[~]` | `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png` | Authentic brand mark (SM geometric icon), multi-resolution support, valid link tags in `index.html`. |
| **09** | **Sitemap & robots.txt** | `[~]` | `public/sitemap.xml`, `public/robots.txt` | Only public canonical routes included, correct domain (`sayammukherjee.in`), static serving verified without SPA HTML fallback. |
| **10** | **Image Alt Text** | `[~]` | `src/components/`, `src/data/projects.ts` | Descriptive alt text on meaningful photos/diagrams, empty `alt=""` on purely decorative icons. |
| **11** | **Image Compression** | `[~]` | `scripts/optimize-images.mjs`, `public/` | Optimized formats, explicit width/height to eliminate CLS, async decoding and lazy loading below the fold. |
| **12** | **Performance & Page Load** | `[~]` | `src/App.tsx`, `src/components/` | Elimination of unnecessary scroll listeners, viewport-once animations, clean bundle size, fast rendering. |
| **13** | **Contrast & Color System** | `[~]` | `src/index.css`, `src/components/` | WCAG AA compliant contrast in Dark and Light themes, semantic CSS tokens, no muddy gray-on-gray text. |
| **14** | **Full Responsive Design** | `[~]` | `src/index.css`, `src/components/` | Zero horizontal overflow from 320px to 3840px, >=44px mobile touch targets, safe-area-inset padding. |
| **15** | **Custom 404 Page** | `[~]` | `src/pages/NotFound.tsx`, `src/App.tsx` | Instant catch-all fallback without async delays, clear message, "Back Home" & "View Projects" actions. |
| **16** | **Broken Link Integrity** | `[~]` | `src/config/links.ts`, `scripts/check-links.mjs` | Automated link crawler script, zero dead `#` or broken external links, central link registry. |
| **17** | **Contact Form Validation** | `[~]` | `src/components/ContactForm.tsx`, `src/utils/validation.ts` | Client & server validation (name, valid email, message), trim whitespace, real delivery or fallback mailto. |
| **18** | **Spam & Bot Protection** | `[~]` | `server.ts`, `src/components/ContactForm.tsx` | Honeypot field, rate limiting per IP, request payload size clamping, safe error messages. |
| **19** | **Analytics Integration** | `[~]` | `src/services/analytics.ts`, `src/services/consent.ts` | Official Vercel / lightweight analytics abstraction, gated strictly on user consent, zero fake counters. |
| **20** | **Single Primary CTA Hierarchy** | `[~]` | `src/components/HeroSection.tsx`, `src/components/SiteFooter.tsx` | Unified global primary CTA ("Let's Work Together" → `/contact`), clear secondary visual styling. |
