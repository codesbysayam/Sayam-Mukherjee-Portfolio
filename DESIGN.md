# DESIGN.md — Portfolio Motion & Interaction System

**Project:** Sayam Mukherjee — Interactive Engineering Portfolio  
**Website:** https://sayammukherjee.in  
**Repository:** https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio  
**Branch:** main

This is the production implementation blueprint for a coordinated motion system across the existing portfolio. It is not a request to replace the website with a template.

---

## 0. Non-negotiable rules

1. Audit the current code before editing.
2. Preserve existing routes, project content, certificate links, résumé links, contact flows, theme switching, GitHub integrations, analytics and accessibility.
3. Extend the existing motion foundation. Do not create a second motion provider.
4. The inspected repository uses React 19, TypeScript, Vite, Express, Motion for React, Three.js and D3.js.
5. GSAP was not listed in the inspected package.json. Add it only for complex scroll choreography that the existing Motion system does not handle cleanly. Update package.json and the active lockfile together.
6. Do not add Lenis or another smooth-scroll engine by default. Preserve native browser scrolling.
7. All requested animation families must be implemented across the site, but not all inside every section. Each section needs a deliberate motion signature.
8. Do not run multiple expensive full-screen WebGL scenes at once.
9. Mobile, reduced-motion, keyboard, touch, low-power and WebGL-unavailable states must remain fully usable.
10. Never claim completion until the rendered routes have been tested.

## 1. Existing repository architecture

Repository: codesbysayam/Sayam-Mukherjee-Portfolio  
Default branch: main

Current stack observed in package.json and source:

- React 19
- TypeScript
- Vite
- Express
- Tailwind CSS 4
- Motion for React
- Three.js
- D3.js
- Recharts

Existing motion foundation:

- src/motion/tokens.ts
- src/motion/motion-tokens.ts
- src/motion/motion-presets.ts
- src/motion/MotionProvider.tsx
- src/motion/Reveal.tsx
- src/styles/motion.css

Existing motion components:

- src/components/motion/ContourBackground.tsx
- src/components/motion/HeroOrbitalSculpture.tsx
- src/components/motion/PointerTrailCanvas.tsx
- src/components/motion/RouteTransition.tsx
- src/components/motion/ScrollStoryThread.tsx
- src/components/motion/ClosingFluidCanvas.tsx

Existing site sections:

- src/components/HeroSection.tsx
- src/components/AboutSection.tsx
- src/components/ProjectsShowcase.tsx
- src/components/SkillsSection.tsx
- src/components/EcosystemSection.tsx
- src/components/GitHubActivityHeatmap.tsx
- src/components/CertificationsSection.tsx
- src/components/BlogsSection.tsx
- src/components/ContactSection.tsx
- src/components/SiteFooter.tsx

These are audit targets, not an assumption that every component is mounted on every route. Confirm imports, exports and route composition before changing them.

## 2. Creative direction

Create a distinctive engineering portfolio that feels editorial, tactile, cinematic and technically credible.

Motion should communicate precision, depth, engineering, exploration, continuity and craft.

Avoid generic template behaviour:
- Identical fade-up cards everywhere.
- Random floating blobs.
- Constant background movement.
- Unrelated rotations.
- Excessive cursor effects.
- Decorative counters without real data.
- Auto-playing carousels that move content away from the visitor.

Preserve the existing deep-olive / warm-paper / signal-lime identity and semantic theme variables.

Existing palette includes:

- Dark background: #1F241D
- Dark raised surface: #252B23
- Deep surface: #171B16
- Warm paper: #F2F1E9
- Dark-mode secondary text: #C1C4B8
- Signal accent: #C7E34A
- Border: #41483B

Do not hardcode new colours independently in each component. Dark and light themes must both remain readable.

Motion timing guidance:

- Micro interaction: 120–220ms
- Interface transition: 220–360ms
- Content reveal: 450–700ms
- Large scene transition: 700–1100ms
- Scroll-scrubbed scenes: driven by scroll progress

Preferred easing:
- UI: cubic-bezier(0.2, 0.7, 0.2, 1)
- Soft reveal: cubic-bezier(0.22, 1, 0.36, 1)
- Editorial: cubic-bezier(0.76, 0, 0.24, 1)

Do not use spring overshoot on every object.

## 3. Motion architecture and ownership

Use three coordinated layers.

