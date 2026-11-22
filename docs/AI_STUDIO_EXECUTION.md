# AI Studio Execution Guide — Portfolio Motion System

This guide supersedes the previous one-shot implementation prompt. Use the phases in order. Do not paste all phases as one request.

**Detailed code recipes:** [docs/MOTION_CODE_RECIPES.md](./MOTION_CODE_RECIPES.md) — scoped GSAP hook, pinned heading, horizontal narrative, stacking cards and Three.js progress bridge.


Repository: https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio
Branch: main
Design specification: ./DESIGN.md

## Why the previous run failed

The previous instruction attempted to implement nine animation families across every route in one pass. That creates too much concurrent work and encourages incomplete placeholder code. This workflow requires one auditable vertical slice at a time.

The repository already contains React 19, TypeScript, Vite, Motion for React, Three.js, a MotionProvider, reduced-motion hooks, Reveal primitives, a procedural Three.js hero sculpture, a scroll-story chapter rail, project filters, a featured-project selector and project card tilt. Preserve them.

The repository currently contains both bun.lock and package-lock.json. Before dependency changes, inspect the scripts and CI workflow to determine the canonical package manager. Do not update only one lockfile if the project requires both.

## Global rules for every phase

- Work on the existing main branch unless the user explicitly requests a feature branch.
- Read DESIGN.md and this file before coding.
- Inspect current files before editing. Never assume line numbers or exports.
- Do not replace App.tsx, route composition, the visual identity or the whole CSS system.
- Preserve all content, project data, filters, links, resume actions, certificates, contact forms, analytics, theme switching and chapter navigation.
- No fake data, fake API calls, placeholder image URLs or invented project metrics.
- Do not install a second motion provider.
- Use Motion for React for component-level transitions.
- Use GSAP ScrollTrigger only for real pinning and scroll-scrub choreography.
- Use the existing Three.js sculpture. Do not create a second renderer.
- One DOM element has one transform owner. Nest wrappers when Motion and GSAP both need transforms.
- All effects must clean up on route change/unmount.
- Respect reduced motion, touch, keyboard, low capability and WebGL failure.
- Do not force pinned horizontal scrolling on mobile.
- Never claim tests passed unless they were run.
- Keep changes small and compile after each phase.

## Required workflow for every phase

1. Inspect the exact files that phase will touch.
2. Explain the implementation plan in no more than 10 bullets.
3. Change only files needed for that phase.
4. Run the repository's real lint/typecheck and build scripts.
5. Fix errors caused by the changes.
6. Summarise changed files and actual test output.
7. Stop and wait for the next phase prompt. Do not continue into later phases automatically.

---

# PHASE 0 — Repository audit only

Paste this first.

~~~text
Read DESIGN.md and docs/AI_STUDIO_EXECUTION.md completely.

Do not edit any files yet.

Audit the current repository and report:
1. Actual package manager and lockfiles.
2. Current route and page composition in App.tsx.
3. Existing MotionProvider, motion tokens and reduced-motion hooks.
4. Existing Three.js hero sculpture lifecycle and fallback.
5. Existing scroll-story chapter navigation.
6. Existing project filtering, featured selection, project card and case-study modal.
7. Existing animation-related CSS and global overflow rules.
8. Existing tests and package scripts.
9. Which of the nine requested animation families already exist in partial form.
10. A minimal ordered implementation plan.

Identify any stale or conflicting examples in DESIGN.md. Do not rewrite the site. Do not install packages. Do not modify code. Return only findings and the proposed file list.
~~~

After Phase 0, review the report. Then continue.

# PHASE 1 — Motion foundation and cleanup

Only implement the shared animation infrastructure. Do not redesign sections yet.

~~~text
Implement PHASE 1 only.

First inspect the current motion files and confirm the package manager. The project already has Motion for React and reduced-motion/device-capability hooks. Reuse them.

If GSAP is required for pinning, install only the gsap package using the repository's canonical package manager. Update the canonical lockfile and any second lockfile only if the repository's own workflow requires it. Do not install Lenis, Framer Motion as a second package, or another smooth-scroll library.

Create a small GSAP integration:
- src/motion/gsap.ts: register ScrollTrigger once and export gsap and ScrollTrigger.
- src/motion/useGsapScope.ts: a React hook that scopes selectors to a root element, creates a gsap.context, accepts an optional cleanup callback, and calls cleanup plus context.revert on unmount.
- src/motion/motion-breakpoints.ts: central constants for desktop pinning and mobile fallback breakpoints, only if no equivalent exists.

Use this exact hook contract, adapting imports to the repository's lint rules:

import { useLayoutEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import { gsap } from "./gsap";

type Setup = (scope: HTMLElement) => void | (() => void);

export function useGsapScope<T extends HTMLElement>(
  setup: Setup,
  dependencies: DependencyList = []
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    let cleanup: void | (() => void);
    const context = gsap.context(() => {
      cleanup = setup(scope);
    }, scope);

    return () => {
      cleanup?.();
      context.revert();
    };
    // Call sites must pass stable dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return scopeRef;
}

Do not use React.DependencyList without importing the type. Do not call hooks conditionally. Do not create animations during render.

Add a small helper for reduced-motion checks only if the existing hooks cannot be used. Do not duplicate the existing MotionProvider or usePrefersReducedMotion.

Do not add animation code to App.tsx in this phase.

Run the actual lint/typecheck and build. Stop after PHASE 1.
~~~

Implementation note: if the repository's TypeScript version rejects the RefObject return type, use the exact inferred return type from useRef rather than forcing a cast. Do not silence TypeScript errors with any.

# PHASE 2 — Arc card carousel and project integration

The project data and filter logic are authoritative. Do not duplicate project content in a new array.

A reusable carousel implementation has been added at:
- src/components/motion/ArcCardCarousel.tsx
- src/components/motion/arc-card-carousel.css

Review it against the current codebase and fix any compiler or accessibility issues before integration. It is a finite carousel: no autoplay and no fake infinite loop.

~~~text
Implement PHASE 2 only.

First inspect:
- src/components/ProjectsShowcase.tsx
- src/components/projects/FeaturedProject.tsx
- src/components/projects/ProjectCard.tsx
- src/data/projects.ts
- src/data/projectMedia.ts
- src/index.css or the actual global stylesheet import chain.

Integrate ArcCardCarousel into the existing Projects section without removing:
- category filters
- technology filters
- search
- featured project selector
- project case-study modal
- project links
- live-demo and GitHub actions
- existing telemetry and data mapping

Use the existing PROJECTS array. Map the existing project object into ArcCarouselItem props at the call site. Do not create a second hardcoded project list.

When the carousel active item changes, update the existing featured-project state through the existing setter or a narrowly scoped callback. Do not introduce a second source of truth for the selected project.

The active project card must use existing ProjectMedia / FeaturedProject data and preserve actual media fallbacks. Adjacent cards may be partially visible but must not expose inaccessible offscreen links.

Add a responsive mobile fallback. On mobile, keep vertical page scrolling native and make the horizontal carousel touch-friendly.

Do not apply a second 3D tilt to cards if the current ProjectCard already owns pointer tilt. Avoid nested transform conflicts.

Run lint/typecheck/build. Test empty items, one item, first/last item, keyboard arrows, pointer cancellation, mobile swipe and reduced motion. Stop after PHASE 2.
~~~

# PHASE 3 — Parallax and pinned editorial headings

~~~text
Implement PHASE 3 only.

Inspect the existing ScrollParallaxLayer in src/motion/Reveal.tsx and the existing section layouts before adding anything. Reuse existing parallax where it already works.

Add only:
1. A three-layer parallax composition to the hero visual, not the entire hero text.
2. One pinned editorial heading in About.
3. One pinned category heading in Skills, only if the layout has enough content height.
4. A normal-flow fallback below the desktop breakpoint and for prefers-reduced-motion.

Use GSAP ScrollTrigger for pinning. Each section owns a local root ref and a scoped GSAP context. Use gsap.matchMedia for desktop and reduced-motion conditions.

For every pinned section:
- pin only the heading wrapper, never the entire page shell;
- reserve layout space correctly;
- set start/end based on measured content;
- use invalidateOnRefresh;
- ensure no transformed ancestor contains the pinned element;
- kill/revert on unmount;
- do not overlap the right-side ScrollStoryThread;
- verify scrolling both down and up.

Do not add a global pin manager. Do not add Lenis. Do not pin on mobile.

Run lint/typecheck/build and test 768px, 1024px, 1280px and 1440px. Stop after PHASE 3.
~~~

# PHASE 4 — Sideways narrative and stacking cards

~~~text
Implement PHASE 4 only.

Add one sideways narrative band in About OR Journal, not both in the same pass. Add one stacking-card sequence in Projects or Certificates.

Horizontal narrative requirements:
- use a measured track width;
- animate only the track transform;
- pin only the local section;
- mobile uses native overflow-x:auto with scroll-snap;
- keyboard users can reach every item;
- reduced motion renders a normal horizontal or vertical layout.

Stacking card requirements:
- finite sequence of real content cards;
- measured card dimensions;
- one active card at a time;
- no inaccessible hidden links;
- enough scroll distance for the complete sequence;
- no nested pinned ancestors;
- normal vertical card list on mobile and reduced motion.

Use the same scoped GSAP context and matchMedia pattern from PHASE 1. Do not copy/paste a new hook into each component.

Run lint/typecheck/build and test fast reverse scrolling, browser resize and mobile fallback. Stop after PHASE 4.
~~~

# PHASE 5 — Focus frame, certificate viewer and sliders

~~~text
Implement PHASE 5 only.

Inspect the existing ProjectCaseStudyModal, CertificateViewerModal, CredentialPreview and all current gallery controls before changing anything.

Reuse the existing modal/viewer infrastructure. Do not create a second modal system.

Add:
- focus-frame transition to the project media preview;
- focus-frame transition to certificate preview;
- reusable horizontal slider for the journal or credential cards where appropriate.

Use Motion layoutId OR GSAP Flip for an individual layout transition, never both on the same element.

A focus viewer must:
- close on Escape;
- return focus to its opener;
- keep focus inside when it is a modal;
- prevent background scroll only while modal is open;
- preserve the image's aspect ratio;
- support loading and broken-image states;
- work without animation under reduced motion.

Slider must:
- support keyboard and touch;
- have visible previous/next controls;
- not autoplay;
- not trap focus;
- not cause page-level horizontal overflow.

Run lint/typecheck/build. Test keyboard, Escape, focus return, touch and reduced motion. Stop after PHASE 5.
~~~

# PHASE 6 — 3D scene scroll choreography

~~~text
Implement PHASE 6 only.

Inspect src/components/motion/HeroOrbitalSculpture.tsx completely before editing.

The component already creates a procedural Three.js sculpture and has capability checks and a static fallback. Extend this component; do not create a second renderer or replace the sculpture with a random external GLB.

Requirements:
- Keep the existing portrait/orbital mode switch.
- Keep the existing static fallback.
- Keep renderer creation and disposal in the component lifecycle.
- Pause animation when the scene is offscreen.
- Pause when document.visibilityState is hidden.
- Respect reduced motion and low device capability.
- Cap device pixel ratio.
- Dispose of renderer, geometries, materials, textures and PMREM resources.
- Do not animate the canvas DOM element to fake model rotation.

If scroll choreography is added, create a small scene controller that accepts normalized progress from 0 to 1 and updates the Three.js group/camera. The GSAP timeline must call that controller through onUpdate. Keep the renderer lifecycle independent from GSAP.

Pin only the hero visual stage on wide desktop screens. Do not pin the whole hero section or overlap hero text, CTA buttons, navigation or chapter rail. Release the pin before About begins.

Mobile and reduced-motion users receive the static sculpture or a restrained non-pinned scene.

Run lint/typecheck/build. Test WebGL unavailable, low capability, reduced motion, route unmount, browser resize and page visibility. Stop after PHASE 6.
~~~

# PHASE 7 — Final distribution, QA and documentation

~~~text
Implement PHASE 7 only.

Audit every route and apply only the motion patterns that genuinely improve the content.

Final allocation:
- Home: pinned 3D stage, layered parallax, kinetic title.
- About: pinned heading, one sideways editorial narrative.
- Projects: arc carousel, one stacking sequence, focus preview.
- Skills: pinned heading and a horizontal technology ribbon.
- Ecosystem: subtle layered parallax.
- GitHub: chart entrance and repository slider.
- Certificates: focus-frame viewer and finite card stack.
- Journal: image parallax and native slider.
- Contact: subtle focus transition and kinetic heading.
- Footer: restrained closing transition.

Do not force every animation family into every route.

Run:
- the actual package manager's lint/typecheck command;
- production build;
- preflight;
- data validation;
- tests if present.

Check viewport widths:
320, 360, 375, 390, 414, 430, 540, 768, 820, 1024, 1280, 1440, 1920 and 2560.

Check:
- no horizontal overflow;
- no clipped text;
- no overlapping pinned scenes;
- no broken navigation;
- no broken project or certificate links;
- no console errors;
- no duplicate WebGL contexts;
- no memory leaks after route changes;
- reduced-motion fallback;
- keyboard navigation;
- touch interactions;
- light and dark themes.

Update README.md with links to DESIGN.md and docs/AI_STUDIO_EXECUTION.md.

Report exactly which tests were executed and their actual results. Do not claim a browser test if no browser was available. Do not claim deployment unless a deployment was actually performed and verified.
~~~

## Important: how to use these prompts

Run Phase 0, review its findings, then Phase 1, and so on. Do not ask AI Studio to run all phases at once. If a phase fails, ask it to fix only that phase before proceeding.

The next phase is not considered started until the current phase compiles and its changed behaviour has been checked.
