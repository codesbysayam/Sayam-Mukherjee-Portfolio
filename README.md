# Sayam Mukherjee — Interactive Engineering Portfolio

A full-stack personal portfolio for presenting Sayam Mukherjee's software projects, engineering work, technical interests, academic background, credentials, writing, and public developer activity.

- **Website:** https://sayammukherjee.in
- **Source repository:** https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio
- **GitHub profile:** https://github.com/codesbysayam
- **Profile README source:** [github-profile/README.md](github-profile/README.md)

> This document describes the repository's current source architecture. It distinguishes implemented capabilities from optional integrations and does not claim that a deployment or test passed unless it has actually been verified.

## Contents

- [Overview](#overview)
- [Routes and features](#routes-and-features)
- [Frontend architecture](#frontend-architecture)
- [Motion and interaction system](#motion-and-interaction-system)
- [Backend and API](#backend-and-api)
- [Data and media](#data-and-media)
- [GitHub data pipeline](#github-data-pipeline)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Setup](#setup)
- [Environment configuration](#environment-configuration)
- [Commands](#commands)
- [Validation and QA](#validation-and-qa)
- [Deployment](#deployment)
- [Security and privacy](#security-and-privacy)
- [Design direction](#design-direction)
- [Links](#links)

## Overview

The portfolio is a React 19 and TypeScript application served through an Express application. It combines editorial portfolio content with interactive project case studies, GitHub telemetry, certificate previews, skills and ecosystem views, journal content, and contact workflows.

The repository is organised around a central content/data layer, reusable React components, client-side service modules, Express API routers, and scripts/workflows for repository telemetry and profile README synchronisation.

### Project goals

1. Present selected engineering work with accurate descriptions, technology context, source links, and live demonstrations where available.
2. Provide a responsive experience across desktop, tablet, and mobile.
3. Keep project, profile, credential, and journal content maintainable in source-controlled data modules.
4. Provide server-side endpoints for contact submissions, portfolio data, certificates, telemetry, and the deterministic portfolio guide.
5. Display GitHub activity through generated snapshots and server-side telemetry rather than requiring every visitor to call GitHub directly.

## Routes and features

The main application resolves its active view from the browser path. The source supports these destinations:

| Route | Purpose |
|---|---|
| `/` | Home introduction, editorial chapters, selected work, GitHub activity, credentials preview, and FAQ |
| `/about` | Biography, experience, academic and achievement content |
| `/projects` | Project showcase, search/filter, and case-study interactions |
| `/skills` | Technical skills, stack, language and project-evidence views |
| `/ecosystem` | Engineering, learning, and creative activities |
| `/certificates` | Certificate and credential archive with preview interactions |
| `/journal`, `/blog` | Journal listing |
| `/journal/:slug`, `/blog/:slug` | Journal detail views |
| `/contact` | Contact information and inquiry form |
| `/github` | GitHub profile, repositories, languages, and activity |
| `/showcase`, `/video-showcase`, `/creator-showcase` | Content creator/video showcase |
| `/privacy` | Privacy information |
| `/terms` | Terms information |

A not-found view and protected administrative functionality are also present. Route resolution and view composition are handled in `src/App.tsx`.

## Frontend architecture

### Application entry and shell

- `src/main.tsx` initialises UTM attribution and mounts React.
- `src/App.tsx` composes the application shell, active views, navigation, overlays, route transitions, and section-level error boundaries.
- `src/context/PortfolioContext.tsx` provides shared portfolio state, theme state, and visit tracking.
- `src/index.css` imports Tailwind CSS, resume spotlight styles, and shared motion styles; it defines global tokens and responsive primitives.

### Component areas

- `src/components/` — main page sections and shared UI.
- `src/components/projects/` — project cards, media, metrics, build activity, and case-study components.
- `src/components/certificates/` — credential cards, metadata, preview, and modal components.
- `src/components/github/` — GitHub profile, repository, language, contribution, and activity views.
- `src/components/skills/` — skills, stack, evidence, and technology visualisations.
- `src/components/ecosystem/` — ecosystem page.
- `src/components/journal/` — journal cards, filters, and listing components.
- `src/components/assistant/` — deterministic portfolio guide interface.
- `src/components/layout/` — full-screen navigation.
- `src/components/common/` — shared navigation, modal, card, reading-progress, and utility components.
- `src/pages/` — journal detail, legal, and not-found views.

### Content and data

Structured content is maintained in TypeScript modules under `src/data/` and the adjacent `src/data.ts` module.

Important files:

- `src/data/projects.ts` — project metadata, descriptions, technology stacks, repository references, and case-study content.
- `src/data/projectMedia.ts` — project screenshot and media mapping.
- `src/data/initialCertificates.ts` and `src/data/extendedData.ts` — credential and extended portfolio records.
- `src/data/skills.ts` — skills and technology information.
- `src/data/journal.ts` — journal entries.
- `src/data/profile.ts`, `src/data/education.ts`, and `src/data/resumeData.ts` — profile, academic, and résumé content.
- `src/data/siteContent.ts` — canonical site copy, navigation, social links, and shared content constants.
- `src/data/faqData.tsx`, `src/data/channels.ts`, and `src/data/assistantKnowledge.ts` — FAQ, channel, and assistant knowledge content.

Project media is stored in `src/assets/projects/`; profile imagery is stored in `src/assets/images/`. Prefer genuine project screenshots and approved personal photography over generic stock imagery.

## Motion and interaction system

The project uses **Motion for React (`motion/react`)** and includes a shared motion foundation:

- `src/motion/tokens.ts` — durations, easing curves, reveal distances, reduced-motion preference, device capability, and fine-pointer detection.
- `src/motion/motion-tokens.ts` — compatibility exports for motion tokens.
- `src/motion/motion-presets.ts` — reusable reveal, stagger, modal, hover, and tap presets.
- `src/motion/MotionProvider.tsx` — shared motion configuration and device/reduced-motion context.
- `src/motion/Reveal.tsx` — reusable editorial reveal primitives.
- `src/styles/motion.css` — contour flow, image reveal, editorial utilities, and reduced-motion CSS.
- `src/components/motion/` — contour backgrounds, route transitions, orbital sculpture, pointer trail, scroll story thread, and closing fluid canvas.

Motion should be purposeful and consistent. Prefer transforms and opacity for routine transitions, pause expensive effects when offscreen, avoid competing animation systems, and provide reduced-motion behaviour. WebGL/Canvas effects must be progressively enhanced and must not block content or navigation.

A component existing in the source tree does not guarantee that every effect is active on every route or device. Check imports, render paths, and capability conditions before changing or documenting runtime behaviour.

## Backend and API

The backend is an Express application composed from domain-specific routers.

- `server.ts` creates the Express application, configures Vite middleware in development, serves production frontend output, and starts the non-serverless HTTP process.
- `server/app.ts` configures JSON parsing, baseline security headers, health checks, API routers, assistant endpoints, and API not-found handling.
- `api/index.ts` exposes the Express application through the Vercel serverless entry point.
- `server/config/env.ts` loads environment configuration, Firebase applet configuration, optional integration keys, and startup diagnostics.
- `server/middleware/` contains authentication and rate-limiting middleware.
- `server/services/` contains Firestore REST and email service abstractions.
- `server/repositories/` contains persistence logic for analytics, portfolio data, communications, and certificates.
- `server/validation/schemas.ts` contains request validation schemas.

### API surface

Route handlers live under `server/routes/` and are mounted by `server/app.ts`.

| Endpoint | Method | Responsibility |
|---|---|---|
| `/api/health` | GET | Basic server health response |
| `/api/portfolio-data` | GET/POST | Portfolio data retrieval and protected operation |
| `/api/certificates` | GET/POST/PATCH/DELETE | Certificate listing and protected management |
| `/api/certificates/stats` | GET | Certificate statistics |
| `/api/certificates/storage-status` | GET | Certificate storage status |
| `/api/certificates/:id` | GET | Fetch a certificate record |
| `/api/contact` | POST | Validate and persist a contact inquiry |
| `/api/newsletter/subscribe` | POST | Newsletter subscription |
| `/api/testimonials` | POST | Testimonial submission |
| `/api/analytics/visit` | POST | Visit analytics |
| `/api/admin/*` | GET/POST | Administrative authentication and protected operations |
| `/api/github/telemetry` | GET | Canonical unified GitHub repository, size, star/fork, and language byte telemetry |
| `/api/github/*` | GET | GitHub profile, repository, language, event, and pulse telemetry |
| `/api/github-stats` | GET | Canonical GitHub statistics summary |
| `/api/leetcode/profile` | GET | LeetCode profile data |
| `/api/codolio/profile` | GET | Codolio profile data |
| `/api/export-project` | GET | Project export response |
| `/api/assistant` | POST | Deterministic knowledge-grounded Portfolio Guide endpoint |
| `/api/youtube/channels` | GET | YouTube channel data |

Consult each route file for request schemas, authentication requirements, response fields, and current behaviour. This table is a navigation aid, not a replacement for route contracts.

### Contact email behaviour

The current `server/services/email.service.ts` explicitly reports that external email transport is disabled. Contact inquiries are designed to be persisted; notification delivery can return `stored_pending_email_config`. Do not describe the form as successfully sending email unless a provider is configured and delivery is verified.

## Data and media

- Canonical project records are maintained in `src/data/projects.ts`.
- Project-to-image associations are maintained in `src/data/projectMedia.ts`.
- The current project media files are under `src/assets/projects/`.
- Profile and Open Graph assets are under `src/assets/images/` and `public/`.
- Public snapshots and generated metadata are under `public/data/` and `public/`.

When changing project media, confirm that the screenshot belongs to the correct project, preserve its aspect ratio, choose a suitable focal point, and avoid stretching or aggressive blur.

## GitHub data pipeline

GitHub information is handled through a canonical server-side telemetry pipeline and generated fallback snapshots:

- `server/services/githubTelemetry.ts` exposes the unified telemetry builder, SSRF-checked GitHub API fetcher, `Link` pagination, 15-minute server cache (with a 30-second manual refresh cooldown), and sub-0.1% percentage formatter (`<0.01%` precision).
- `GET /api/github/telemetry` serves the canonical payload consumed by both the Projects GitHub Telemetry section (`ProjectStatsOverview`) and the Skills Language Composition section (`CodebaseLanguageDistribution`), alongside aligned `/api/github/languages` and `/api/github-stats` routes.
- **Repository & Language Filtering Policy:** All 11 public repositories appear in **Repository Activity**, whereas **Language Composition** aggregates source bytes exclusively across owned non-fork repositories (`10` owned repos; public fork `inkloom` is excluded from owned code totals).
- `scripts/sync-github.mjs` refreshes `public/data/github.json` and `public/github-data.json` fallback snapshots.
- `src/services/githubTelemetry.ts` and `src/hooks/useGitHubTelemetry.ts` synchronize client views onto the shared telemetry model with automatic fallback to `/data/github.json`.
- `.github/workflows/sync-github.yml` schedules an hourly sync and supports manual dispatch. It uses the workflow's `GITHUB_TOKEN` and commits changed snapshot files.

Visitors do not need a browser-side GitHub token for static snapshot display. Keep write-capable credentials in GitHub Actions secrets or server-side environment configuration; never expose them in frontend code or public assets.

## Technology stack

### Frontend

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- Motion for React 12
- Three.js
- D3
- Recharts
- Lucide React
- React Markdown

### Backend and services

- Node.js
- Express 4
- Firebase client SDK and Firebase Admin SDK
- Firestore-backed repositories and persistence helpers
- Zod request validation
- Deterministic portfolio knowledge engine
- Vercel serverless adapter and Vercel Analytics

### Tooling

- TypeScript compiler
- ESLint configuration
- Vitest and Supertest dependencies
- Python portfolio data validator
- C portfolio metrics utility
- GitHub Actions
- esbuild for the production server bundle

## Repository structure

```text
.
├── api/
│   └── index.ts                    # Vercel serverless Express entry
├── docs/                           # Architecture, design, audit, PRD and test notes
├── github-profile/                 # Source README and setup for GitHub profile sync
├── public/
│   ├── data/github.json            # Generated GitHub snapshot
│   ├── github-data.json            # Compatibility snapshot
│   ├── assets/                     # Static assets
│   ├── build-manifest.json         # Generated build metadata
│   ├── sitemap.xml
│   ├── robots.txt
│   └── llms.txt
├── schema/
│   └── certificates.sql            # Certificate schema reference
├── scripts/
│   ├── capture-project-covers.mjs  # SSRF-safe live project cover capture
│   ├── project-cover-targets.json  # Public deployment URLs for cover capture
│   ├── preflight.mjs               # Project validation pipeline
│   ├── sync-github.mjs             # GitHub snapshot generator
│   └── generate_build_manifest.js  # Build manifest generator
├── server/
│   ├── app.ts                      # Express application and route mounting
│   ├── config/                     # Runtime configuration
│   ├── middleware/                 # Authentication and rate limiting
│   ├── repositories/               # Data persistence modules
│   ├── routes/                     # API route handlers
│   ├── services/                   # Firestore and email service abstractions
│   └── validation/                 # Request schemas
├── src/
│   ├── assets/                     # Profile and project media
│   ├── components/                 # Page sections and reusable UI
│   ├── context/                    # Shared portfolio state
│   ├── data/                       # Portfolio content and structured records
│   ├── hooks/                      # React hooks
│   ├── lib/                        # Firebase, GitHub and assistant clients
│   ├── motion/                     # Shared motion tokens and primitives
│   ├── pages/                      # Journal detail and legal/error pages
│   ├── services/                   # Client data services
│   ├── styles/                     # Global and motion styles
│   ├── utils/                      # Validation, formatting and helpers
│   ├── App.tsx                     # Main application composition
│   ├── data.ts                     # Shared canonical content exports
│   ├── index.css                   # Global styles and design tokens
│   └── main.tsx                    # React entry point
├── tests/                          # API security tests
├── tools/
│   ├── c/                           # C metrics utility
│   ├── notebooks/                   # Repository analysis notebook
│   └── python/                      # Portfolio data validator
├── .github/workflows/              # GitHub sync automation
├── .env.example
├── package.json
├── server.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## Setup

### Requirements

- Node.js 20 recommended.
- npm.
- Python 3 for the portfolio data validator.
- GCC only if compiling the optional C metrics utility.
- Firebase applet configuration for backend features that use Firestore.

### Clone and install

```bash
git clone https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio.git
cd Sayam-Mukherjee-Portfolio
npm install
```

### Local environment

```bash
cp .env.example .env
```

Add only the optional values needed for the integrations you intend to run. Do not commit `.env`, private tokens, service-account credentials, or real secrets.

The backend also reads `firebase-applet-config.json` from the project root (or its parent directory) for Firebase project configuration. Use the project-specific configuration supplied for your environment. Do not paste private service-account credentials into frontend code.

### Start development

```bash
npm run dev
```

The Express development server mounts Vite middleware. The default development port is `3000`, configurable through `DEFAULT_APP_PORT` or `PORT` according to `server/config/env.ts`.

## Environment configuration

The checked-in `.env.example` currently documents:

| Variable | Purpose | Required for basic frontend build? |
|---|---|---:|
| `APP_URL` | Canonical application origin | No |

Other runtime values read by `server/config/env.ts` include `PORT`, `DEFAULT_APP_PORT`, `NODE_ENV`, `DISABLE_HMR`, `VERCEL`, and `YOUTUBE_API_KEY`, where applicable.

Firebase applet configuration is read from `firebase-applet-config.json`, not from `.env.example`. Startup diagnostics check for the Firebase project ID and API key when starting the non-serverless server.

**Frontend-only design and animation changes should not introduce mandatory API keys.** Do not add external AI, Resend, SMTP, or other provider requirements unless the change genuinely introduces that backend integration.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Express with Vite middleware |
| `npm run build` | Generate build manifest, build Vite frontend, and bundle Express server |
| `npm run start` | Start bundled production server |
| `npm run lint` | Run `tsc --noEmit` (configured TypeScript check) |
| `npm run preflight` | Run the preflight validation pipeline |
| `npm run sync:github` | Refresh GitHub snapshot JSON files |
| `npm run capture:covers` | Capture live project cover screenshots with Playwright |
| `npm run manifest` | Generate build manifest |
| `npm run validate:data` | Run Python portfolio data validator |
| `npm run build:c` | Compile optional C metrics utility |
| `npm run clean` | Remove generated `dist` output and `server.js` |

## Validation and QA

Run checks relevant to the change:

```bash
npx vitest run
npm run lint
npm run validate:data
npm run build
```

For the broader preflight pipeline:

```bash
npm run preflight
```

Automated Vitest suites in `tests/api.security.test.ts` and `tests/github.telemetry.test.ts` cover API authorization/validation and canonical GitHub telemetry calculation/cross-endpoint consistency.

For UI and motion changes, also verify:

- Keyboard navigation, visible focus, Escape handling, and modal focus restoration.
- `prefers-reduced-motion` behaviour.
- Touch input and coarse-pointer behaviour.
- Mobile widths: 320, 360, 375, 390, 430, and 768 CSS pixels.
- Desktop widths: 1024, 1280, 1440, and 1920 CSS pixels.
- Portrait and landscape orientations.
- No horizontal overflow, overlapping fixed controls, layout shift, or clipped headings.
- All links, forms, menus, modals, and filters have working actions.
- Canvas/WebGL effects do not block content or degrade lower-capability devices.

Do not report a check as passing unless it has been executed and its result inspected.

## Deployment

The repository includes `vercel.json` and `api/index.ts` for the Vercel deployment path. The frontend is built with Vite; the Express application is exposed through the serverless adapter. `server.ts` also supports a conventional Node process and serves production `dist/` output outside serverless mode.

The GitHub Actions workflow `.github/workflows/sync-github.yml` refreshes GitHub telemetry hourly and on manual dispatch. The workflow `.github/workflows/sync-profile.yml` synchronises `github-profile/README.md` to the separate `codesbysayam/codesbysayam` profile repository when that source file changes. It requires a `PROFILE_REPO_TOKEN` repository secret with write access to the profile repository.

Review Vercel project settings, environment variables, and GitHub Actions secrets in their respective dashboards. Never store credentials in this README.

## Security and privacy

- Keep API keys and write-capable tokens on the server or in CI secrets.
- Never put private credentials in `VITE_*` variables or browser-delivered bundles.
- Preserve authentication and rate limiting on administrative and write endpoints.
- Validate incoming payloads with existing schemas.
- Keep Firestore rules and server-side access checks aligned.
- Do not expose private contact submissions or administrative records through public endpoints.
- Do not claim email delivery when the current email service reports `stored_pending_email_config`.
- Respect visitor consent and existing privacy/analytics controls.

## Design direction

The current visual identity uses an editorial olive/ink and warm-paper palette with a signal-lime accent, oversized display typography, monospaced technical labels, authentic project imagery, and restrained transitions.

For future high-motion work, use these references as technique studies:

- **Primary art direction — Lando Norris:** https://landonorris.com/ . Study cinematic storytelling, image composition, large-scale typography, 3D staging, and purposeful transitions. OFF+BRAND's case study identifies WebGL, 3D, Rive, motion design, and performance-conscious responsive work: https://www.itsoffbrand.com/our-work/lando-norris
- **Primary interaction engineering — Active Theory:** https://activetheory.net/ . Study pointer/touch-responsive WebGL and scroll-reactive interaction principles; technical discussion: https://www.commarts.com/webpicks/active-theory-2
- **Secondary 3D craft — Lusion:** https://lusion.co/ . Study interactive 3D visual storytelling and material/depth treatment.

These are references for principles, not assets or layouts to copy. Keep the portfolio's own identity and content. Motion must communicate hierarchy, progress, feedback, or storytelling; do not add effects solely to make the page move.

When changing the codebase:

1. Inspect existing components and reuse them where practical.
2. Keep one shared motion-token system; avoid overlapping animation libraries.
3. Prefer transform/opacity animations and pause offscreen effects.
4. Provide reduced-motion and touch-device fallbacks.
5. Use genuine project screenshots and correct image aspect ratios.
6. Preserve API contracts, data accuracy, and backend behaviour.
7. Update documentation when routes, scripts, endpoints, or configuration change.
8. Run type, data, build, and relevant interaction checks before claiming completion.

## Links

- **Website:** https://sayammukherjee.in
- **GitHub:** https://github.com/codesbysayam
- **LinkedIn:** https://www.linkedin.com/in/sayammukherjee-portfolio/
- **LeetCode:** https://leetcode.com/u/codesbysayam/
- **Codolio:** https://codolio.com/profile/codesbysayam/
- **YouTube:** https://www.youtube.com/@ObsidianOptics_in
- **Business email:** wrickbusiness@gmail.com

---

Maintained alongside the portfolio source repository. Update this document whenever the actual application routes, backend contracts, workflows, or setup requirements change.