### A. Motion for React

Keep the existing Motion for React system for:

- Component entry and exit.
- Layout transitions.
- Modal and viewer transitions.
- Hover and tap feedback.
- Small staggered groups.
- Focus and active states.
- Simple scroll-linked transforms.

Reuse MotionProvider, motion tokens, presets and Reveal components.

### B. GSAP

Use GSAP for:

- ScrollTrigger pinning.
- Scroll-scrubbed timelines.
- Stacking cards.
- Horizontal scroll narratives.
- Pinned headings.
- Sideways typography.
- Focus-frame choreography.
- Complex coordinated scene transitions.

GSAP is not currently listed in the inspected package.json. If the audit confirms it is still absent, install a compatible stable gsap release and update the repository lockfile. Do not add @gsap/react unless the existing architecture benefits from it.

Register only the plugins actually used: ScrollTrigger, Flip, Draggable or Observer. Do not register unused plugins.

### C. Three.js

Keep Three.js for the existing orbital sculpture and one carefully selected interactive 3D stage.

Reuse src/components/motion/HeroOrbitalSculpture.tsx before creating another renderer.

For imported models use optimised GLB assets and GLTFLoader. Dispose of geometries, materials, textures, render targets and renderer on unmount. Cap pixel ratio. Pause rendering when offscreen or when the document is hidden. Provide a static fallback.

### Transform ownership rule

One element must have one primary transform owner at a time.

Do not let Motion and GSAP both write transform, opacity or scale on the same DOM node. If both are required, nest wrappers:

- Outer wrapper: GSAP scroll transform.
- Inner wrapper: Motion hover or local interaction.

Prefer transform and opacity over layout-triggering properties.

## 4. Global GSAP setup

Create:

- src/motion/gsap.ts
- src/motion/useGsapScope.ts

### GSAP registration

~~~ts
// src/motion/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
~~~

Register Flip, Draggable or Observer only inside modules that need them.

### React-safe GSAP scope

~~~ts
// src/motion/useGsapScope.ts
import { useLayoutEffect, useRef } from "react";
import { gsap } from "./gsap";

type Setup = (scope: HTMLElement) => void | (() => void);

export function useGsapScope<T extends HTMLElement>(
  setup: Setup,
  dependencies: React.DependencyList = []
) {
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
    // Provide stable dependencies at call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return scopeRef;
}
~~~

Do not create ScrollTriggers during render. Do not attach untracked global listeners. Always revert the GSAP context on unmount or route change.

## 5. Reduced motion and device policy

Reuse existing hooks:

- usePrefersReducedMotion()
- useDeviceCapability()
- useFinePointer()
- useMotionSettings()

Rules:

- Reduced motion: remove pinning, parallax, auto-rotation and large travel distances. Render complete content in normal document flow.
- Low capability: no real-time 3D, cursor trails or continuous animation. Use static media and short opacity transitions.
- Standard capability: limited parallax, one active scene at a time and reduced 3D pixel ratio.
- High capability: full desktop choreography, but no unnecessary perpetual rendering.
- Coarse pointer: use touch gestures and visible buttons. Never require hover.
- Small screens: prefer native horizontal scrolling over pinned horizontal scenes.

Do not infer device capability from screen width alone.

## 6. Site-wide animation allocation

| Route / section | Main motion | Supporting motion |
|---|---|---|
| Home hero | Pinned 3D model stage | Layered parallax, focus frame, kinetic title |
| About | Pinned heading | Sideways text, narrative layers |
| Projects | Arc card carousel | Stacking cards, project focus frame |
| Skills | Pinned category heading | Horizontal technology slider, scroll demos |
| Ecosystem | Layered parallax | Restrained slider or card arc |
| GitHub | Animated data panels | Card transitions, repository slider |
| Certificates | Focus-frame viewer | Stacked cards, achievement carousel |
| Journal | Sideways editorial track | Image parallax, article focus frame |
| Contact | Focused contact stage | Kinetic typography, subtle depth |
| Footer | Closing transition | Small layered parallax |

Do not repeat the same large effect in adjacent sections.

## 7. Animation 1 — card arc carousel

Primary use: featured projects. Secondary use: selected achievements only if it does not overload the page.

Behaviour:

