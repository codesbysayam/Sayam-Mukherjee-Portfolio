# Comprehensive Achievement & Certificate Design Audit

**Date:** 16 October 2026  
**Auditor:** Senior Software Architect & UI/UX Specialist  
**Project:** Sayam Mukherjee Interactive Engineering Portfolio  

---

## 1. Discovered Records Inventory

The repository houses exactly **10 verified achievement, competition, hackathon, workshop, and certificate records** across its primary centralized data sources (`src/data/initialCertificates.ts`, `src/data/siteContent.ts`, and `data_store.json`), alongside supplementary timeline items in `src/data/extendedData.ts`.

| Record ID | Title | Category | Year / Date | Issuer / Organizer | Team / Role | Credential ID | Verification URL |
|---|---|---|---|---|---|---|---|
| `dataforge-2026-memory-in-motion` | DATAFORGE 2026 | COMPETITIONS | 2026 | IIT Kharagpur / Unstop | Team ALGNITE · Team Leader | — | `https://intact-black-0mk1uydx.edgeone.dev/` |
| `gdg-kiit-operon-2026` | Deploy or Die - HowToAlgo × GDG on Campus KIIT | COMPETITIONS | 8–9 Aug 2026 | GDG on Campus KIIT / HowToAlgo | Team NEXUS · Team Member | — | `https://impressive-indigo-lkxz4q1q.edgeone.dev/` |
| `ignithon-2-0-participation-2026` | IGNITHON 2.0 | COMPETITIONS | 26 Sep 2026 | K-1000 / KIIT & KSAC | Team ALGNITE · Team Leader | — | `https://marked-aquamarine-cozz1tva.edgeone.dev/` |
| `wcc-launchpad-30-participation-2026` | WCC Launchpad 30 | COMPETITIONS | 4–5 Oct 2026 | We Code Coders / inkloom | Team ALGNITE · Team Leader | `L30-PTQXNX` | `https://heavy-sapphire-gc08crqu.edgeone.dev/` & `https://wecodecoders.in/verify/L30-PTQXNX` |
| `wcc-launchpad-30-shinibali-kumar` | WCC Launchpad 30 | COMPETITIONS | 4–5 Oct 2026 | We Code Coders / inkloom | Team ALGNITE · Team Member (Recipient: Shinibali Kumar) | `L30-F3RFRC` | `https://wecodecoders.in/verify/L30-F3RFRC` |
| `matlab-workshop-ieee-kiit-2026` | MATLAB Workshop | WORKSHOPS | 25 Sep 2026 | IEEE KIIT / IEEE PES | Sayam Mukherjee (Individual) | — | `https://increased-purple-oeuuxfwu.edgeone.dev/` |
| `comp-toycathon-2021` | National Finalist \| Toycathon | COMPETITIONS | 2021 | Ministry of Education & AICTE, Govt. of India | Finalist (Individual / Collegiate) | `TC-2021-FIN` | Internal verified record |
| `comp-technex-iit-bhu` | Multi-Event Finalist \| Technex'26 | COMPETITIONS | 2026 | IIT (BHU) Varanasi | Finalist across 5/6 events | `TX-2026-IITBHU` | Internal verified record |
| `kiit-grade-report-2025-26` | First-Year Grade Report | ACADEMIC RECORD | 2025–26 | KIIT Deemed to be University | B.Tech CSE (AI & ML) | — | `https://diverse-plum-xc5wzkru.edgeone.dev/` |
| `ach-table-tennis-championship` | Inter-School Table Tennis Champion (3x 1st Position) | ACHIEVEMENTS | 2023 | Inter-School Sports Championship | 3× 1st Position Champion | — | Internal verified record |

---

## 2. Current Data Sources

1. **`src/data/initialCertificates.ts`**:
   - The authoritative TypeScript source for the full certificate archive (`INITIAL_CERTIFICATES: Certificate[]`).
   - Contains all rich metadata: `associatedProjects`, `teamMembers`, `signatories`, `skills`, `tags`, `credentialUrl`, `pdfUrl`, `credentialId`, and `verificationStatus`.
2. **`src/data/siteContent.ts`**:
   - Static mirror array `CERTIFICATES: readonly CertificateContent[]` used across site-wide content feeds.
3. **`data_store.json`**:
   - JSON database backing the Express server's `/api/certificates` endpoint (`server/certificatesStore.ts`).
4. **`src/data/extendedData.ts`**:
   - Legacy timeline items (`EXTENDED_DATA.achievements`) rendered in `src/components/CertificationsSection.tsx`.
5. **Knowledge Bases**:
   - `src/data/portfolioKnowledge.ts`, `src/data/assistantKnowledge.ts`, and `src/utils/portfolioAssistantEngine.ts` consuming verified facts.

---

## 3. Current Rendering Components

1. **`src/components/certificates/CertificateCard.tsx`**:
   - Primary card used in `CertificatesPage.tsx` and `CredentialsHomePreview.tsx`.
2. **`src/components/certificates/CertificatesPage.tsx`**:
   - Full archive page with search input, category tabs, year dropdown, issuer dropdown, sorting, and reactive stats counters.
3. **`src/components/certificates/CredentialsHomePreview.tsx`**:
   - Home-page spotlight section showing 4 featured credentials in a responsive grid.
