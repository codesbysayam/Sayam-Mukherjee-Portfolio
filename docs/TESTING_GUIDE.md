# Testing & Verification Guide | Sayam Mukherjee Portfolio

## 1. Overview of Verification Systems

This project uses a layered testing and quality verification strategy across TypeScript type safety, static data validation, frontend asset compilation, and backend bundle verification.

---

## 2. Available Verification Commands

The following commands are defined in `package.json` and verified in this environment:

### A. TypeScript Type Checking & Syntax Linting
```bash
npm run lint
```
- **Command executed**: `tsc --noEmit`
- **What it verifies**:
  - Full TypeScript type safety across all React components, hooks, services, and `server.ts`.
  - Missing imports, broken interfaces, invalid prop types, or syntax regressions.
- **Pass criteria**: Exits with code `0` and empty/clean output.
- **Frequency**: Run after every atomic file change before starting a new file.

---

### B. Portfolio Data & Schema Validation
```bash
npm run validate:data
```
- **Command executed**: `python3 tools/python/portfolio_data_validator.py`
- **What it verifies**:
  - Validates `data/portfolio_data.json` and metadata against schemas.
  - Verifies project IDs are unique and required fields exist (`id`, `title`, `description`, `tags`).
  - Audits URLs for valid syntax (`http://` or `https://`).
  - Checks for broken references across skills, projects, and experiences.
  - Guards against forbidden placeholder strings.
- **Pass criteria**: Outputs `Validation: PASS` with 0 warnings and 0 errors, exiting with code `0`.
- **Frequency**: Run whenever touching data files in `src/data/` or `data/`.

---

### C. Build Manifest Generation
```bash
npm run manifest
```
- **Command executed**: `node scripts/generate_build_manifest.js`
- **What it verifies**:
  - Generates `public/build-manifest.json` containing build timestamp, commit reference, and asset hashes.
- **Pass criteria**: Clean exit with code `0` and valid JSON generated.

---

### D. Full Production Build Verification
```bash
npm run build
```
- **Command executed**: `node scripts/generate_build_manifest.js && vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs`
- **What it verifies**:
  - Build manifest script completes.
  - Vite transforms all JSX/TSX, CSS (Tailwind v4), images, and fonts into `dist/`.
  - Checks for circular dependencies, broken asset paths, or Vite bundling failures.
  - Bundles the Express backend `server.ts` into a self-contained CommonJS binary at `dist/server.cjs`.
- **Pass criteria**: Build succeeds, output files appear in `dist/`, exiting with code `0`.
- **Frequency**: Run before concluding any multi-file feature or task.

---

### E. C Metrics Tool Compilation (Optional Tooling)
```bash
npm run build:c
```
- **Command executed**: `gcc -O2 tools/c/portfolio_metrics.c -o tools/c/portfolio_metrics`
- **What it verifies**: Verifies that the native C metrics utility compiles cleanly without warnings or errors.

---

## 3. Step-by-Step Testing Procedure for New Features

When developing a new feature or fixing an issue:

1. **Pre-Check**:
   ```bash
   npm run lint
   ```
   Confirm zero existing errors before writing new code.
2. **Atomic Implementation**:
   Edit only the files directly involved in the feature.
3. **Incremental Verification**:
   ```bash
   npm run lint
   ```
   Fix any type mismatches or syntax issues immediately.
4. **Data Validation (if data altered)**:
   ```bash
   npm run validate:data
   ```
5. **Final Production Build**:
   ```bash
   npm run build
   ```
6. **Log Outcome**:
   Record validation status in `docs/IMPLEMENTATION_LOG.md`.