- Cards sit on a shallow circular arc.
- Active card is visually dominant.
- Neighbour cards remain partially visible.
- Pointer and touch drag move the carousel.
- Release snaps to the nearest card.
- Previous and next buttons are visible.
- Keyboard left/right navigation works.
- Focused cards expose title, summary and links.
- No automatic movement by default.
- Use a finite list; do not fake an infinite loop with inaccessible duplicate slides.

Create:

- src/components/motion/ArcCardCarousel.tsx
- src/components/motion/arc-card-carousel.css

Interaction skeleton:

~~~tsx
import { useRef, useState } from "react";

type ArcItem = {
  id: string;
  title: string;
  image: string;
  href?: string;
};

type Props = {
  items: ArcItem[];
  onSelect?: (index: number) => void;
};

export function ArcCardCarousel({ items, onSelect }: Props) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    setActive(next);
    onSelect?.(next);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = event.clientX;
    deltaX.current = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    deltaX.current = event.clientX - startX.current;
  };

  const finishDrag = () => {
    if (!dragging) return;
    setDragging(false);
    if (deltaX.current < -55) goTo(active + 1);
    if (deltaX.current > 55) goTo(active - 1);
    deltaX.current = 0;
  };

  return (
    <section className="arc-carousel" aria-label="Featured projects">
      <div
        className="arc-carousel__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") goTo(active + 1);
          if (event.key === "ArrowLeft") goTo(active - 1);
        }}
        tabIndex={0}
      >
        {items.map((item, index) => {
          const offset = index - active;
          const angle = offset * 8;
          const x = offset * 150;
          const y = Math.abs(offset) * 22;
          const scale = Math.max(0.76, 1 - Math.abs(offset) * 0.09);
          const opacity = Math.max(0.32, 1 - Math.abs(offset) * 0.22);

          return (
            <article
              key={item.id}
              className="arc-carousel__card"
              aria-current={index === active ? "true" : undefined}
              style={{
                transform:
                  "translate3d(" + x + "px, " + y + "px, 0) " +
                  "rotate(" + angle + "deg) scale(" + scale + ")",
                opacity,
                zIndex: items.length - Math.abs(offset),
                pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
              }}
            >
              <img src={item.image} alt="" loading="lazy" />
              <div className="arc-carousel__caption">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          );
        })}
      </div>

      <div className="arc-carousel__controls">
        <button type="button" onClick={() => goTo(active - 1)}
          disabled={active === 0} aria-label="Previous project">
          Previous
        </button>
        <span aria-live="polite">{active + 1} / {items.length}</span>
        <button type="button" onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1} aria-label="Next project">
          Next
        </button>
      </div>
    </section>
  );
}
~~~

This is an interaction skeleton, not a finished drop-in component. Production implementation must add responsive card geometry, drag resistance, pointer cancellation, focus management, reduced-motion behaviour and a non-drag clickable fallback. Do not use fixed 150px spacing at all viewports; measure the stage and derive spacing.

Keep card text upright where possible. Do not rotate paragraphs.

## 8. Animation 2 — layered parallax

Use for:

- Hero contour background.
- Portrait/media frame.
- Project cover artwork.
- About imagery.
- Ecosystem visual layers.
- Journal media.

Use three depth planes:

1. Background: slowest, low contrast.
2. Midground: moderate movement.
3. Foreground: subtle movement, never obstructing text or controls.

Suggested desktop travel:

- Background: 8–16px.
- Midground: 16–30px.
- Foreground: 24–42px.

Reuse ScrollParallaxLayer from src/motion/Reveal.tsx wherever it already satisfies the requirement.

GSAP scene helper:

~~~ts
import { gsap } from "./gsap";

