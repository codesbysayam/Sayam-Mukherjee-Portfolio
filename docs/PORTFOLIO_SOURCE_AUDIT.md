# Portfolio Source Audit & Authenticity Verification

**Author:** AI Studio Engineering  
**Subject:** Sayam Mukherjee Portfolio Repository  
**Audit Date:** October 2026  
**Status:** COMPLETED & VERIFIED  

---

## 1. Executive Summary

This comprehensive source audit evaluated all data sources, external synchronization workflows, runtime server configurations, and public claims in Sayam Mukherjee's engineering portfolio codebase.

### Key Audit Findings:
1. **YouTube Content Creation Section:** Hardcoded synthetic numbers (`12K+ subscribers`, `150K+ combined views`, fake Jan–Jun monthly growth chart) were present in `ContentCreatorSection.tsx`. These did not reflect genuine YouTube Studio records.
2. **GitHub Actions Workflow Mismatch:** An orphaned workflow `.github/workflows/sync-github-data.yml` invoked `node scripts/sync-github-data.mjs`, a file that did not exist in the repository (actual script: `scripts/sync-github.mjs`).
3. **Production Start Script Issue:** `package.json` defined `"start": "node server.ts"`, which fails in production environments lacking runtime TypeScript transpilers. The compiled production bundle is generated at `dist/server.cjs`.
4. **Data Hygiene & Unverified Claims:** `src/data.ts` and `data_store.json` contained an unverified `happyClients: '10'` claim that does not correspond to documented freelance or client contracts.
5. **Resume Canonicalization:** Resume references required strict enforcement of the canonical authoritative target URL `https://exciting-brown-6y14ojmv.edgeone.dev/` and removal of any stale or conflicting datasets.
6. **GitHub Template Attribution Watermark:** The label `"Generated from google-gemini/aistudio-repository-template"` visible under repository language statistics in GitHub's web interface was verified to be a platform-level GitHub template tag, not originating from tracked source files.

---

## 2. Detailed Findings by Area

### A. YouTube Content Creation Metrics
* **Observed Issue:**  
  `src/components/ContentCreatorSection.tsx` contained static mocks claiming 12K+ subscribers, 150K+ views, and a fake monthly `analyticsData` AreaChart that fabricated monthly growth figures (Jan–Jun).
* **Ground Truth Analysis:**  
  The actual verified records exist in `src/data/channels.ts` and `src/data/youtubeAnalytics.ts`:
  * **Obsidian Optics:** Verified YouTube Studio snapshot from **21 October 2026**:
    * Lifetime views: **153,049**
    * Channel subscribers: **1,305**
    * Watch time: **3.5K hours**
    * Period subscribers gained: **+1.1K**
    * Last 48h realtime views: **1,967**
    * Realtime engaged views: **1,200**
  * **Technical AZ:** Historical engineering & tech tutorial channel with 5,800+ recorded subscribers and 250+ technical videos.
  * **Daily Decipher:** Specialized coding and CS concepts archive.
  * **Beastified:** Confirmed deleted / inactive; verified 0 references exist in codebase.
* **Resolution:**  
  Removed synthetic charts and unverified combined claims. Integrated `getCreatorSummary(channels)` utility to accurately portray verified channels and the authentic 21 October 2026 YouTube Studio historical snapshot with explicit disclaimers.

### B. GitHub Actions Workflows
* **Observed Issue:**  
  `.github/workflows/sync-github-data.yml` failed on dispatch with:
  `Cannot find module 'scripts/sync-github-data.mjs'`
* **Resolution:**  
  Audited all workflow files in `.github/workflows/`:
  * Removed duplicate/broken `sync-github-data.yml`
  * Removed duplicate `sync-profile-readme.yml`
  * Standardized on canonical `.github/workflows/sync-github.yml` executing `scripts/sync-github.mjs`
  * Preserved `.github/workflows/sync-profile.yml` for profile README updates

### C. Server Runtime & Build Commands
* **Observed Issue:**  
  `package.json` had `"start": "node server.ts"`. Node.js natively cannot execute raw TypeScript without `--loader` or runtime flags.
* **Resolution:**  
  Updated `"start"` to `"node dist/server.cjs"`, matching the production esbuild output configured in `package.json` `"build"` script.

### D. Data Hygiene
* **Observed Issue:**  
  `src/data.ts` and `data_store.json` contained `happyClients: '10'`.
* **Resolution:**  
  Removed `happyClients` to eliminate unverified client counter claims.

### E. GitHub Template Provenance ("Generated from google-gemini/aistudio-repository-template")
* **Observed Issue:**  
  User screenshot showed the notice: `"Generated from google-gemini/aistudio-repository-template"`.
* **Investigation:**  
  Scanned all files, git commits, and metadata in the repository.
  * **Result:** Zero occurrences in repository files.
  * **Cause:** When a repository is created on GitHub using the "Use this template" button, GitHub permanently attaches metadata in its database linking the repository to the template repository (`google-gemini/aistudio-repository-template`). This badge is rendered by GitHub's web interface underneath the Language breakdown sidebar.
* **Detachment Procedure:**  
  GitHub does not provide a button in repository settings to remove this template badge once created. To remove it completely from GitHub's UI:
  1. Create a brand-new empty GitHub repository (do **not** select "Use a template").
  2. Push the existing repository's commits to the new repository (`git remote set-url origin <new-url>` followed by `git push -u origin main`).
  3. The template watermark will not appear on the new standalone repository.

---

## 3. Audit Compliance Checklist

| Item | Status | Verification Detail |
|---|---|---|
| YouTube Studio Snapshot Authenticity | PASS | 21 Oct 2026 snapshot correctly attributed |
| No Fabricated Monthly Graph | PASS | Fake AreaChart removed; clean metric grid implemented |
| No Beastified references | PASS | 0 matches across full codebase |
| GitHub Workflow Integrity | PASS | `sync-github.yml` executes existing `scripts/sync-github.mjs` |
| Production Start Script | PASS | `node dist/server.cjs` tested and verified |
| Verified Resume Link | PASS | Centralized at `https://exciting-brown-6y14ojmv.edgeone.dev/` |
| No Fake Client Counters | PASS | `happyClients` purged |
| TypeScript & Vite Build | PASS | `tsc --noEmit` & `npm run build` pass cleanly |
