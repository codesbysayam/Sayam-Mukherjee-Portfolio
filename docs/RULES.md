# Engineering Rules & Guidelines — Sayam Mukherjee Portfolio

## 1. Zero Secrets & Security Mandates
1. **Never Expose Credentials to the Client**:
   - Strictly forbidden: `VITE_GEMINI_API_KEY`, `VITE_GITHUB_TOKEN`, `VITE_ADMIN_PASSKEY`, or any `VITE_` secret.
   - Vite `define` or `env` configurations must never inject secrets or backend process variables into the client bundle.
2. **Server-Side Authentication Only**:
   - Admin and owner credentials must only be validated server-side.
   - Authentication tokens must be transmitted in `HttpOnly`, `SameSite=Strict`, `Secure` cookies (`vault_session`).
   - Never store admin tokens or credentials in `localStorage` or `sessionStorage`.
   - Never hardcode default passwords in production code. Environment variables must be required.
3. **No Browser GitHub API Calls**:
   - Visitors' browsers must never directly query `api.github.com`.
   - All GitHub repository and commit signals must flow exclusively through the pre-built snapshot (`/data/github.json`).

---

## 2. Authentic Data & No Simulation
1. **No Fabricated Statistics or "Live Users"**:
   - Never display artificial counters, fake online visitor counts, or fabricated telemetry.
2. **No Fake Contact Confirmations**:
   - The UI must never display "Message sent successfully" unless an actual backend server or email service confirms receipt.
   - If no backend is reachable, direct communication paths (`mailto:`, LinkedIn, GitHub) must be offered.
3. **Verified Projects & Profiles**:
   - Every listed repository, paper, and certification must correspond to authentic, verifiable records.
   - Never generate placeholder external URLs (`example.com`, `javascript:void(0)`, `#`).

---

## 3. TypeScript & React Engineering
1. **Strict Type Safety**:
   - All components, helper functions, and context methods must have explicit TypeScript types.
   - No `any` type escapes unless interfacing with an untyped 3rd-party library.
2. **Component Architecture**:
   - Modular structure: extract shared logic into `src/components/` and `src/hooks/`.
   - Avoid oversized monoliths (>400 lines); split into sub-components.
   - Never mutate state directly in component render bodies.
3. **Render Optimization**:
   - Do NOT track high-frequency mouse moves or window scroll offsets directly in React state. Use CSS variables, `requestAnimationFrame`, or direct DOM updates.
   - Prevent unnecessary re-renders with memoization (`useMemo`, `useCallback`) for expensive operations.

---

## 4. Accessibility & Responsive Engineering
1. **WCAG AA Compliance**:
   - Minimum contrast ratio of 4.5:1 for body text and 3:1 for large display text across both Light and Dark themes.
   - Never use color alone to communicate state or errors.
   - Visible keyboard focus indicators (`focus-visible:ring-2`) on all interactive controls.
2. **Touch Targets & Fluid Layouts**:
   - All interactive buttons, links, and switches must have a minimum hit area of 44×44px on mobile devices.
   - Zero horizontal overflow (`overflow-x: clip` on root containers).
   - Responsive sizing using fluid formulas: `clamp()`, `minmax()`, and CSS Grid/Flexbox.
3. **Motion Sensitivity**:
   - Respect `prefers-reduced-motion` across all Framer Motion and CSS transition elements.

---

## 5. Centralized Link & Asset Integrity
1. **Single Source of Truth**:
   - All internal routes and external destinations must be referenced from `src/config/links.ts`.
   - Canonical domain must be uniformly defined as `https://sayammukherjee.in` in `src/config/seo.ts`.
2. **Image Performance**:
   - Every meaningful `<img>` must have accurate, descriptive `alt` text.
   - Purely decorative visual assets must have `alt=""` and `aria-hidden="true"`.
   - Explicit `width` and `height` (or CSS `aspect-ratio`) to prevent Cumulative Layout Shift (CLS).
   - `loading="lazy"` on all below-the-fold assets; `loading="eager"` only for hero identity imagery.