export function createParallaxScene(root: HTMLElement) {
  const layers = root.querySelectorAll<HTMLElement>("[data-parallax]");

  layers.forEach((layer) => {
    const speed = Number(layer.dataset.parallax || 0.15);

    gsap.to(layer, {
      yPercent: speed * -18,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  });
}
~~~

Keep the helper inside a gsap.context scope so its tweens are reverted. Use parallax only on a small number of visual layers. Never apply it to long paragraphs, navigation controls or every card.

## 9. Animation 3 — pinned / fixed 3D model

Use in the Home hero and one dedicated visual stage only.

The model is pinned within a reserved scene container, not fixed over the entire website indefinitely.

Behaviour:

- The visual stage owns its grid column.
- Model remains anchored during a short narrative scroll range.
- Camera movement is linked to scroll progress.
- Rotation remains subtle.
- Pointer influence is limited to fine-pointer devices.
- Scene releases before the next section.
- Existing portrait/orbital toggle remains functional.

Reuse src/components/motion/HeroOrbitalSculpture.tsx. Do not create another WebGL renderer if the existing scene can be extended.

If a GLB asset is introduced:

- Use GLTFLoader.
- Optimise textures and geometry.
- Use compression only if supported by the asset pipeline.
- Dispose all GPU resources on unmount.
- Cap device pixel ratio.
- Pause rendering when offscreen and when document.visibilityState is hidden.
- Disable expensive shadows on low-capability devices.
- Provide a static fallback.

Pinned stage choreography:

~~~ts
import { gsap } from "./gsap";

export function createPinnedModelStage(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>("[data-model-stage]");
  const model = root.querySelector<HTMLElement>("[data-model-object]");
  const copy = root.querySelectorAll<HTMLElement>("[data-model-copy]");

  if (!stage || !model) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=850",
          pin: stage,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(model, {
          rotateY: 18,
          rotateX: -5,
          scale: 1.06,
          ease: "none",
        }, 0)
        .to(copy, {
          yPercent: -18,
          opacity: 0.3,
          stagger: 0.08,
          ease: "none",
        }, 0.12);

      return () => timeline.scrollTrigger?.kill();
    }
  );

  return () => mm.revert();
}
~~~

The example animates a DOM wrapper. The actual Three.js model must receive timeline progress through a dedicated scene controller that updates camera and model-group transforms. Do not rotate the canvas as a substitute for moving the model.

All important labels, project links and descriptions must remain normal HTML.

## 10. Animation 4 — pinned heading

Use in About, Skills and selected project chapters.

Behaviour:

- Heading remains pinned in its own content column.
- Supporting content progresses beside it.
- It never overlaps the right-side section navigation.
- It releases before the next section.
- Mobile uses normal-flow heading and a short reveal.

~~~ts
import { gsap } from "./gsap";

export function createPinnedHeading(root: HTMLElement) {
  const heading = root.querySelector<HTMLElement>("[data-pinned-heading]");
  const content = root.querySelector<HTMLElement>("[data-pinned-content]");

  if (!heading || !content) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      const tween = gsap.to(heading, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top+=110",
          end: "+=700",
          pin: heading,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }
  );

  return () => mm.revert();
}
~~~

Measure content before selecting the end distance. Prefer default pin spacing. Use pinSpacing false only when the surrounding layout explicitly reserves the required space.

## 11. Animation 5 — sideways text / horizontal narrative

Use for:

- About editorial statement.
- Selected project chapter labels.
- Journal editorial band.
- One skills narrative strip.

Do not turn the entire site into a sideways-scrolling page.

~~~ts
import { gsap } from "./gsap";

export function createSidewaysNarrative(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>("[data-horizontal-track]");
  if (!track) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    () => {
      const distance = () =>
        Math.max(0, track.scrollWidth - root.clientWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }
  );

  return () => mm.revert();
}
~~~

Mobile fallback: native horizontally scrollable track with swipe affordance and keyboard support. Do not pin on small screens.

## 12. Animation 6 — stacking cards

Use for Projects, achievements and selected engineering chapters.

Behaviour:

- Cards enter one after another.
- Each card settles into a stable stack position.
- Previous cards remain visible behind the active card.
- Scroll progress advances the stack.
- Last card releases the pin.
- Content remains readable and selectable.
- The sequence is finite and does not trap scrolling.

~~~ts
import { gsap } from "./gsap";

export function createStackingCards(root: HTMLElement) {
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-stack-card]")
  );

  if (!cards.length) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(cards, {
        transformOrigin: "50% 0%",
        willChange: "transform",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top+=90",
          end: "+=" + (cards.length * 420),
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        timeline.fromTo(
          card,
          { yPercent: 105, rotate: 2.5, scale: 0.94 },
          {
            yPercent: index * 2,
            rotate: 0,
            scale: 1,
            ease: "none",
            duration: 1,
          }
        );

        timeline.to(
          cards[index - 1],
          {
            scale: 0.94,
            y: -24,
            opacity: 0.72,
            ease: "none",
            duration: 1,
          },
          "<"
        );
      });

      return () => {
        timeline.scrollTrigger?.kill();
        gsap.set(cards, {
          clearProps: "transform,opacity,willChange",
        });
      };
    }
  );

  return () => mm.revert();
}
~~~