4. **`src/components/certificates/CertificateViewerModal.tsx`**:
   - Fullscreen modal inspection dialog triggered by clicking "Inspect Record", the card title, or preview banner.
5. **`src/components/CertificationsSection.tsx`**:
   - Home-page vertical timeline rendering legacy items from `extendedData.ts`.

---

## 4. Discovered Visual & Architectural Inconsistencies

### A. Middle Banner & Credential Preview Inconsistency
- In `CertificateCard.tsx`, an `if/else-if` ladder caused drastically different cards:
  - If `imageUrl` existed: rendered an image box.
  - Else if `pdfUrl` existed: rendered a red box saying `"Official PDF Document / Click to view credential details"`.
  - Else if `associatedProjects` or `project` existed: rendered a purple box saying `"Team Projects: AlertSetu · CampusConnect"`.
  - Result: **WCC Launchpad 30** (which had `pdfUrl`) rendered the red PDF box and suppressed its associated project `AXIOM`, while **IGNITHON 2.0** (which lacked `pdfUrl`) rendered the `Team Projects` box. Side-by-side, they appeared to belong to two completely different websites!

### B. Inconsistent Action Button Hierarchy & Counts
- Cards with `fileUrl` (`imageUrl || pdfUrl`) displayed **3 buttons**:
  1. `[View Credential <ExternalLink>]` (primary purple)
  2. `[Inspect Record <Eye>]` (secondary gray)
  3. `[<Download>]` (square icon-only button)
- Cards without `fileUrl` (like IGNITHON 2.0, MATLAB Workshop, DATAFORGE, Deploy or Die) displayed **2 buttons**:
  1. `[View Credential <ExternalLink>]`
  2. `[Inspect Record <Eye>]`
- Cards with no `credentialUrl` (Toycathon, Technex, Table Tennis) displayed:
  1. `[Inspect Record <Eye>]` as primary
  2. (Secondary was omitted)
- Button heights, padding, and layout shifted depending on whether a download link was present.

### C. Inconsistent Metadata Hierarchy & Text Spacing
- Format (`12-Hour Offline Hackathon`), Role (`ALGNITE · Team Leader`), and Recipient badges were rendered as plain stacked text with ad-hoc vertical margins (`mb-1.5`, `mb-3.5`), creating ragged vertical rhythm across adjacent cards in the same row.
- Dates and durations were not standardized: some had durations in format strings, others in descriptions.
- Missing standardized chips/badges for Format, Team, Role, and Category across all cards.

### D. Tags & Content Density Discrepancies
- Tag counts varied from 2 tags to 10+ tags.
- The `+N more` button was styled differently and did not have consistent hover or accessibility behaviors.
- Description preview lengths varied from 1 line to 5 lines without uniform line-clamping, leading to unbalanced card heights in 2-column and 3-column grids.

---

## 5. Missing / Invalid Asset References Audit

1. **Local Certificate Images**:
   - Neither Sayam Mukherjee's nor Shinibali Kumar's WCC Launchpad 30 certificate image exists as a local static file in `public/` or `src/assets/`.
   - Both have verified live URLs:
     - Sayam: EdgeOne document `https://heavy-sapphire-gc08crqu.edgeone.dev/` and We Code Coders `https://wecodecoders.in/verify/L30-PTQXNX`.
     - Shinibali: We Code Coders verification `https://wecodecoders.in/verify/L30-F3RFRC`.
   - No non-existent local file paths must be referenced.
2. **Credential Previews**:
   - Must use a standardized, dignified credential preview card or metadata frame when an image asset is not locally bundled, preserving the same structure across all records.

---

## 6. Action Plan for Phase 3–11 Refactoring

1. **Shared Achievement Type (`src/types/certificates.ts`)**:
   - Ensure backward compatibility while exposing unified fields (`category`, `kind`, `title`, `issuer`, `organizer`, `sponsor`, `format`, `duration`, `date`, `team`, `role`, `recipient`, `associatedProjects`, `credentialUrl`, `pdfUrl`, `downloadUrl`, `tags`).
2. **Refactor Shared Card (`src/components/certificates/CertificateCard.tsx` / `AchievementCard`)**:
   - Unified visual hierarchy:
     1. Eyebrow: Category · Year
     2. Title: Clean event/achievement title
     3. Organizer & Sponsor (formatted cleanly as `Organizer / Sponsor`)
     4. Standardized Metadata strip: Duration, Format, Date, Role, Team (using clean, unboxed text or unified metadata badges)
     5. Associated Project / Credential preview: Unified structured panel with project link & description, never hiding projects due to PDF existence
     6. Description: Balanced clamped preview (2–3 lines) with full text accessible in detail view
     7. Tags: Standardized slice of up to 4 tags with clean overflow indicator
     8. Actions: Standardized button hierarchy (Primary: View Credential / View Details, Secondary: Inspect Record, with consistent heights and mobile responsive stacking)
3. **Standardize Action Bar**:
   - Keep actions strictly consistent: Primary action (`View Credential` or `View Details`), Secondary action (`Inspect Record`), and consistent download handling.
4. **Validate Grid & Responsiveness**:
   - Ensure 1 column on phones (<640px), 2 columns on tablets/desktops (640px–1200px), and clean alignment.
5. **Run Lint, Build, and Regression Tests**.
