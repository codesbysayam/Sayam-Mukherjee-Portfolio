# Project Memory & Architecture Context — Sayam Mukherjee Portfolio

## 1. Project Identity & Purpose
- **Developer**: Sayam Mukherjee
- **Role**: AI & Machine Learning Undergraduate (Kalinga Institute of Industrial Technology, 2nd Year) · Systems & Full-Stack Developer
- **Official Domain**: `https://sayammukherjee.in`
- **GitHub Username**: `codesbysayam`
- **Primary Contacts**: `sayammukherjee1506@gmail.com` (Direct contact), `wrickbusiness@gmail.com` (Business inquiries)

---

## 2. Key Architectural Decisions & Invariants

### GitHub Data Ingestion
- **Invariant**: The browser NEVER calls `https://api.github.com` directly.
- **Workflow**: Automated GitHub Actions run `scripts/sync-github-data.mjs` using the runner's built-in `${{ secrets.GITHUB_TOKEN }}`. The output is committed to `public/data/github.json`.
- **Client Fallback**: The client loads `/data/github.json` (or `/github-data.json`). If unavailable or offline, the app hydrates using pre-bundled verified records in `src/services/github.ts` and `src/services/githubSnapshot.ts`. Rate limits and token prompts are impossible for end users.

### Authentication & Vault Security
- **Owner Passkey**: Validated purely server-side in `server.ts` via timing-safe HMAC equality (`crypto.timingSafeEqual`).
- **Session Token**: On successful passkey verification, an HMAC-SHA256 signed token is issued in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie (`vault_session`).
- **Forbidden**: Storing passkeys, admin tokens, or auth headers in `localStorage` or `sessionStorage`.

### Routing & Legal Page Determinism
- **History API Navigation**: Routing in `src/App.tsx` handles `/`, `/about`, `/projects`, `/skills`, `/ecosystem`, `/certificates`, `/journal`, `/contact`, `/privacy`, `/terms`, and catch-all `*`.
- **Zero-Dependency Legal Pages**: `/privacy` and `/terms` must render completely synchronously without awaiting GitHub API, analytics, chatbot, or dynamic database calls. This guarantees they never hang or fail on direct hard refreshes or new tabs.

### Master Footer Design
- **Eliminated Primary Duplication**: The master footer does NOT repeat Home, About, Projects, Skills, Ecosystem, Certificates, or Journal links.
- **Retained Only**: Sayam Mukherjee brand identity, copyright, Contact, Privacy Policy, Terms, and the theme switcher.

### Centralized Registries
- **Link Registry**: `src/config/links.ts` contains all internal routes and external profile URLs. No hardcoded `#` or placeholder links.
- **SEO Registry**: `src/config/seo.ts` holds all route-specific titles, descriptions, canonical URLs, and OpenGraph metadata. The canonical origin is strictly `https://sayammukherjee.in`.