Production requirements:

- Calculate offsets from measured card dimensions.
- Keep z-index deterministic.
- Do not clip keyboard focus outlines.
- Do not make cards inaccessible behind another card.
- Mobile uses a normal vertical list or user-controlled swipe deck.
- Reserve enough document height for the sequence.

## 13. Animation 7 — focus frame

Use for project covers, certificates and selected media.

Behaviour:

- Media begins inside a framed viewport.
- On scroll or click, the frame expands into a larger presentation area.
- Media keeps its correct aspect ratio.
- Caption and metadata move with the frame.
- Escape, close control or an appropriate outside action exits focus mode.
- Focus returns to the control that opened the overlay.
- A true modal must manage focus and scroll locking.

Use Motion layoutId OR GSAP Flip for a single layout transition, not both on the same element.

Example GSAP Flip interaction:

~~~tsx
import { useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { gsap } from "../../motion/gsap";

export function FocusFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const element = frameRef.current;
    if (!element) return;

    const state = Flip.getState(element);
    setFocused((value) => !value);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.65,
        ease: "power2.inOut",
        nested: true,
      });
    });
  };

  return (
    <div className={focused ? "focus-frame is-focused" : "focus-frame"}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={focused}
      >
        {focused ? "Close preview" : "Focus preview"}
      </button>
      <div ref={frameRef} className="focus-frame__media">
        {children}
      </div>
    </div>
  );
}
~~~

This is a starting pattern, not a complete modal. Add Escape handling, focus return, responsive destination layout, image loading and modal semantics where appropriate.

## 14. Animation 8 — slider

Use for project galleries, journal previews and selected achievements.

Requirements:

- Native touch scrolling.
- Pointer drag only where it improves desktop usability.
- Previous and next controls.
- Keyboard navigation.
- Visible active position.
- Reduced-motion support.
- No forced autoplay.
- No hidden focusable slides.
- Proper image dimensions and loading.
- No horizontal page overflow.

Use CSS scroll snap for the baseline:

~~~css
.motion-slider {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(82vw, 1fr);
  gap: clamp(0.8rem, 2vw, 1.5rem);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--page-gutter);
  scrollbar-width: thin;
  padding: 0 var(--page-gutter) 1rem;
}

.motion-slider > * {
  min-width: 0;
  scroll-snap-align: start;
}

@media (min-width: 900px) {
  .motion-slider {
    grid-auto-columns: minmax(420px, 1fr);
  }
}
~~~

Verify the computed layout in target browsers. Use tested fixed or clamp-based grid-auto-columns if a browser does not support the intended minmax behaviour.

## 15. Animation 9 — scroll-triggered demos

Each major engineering project may have one concise interactive demonstration.

Examples:

- MAUSAM: weather-data layer transition or radar sweep only if real project data supports it.
- SightForge: detection or pose sequence using approved real project media.
- Memory in Motion: memory-state progression based on the actual research model.
- Operon: genuine architecture or data-flow visualisation.
- SayamSolves: small algorithmic progression with accessible step controls.

Rules:

- Do not invent live data.
- Do not imply a demo is connected to a live service unless it is.
- Keep each demo short and finite.
- Provide Play, Pause and Reset where user-triggered animation is appropriate.
- Never autoplay sound.
- Provide a static poster and text explanation.
- Keep the demo below the project title and summary.

## 16. Section-by-section implementation map

### Home / Hero

Inspect:
- src/components/HeroSection.tsx
- src/components/motion/HeroOrbitalSculpture.tsx
- src/components/motion/ContourBackground.tsx
- src/motion/Reveal.tsx

Implement:
1. Word-by-word title reveal.
2. Background contour parallax.
3. Preserve portrait/orbital toggle.
4. Pinned 3D stage on capable desktop only.
5. Focus-frame transition around portrait or visual.
6. Hero exit transition into About.

Do not remove portrait mode. Do not obscure the title, résumé or GitHub actions.

### About

Inspect:
- src/components/AboutSection.tsx
- src/components/about/EngineeringProfile.tsx
- src/components/motion/ScrollStoryThread.tsx

