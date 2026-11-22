# DESIGN.md — Portfolio Motion System

**Repository:** https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio  
**Website:** https://sayammukherjee.in  
**Execution guide:** [docs/AI_STUDIO_EXECUTION.md](./docs/AI_STUDIO_EXECUTION.md)

This document defines the visual and technical target. The phased, copy-paste implementation prompts and code contracts live in docs/AI_STUDIO_EXECUTION.md. That file supersedes any older one-shot prompt or incomplete code example.

## 1. Existing architecture — preserve it

The repository already uses:

- React 19, TypeScript and Vite.
- Motion for React and an existing MotionProvider.
- Existing motion tokens and reduced-motion/device-capability hooks.
- Three.js with a procedural hero sculpture and static fallback.
- Existing Reveal and ScrollParallaxLayer primitives.
- ScrollStoryThread for chapter navigation and scroll progress.
- Existing project data, category/technology filters, featured-project selection, project media, case-study modal and card tilt.

Do not recreate these systems. Extend them.

The repository contains both bun.lock and package-lock.json. Inspect CI and project scripts before deciding the canonical package manager. Keep lockfiles consistent with the actual workflow.

## 2. Visual direction

The portfolio should feel like a carefully art-directed creative engineering experience: editorial typography, architectural depth, deliberate movement and precise interactions.

Preserve the established deep-olive, warm-paper and signal-lime visual identity. Use semantic theme variables rather than introducing a separate colour system.

Motion should support hierarchy and storytelling. Avoid random floating objects, excessive cursor effects, perpetual animation, generic fade-up on every card, fake statistics and autoplay.

## 3. Motion responsibilities

### Motion for React

Use the existing Motion for React integration for:
- component transitions;
- hover and tap feedback;
- staggered reveals;
- layout transitions;
- local card interactions;
- simple scroll-linked transforms.

### GSAP + ScrollTrigger

Add GSAP only for:
- pinned headings;
- pinned hero stage;
- scroll-scrubbed sequences;
- sideways editorial narrative;
- finite stacking-card sequences;
- complex timeline choreography.

Do not add a second smooth-scroll engine. Do not let Motion and GSAP write the same element's transform. Use nested wrappers when both are required.

### Three.js

Extend the existing HeroOrbitalSculpture. Do not create a second renderer. Keep its current procedural sculpture, capability detection and fallback. Add scroll-driven camera/model movement only through an explicit scene controller.

## 4. Required animation families and allocation

| Animation family | Primary placement | Required behaviour |
|---|---|---|
| Arc card carousel | Projects | Curved perspective, drag, snap, keyboard controls, no autoplay |
| Layered parallax | Hero, selected media | Background/midground/foreground depth, restrained travel |
| Pinned 3D model | Hero | Existing Three.js sculpture, scroll-linked scene, clean release |
| Pinned heading | About, Skills | Local heading pin, supporting content progresses alongside |
| Sideways text | About or Journal | One desktop pinned narrative, native mobile horizontal track |
| Stacking cards | Projects or Certificates | Finite cards, clear active state, normal-flow mobile fallback |
| Focus frame | Projects, Certificates | Expand/collapse media, keyboard and focus management |
| Slider | Projects, Journal, Certificates | Touch, keyboard, previous/next, scroll snap |
| Scroll-triggered demo | Selected real projects | Real project evidence only, finite interaction and accessible controls |

Use each animation where it adds meaning. Do not repeat every effect in every section.

## 5. Responsive behaviour

- Desktop: full choreography where it improves the narrative.
- Tablet: shorter pin durations and reduced parallax.
- Mobile: native scrolling, touch-friendly sliders, vertical card stacks and no pinned horizontal narrative.
- Reduced motion: no pinning or large travel; show all content in normal flow.
- Low-capability or WebGL-unavailable: static visual fallback.

## 6. Engineering requirements

- Scope GSAP timelines to component roots and revert on unmount.
- Use gsap.matchMedia for breakpoints and reduced motion.
- Do not pin transformed ancestors or the whole application shell.
- Use measured dimensions rather than hardcoded page widths.
- Avoid layout shifts and horizontal overflow.
- Pause WebGL rendering offscreen and when the document is hidden.
- Dispose GPU resources.
- Do not update React state on every animation frame.
- Preserve all project, certificate, résumé, contact and navigation functionality.
- Never invent project data, metrics, screenshots or live API behaviour.

## 7. Definition of done

The motion system is complete only when:
1. All nine animation families are implemented in appropriate locations.
2. Existing site features and links remain intact.
3. Desktop, tablet and mobile behaviour are verified.
4. Reduced-motion and low-capability fallbacks work.
5. Keyboard and touch interactions work.
6. All GSAP contexts and Three.js resources clean up correctly.
7. Lint/typecheck, build, preflight and data validation results are reported honestly.
8. README links to this file and the phased execution guide.

## 8. References

Use these for interaction research, not for copying assets or exact page layouts:

- https://lusion.co/
- https://activetheory.net/
- https://locomotive.ca/en
- https://www.uncommon.studio/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/Plugins/Flip/
- https://www.framer.com/marketplace/components/arc-card-carousel/