Implement:
1. Pinned editorial heading on desktop.
2. Sideways text band.
3. Parallax media layers.
4. Staggered factual milestones.
5. Clear mobile vertical narrative.

Do not pin the right-side chapter navigation together with the heading.

### Projects

Inspect:
- src/components/ProjectsShowcase.tsx
- src/components/projects/FeaturedProject.tsx
- src/components/projects/ProjectCard.tsx
- src/components/projects/ProjectMedia.tsx
- src/components/projects/ProjectCaseStudyModal.tsx
- src/data/projects.ts
- src/data/projectMedia.ts

Implement:
1. Featured project arc carousel.
2. Stacking case-study cards for a limited selected group.
3. Focus-frame preview.
4. Scroll-triggered project media reveal.
5. Native mobile swipe slider.

Use actual project screenshots and verified project metadata. Preserve repository and live-demo links.

### Skills

Inspect:
- src/components/SkillsSection.tsx
- src/data/skills.ts
- Existing skills subcomponents

Implement:
1. Pinned heading.
2. Sideways technology ribbon.
3. Scroll-triggered category demonstrations.
4. Technology card stagger.
5. Interactive evidence focus frame.

Do not use fake proficiency metrics.

### Ecosystem

Inspect:
- src/components/EcosystemSection.tsx
- src/components/ecosystem/EcosystemPage.tsx

Implement:
1. Layered parallax.
2. Arc carousel only if genuine visual items justify it.
3. Focused activity panels.
4. Scroll transitions between disciplines.

### GitHub

Inspect:
- src/components/GitHubActivityHeatmap.tsx
- src/components/GitHubPulseSummary.tsx
- src/components/GitHubStats.tsx
- src/components/github/

Implement:
1. Chart entrance and data update transitions.
2. Repository card slider.
3. Focused repository panel.
4. Stacked activity panels only where useful.

Never animate fabricated statistics. Use the actual telemetry snapshot.

### Certificates

Inspect:
- src/components/CertificationsSection.tsx
- src/components/certificates/

Implement:
1. Achievement card stack.
2. Focus-frame certificate preview.
3. Full-screen viewer transition.
4. Keyboard-accessible previous/next.
5. Mobile vertical card list.

Preserve existing certificate and résumé URLs.

### Journal

Inspect:
- src/components/BlogsSection.tsx
- src/components/journal/

Implement:
1. Editorial sideways text band.
2. Horizontal article slider.
3. Image parallax.
4. Scroll-triggered article preview.
5. Native mobile swipe.

### Contact and Footer

Inspect:
- src/components/ContactSection.tsx
- src/components/SiteFooter.tsx
- src/components/motion/ClosingFluidCanvas.tsx

Implement:
1. Kinetic heading.
2. Focused contact panel.
3. Subtle background depth.
4. Preserve contact form states.
5. Closing scene transition.

Decorative animation must never delay access to contact information.

## 17. Global CSS and layout rules

Use existing theme tokens and page gutters.

~~~css
.motion-scene {
  position: relative;
  isolation: isolate;
  min-width: 0;
  overflow: clip;
}

.motion-scene__inner {
  width: min(100% - 2 * var(--page-gutter), var(--wide-max));
  margin-inline: auto;
  min-width: 0;
}

.motion-layer {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.motion-pin-stage {
  position: relative;
  min-height: min(82svh, 900px);
  display: grid;
  align-items: center;
}

.motion-focus-frame {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.motion-focus-frame img,
.motion-focus-frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (prefers-reduced-motion: reduce) {
  .motion-layer,
  .motion-focus-frame {
    scroll-behavior: auto;
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
~~~

Do not add overflow hidden to body as a workaround for horizontal overflow. Find and fix the offending element.

Do not place position: fixed controls inside transformed ancestors. Preserve the existing navigation and floating-action layout ownership.

## 18. Responsive behaviour

Test at:

320, 360, 375, 390, 414, 430, 540, 768, 820, 1024, 1280, 1440, 1920 and 2560 CSS pixels.

### Desktop

- Full pinned scenes where they improve the narrative.
- 3D only in selected scene.
- Arc carousel with pointer drag.
- Sideways narrative and stacking cards.
- Respect the right-side section-navigation safe area.

### Tablet

- Reduce parallax distance.
- Reduce arc curvature.
- Use two columns only when measured width supports them.
- Avoid long pin durations.
- Preserve native scrolling.

### Mobile

- No pinned horizontal scroll narrative.
- No fixed 3D model over page content.
- Normal-flow headings.
- Native touch slider.
- Vertical stacking cards.
- Static or low-cost 3D fallback.
- Larger touch targets.
- Keep floating controls clear of bottom navigation and safe areas.
- Account for dynamic viewport height and device safe areas.
- Never rely on hover to reveal content.

## 19. Performance requirements

1. Animate transform and opacity where possible.
2. Avoid continuously animating box-shadow, blur and large filters.
3. Use will-change only during active animation.
4. One active pinned scene at a time.
5. Never run multiple full-screen WebGL loops simultaneously.
6. Pause Three.js rendering when offscreen.
7. Pause rendering when document.visibilityState is hidden.
8. Cap pixel ratio.
9. Lazy-load 3D code and media.
10. Reserve image dimensions to prevent layout shift.
11. Do not preload every project image.
12. Avoid React state updates on every pointermove or animation frame.
13. Use refs and motion values for frame-level changes.
14. Avoid recreating observers on every render.
15. Clean up all observers, timelines, triggers and listeners.
16. Refresh ScrollTrigger after fonts and layout-critical images settle.
17. Avoid scroll-jacking.
18. No infinite auto-playing carousel.
19. Respect reduced motion.
20. Keep content usable if JavaScript or WebGL fails.

## 20. Accessibility

- Use semantic section, article, nav and button elements.
- Carousel controls have accessible names.
- Keyboard users can navigate and select every card.
- Focus remains visible.
- Hidden slides do not expose inaccessible duplicate content.
- Pinned sections never trap keyboard or screen-reader users.
- Reduced-motion users receive all content without motion dependencies.
- Project images have meaningful alt text.
- 3D visuals have equivalent HTML descriptions.
- Do not use colour alone for active state.
- Escape closes focus overlays and modal viewers.
- Return focus to the control that opened an overlay.

## 21. ScrollTrigger stability checklist

For every pinned animation:

- Scope the trigger to its local section.
- Use gsap.matchMedia for breakpoint and reduced-motion variants.
- Use invalidateOnRefresh when dimensions are dynamic.
- Use anticipatePin only when needed.
- Avoid nested pins unless specifically tested.
- Avoid transformed ancestors around fixed navigation.
- Never pin the same element twice.
- Create triggers in document order.
- Match end distance to actual content length.
- Refresh after fonts and important media load.
- Revert triggers on route changes.
- Test browser back/forward navigation.
- Test resize and orientation changes.
- Test fast scroll in both directions.
- Test asynchronous content loading.

## 22. Implementation sequence

Do not implement all effects in one unverified pass.

### Phase 1 — audit

- Inspect App.tsx and route composition.
- Inspect existing motion provider and tokens.
- Inspect Reveal components.
- Inspect all section components.
- Inspect Three.js lifecycle.
- Identify duplicate listeners, observers and animation engines.
- Record current behaviour before editing.

### Phase 2 — motion foundation

- Add GSAP only if needed.
- Add central GSAP registration.
- Add React-safe scope hook.
- Extend existing motion tokens.
- Add reduced-motion and capability fallbacks.
- Define z-index and transform ownership.

### Phase 3 — signature interactions

Implement and test individually:

1. Arc card carousel.
2. Layered parallax.
3. Pinned 3D model.
4. Pinned heading.
5. Sideways narrative.
6. Stacking cards.
7. Focus frame.
8. Native slider.
9. Scroll-triggered project demos.

### Phase 4 — distribute across routes

Apply the approved motion allocation. Do not put every effect in every section.

### Phase 5 — responsive and accessibility

Test all viewport widths, touch, keyboard, reduced motion, low capability and WebGL fallback.

### Phase 6 — production validation

Run the actual repository scripts:

- bun run lint
- bun run build
- bun run preflight
- bun run validate:data

If a command is unavailable, report that accurately. Do not claim it passed.

Inspect the rendered site after build. Confirm all routes still work.

## 23. Google AI Studio master implementation prompt

~~~text
You are modifying the existing Sayam Mukherjee portfolio repository.

Repository:
https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio

Website:
https://sayammukherjee.in

Read the entire root DESIGN.md before changing anything.

Implement the complete portfolio motion and interaction system described in DESIGN.md.

Do not create a new website.
Do not replace the existing project with a template.
Do not remove routes, project data, certificate links, résumé links, contact forms, theme switching, GitHub features or navigation.
Do not perform cosmetic-only edits.
Do not fabricate content or external data.

First inspect the current repository and report:
1. Existing architecture.
2. Existing motion components.
3. Existing dependencies.
4. Existing section components.
5. Which requested animations already exist.
6. Which animations need implementation.
7. Which files will be modified.
8. Whether GSAP must be added.

Use existing Motion for React for component transitions.
Use GSAP ScrollTrigger only for complex pinned and scroll-scrubbed choreography.
Use the existing Three.js sculpture for the pinned 3D experience.
Do not add a second animation provider.
Do not add another smooth-scroll engine.
Do not let two libraries control the same element transform.

Implement all nine interaction families:
- Arc card carousel
- Layered parallax
- Pinned 3D model
- Pinned heading
- Sideways text narrative
- Stacking cards
- Focus frame
- Slider
- Scroll-triggered project demonstrations

Distribute them across Home, About, Projects, Skills, Ecosystem, GitHub, Certificates, Journal, Contact and Footer according to DESIGN.md.

Desktop may use pinned scenes and scroll-scrubbed timelines.
Tablet must use shorter, lighter choreography.
Mobile must use native scrolling, touch-friendly sliders and vertical layouts. Never force pinned horizontal scrolling on mobile.

Preserve the deep olive, warm paper and signal-lime identity.
Keep existing theme tokens.
Make dark and light themes readable.

Every animation must:
- Have deterministic cleanup.
- Respect prefers-reduced-motion.
- Have low-capability fallbacks.
- Avoid layout shifts.
- Avoid horizontal overflow.
- Work with keyboard and touch.
- Pause expensive scenes when offscreen.
- Avoid unnecessary continuous rendering.

After implementation:
1. Run typecheck/lint.
2. Run production build.
3. Run preflight and data validation.
4. Test all routes.
5. Test 320px through 2560px widths.
6. Test reduced motion.
7. Test WebGL fallback.
8. Test fast scrolling and resize.
9. Fix all errors.
10. Update README.md with the motion architecture and a link to DESIGN.md.

Do not say complete if only the hero changed.
Do not say complete if animations are CSS placeholders.
Do not claim tests passed without executing them.
Provide a file-by-file change report and actual test results.
~~~

## 24. GitHub delivery

Keep this file at the repository root as DESIGN.md.

Update README.md with:
- A link to DESIGN.md.
- Motion architecture summary.
- Motion for React / GSAP / Three.js responsibilities.
- Reduced-motion behaviour.
- Responsive motion strategy.
- Setup and validation commands.

Do not commit build output, secrets, environment files or temporary assets.

Suggested commit message:

~~~text
docs: add portfolio-wide motion and interaction design system
~~~

## 25. Inspiration and technical references

These are references for interaction principles and implementation research, not assets or code to copy verbatim.

- Lusion — https://lusion.co/
- Active Theory — https://activetheory.net/
- Locomotive — https://locomotive.ca/en
- Uncommon Studio — https://www.uncommon.studio/
- Aether — https://aether1.ai/
- The Spark — https://www.thespark.org.in/
- GSAP ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP Flip — https://gsap.com/docs/v3/Plugins/Flip/
- GSAP Observer — https://gsap.com/docs/v3/Plugins/Observer/
- Locomotive Scroll — https://scroll.locomotive.ca/
- Arc Card Carousel — https://www.framer.com/marketplace/components/arc-card-carousel/

Study the motion principles and create original interactions for this portfolio. Do not copy protected brand assets, source code, proprietary 3D models or exact page compositions.

---

## Definition of done

The motion system is complete only when:

- Every major route has a deliberate motion signature.
- All nine requested interaction families are implemented in appropriate locations.
- The hero has a working, performant 3D stage and proper fallback.
- Projects have a functional arc carousel and stacking presentation.
- About and selected editorial sections use pinned and sideways storytelling.
- Skills and project demos respond to scroll without inventing live data.
- Certificates have a usable focus-frame viewer.
- Mobile uses native, accessible interactions rather than broken desktop effects.
- Reduced motion is respected.
- No existing portfolio feature or link is broken.
- Build, lint and validation results are reported honestly.
- README.md links to this specification.
