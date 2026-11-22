# Motion Code Recipes — React + GSAP

These recipes are implementation references for the phased prompts in docs/AI_STUDIO_EXECUTION.md. They assume Phase 1 has installed GSAP and created src/motion/gsap.ts.

Do not copy a recipe into a section until its DOM structure and layout have been inspected. Keep selectors scoped to the component root.

## 1. GSAP registration

File: src/motion/gsap.ts

~~~ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
~~~

Register other plugins only in the components that need them.

## 2. Scoped React hook

File: src/motion/useGsapScope.ts

~~~ts
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
    // Pass stable dependencies from the calling component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return scopeRef;
}
~~~

Usage contract:
- The returned ref must be attached to a stable root element.
- The setup callback must query descendants from that root, not document.
- Return cleanup for observers/listeners created outside GSAP.
- GSAP animations created inside the context are reverted by context.revert().
- Do not call the hook conditionally.

## 3. Pinned heading pattern

Example DOM:

~~~tsx
<section className="pinned-editorial" ref={scopeRef}>
  <div className="pinned-editorial__layout">
    <div className="pinned-editorial__heading" data-pin-heading>
      <p>01 / PRINCIPLES</p>
      <h2>How I approach engineering.</h2>
    </div>
    <div className="pinned-editorial__content" data-pin-content>
      {children}
    </div>
  </div>
</section>
~~~

Component hook:

~~~tsx
import { useGsapScope } from "../../motion/useGsapScope";
import { gsap } from "../../motion/gsap";

export function PinnedEditorialHeading() {
  const scopeRef = useGsapScope<HTMLElement>((scope) => {
    const heading = scope.querySelector<HTMLElement>("[data-pin-heading]");
    const content = scope.querySelector<HTMLElement>("[data-pin-content]");

    if (!heading || !content) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pinDistance = () =>
          Math.max(240, content.scrollHeight - heading.offsetHeight);

        const tween = gsap.to(heading, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top+=96",
            end: () => "+=" + pinDistance(),
            pin: heading,
            pinSpacing: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger?.kill();
      }
    );

    return () => media.revert();
  }, []);

  return (
    <section ref={scopeRef} className="pinned-editorial">
      <div className="pinned-editorial__layout">
        <div className="pinned-editorial__heading" data-pin-heading>
          <p>01 / PRINCIPLES</p>
          <h2>How I approach engineering.</h2>
        </div>
        <div className="pinned-editorial__content" data-pin-content>
          {/* Existing real section content belongs here. */}
        </div>
      </div>
    </section>
  );
}
~~~

The example is a pattern, not a replacement for AboutSection or SkillsSection. Use the real content component and only add the data attributes around the existing markup.

Important:
- If the heading is shorter than the viewport, pinning may be unnecessary.
- Do not pin a parent that contains the chapter navigation.
- Avoid transformed ancestors around the pinned element.
- Keep normal document flow on mobile and reduced motion.

## 4. Horizontal narrative pattern

Example markup:

~~~tsx
<section ref={scopeRef} className="horizontal-story">
  <div className="horizontal-story__viewport">
    <div className="horizontal-story__track" data-horizontal-track>
      {items.map((item) => (
        <article className="horizontal-story__panel" key={item.id}>
          <p>{item.eyebrow}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  </div>
</section>
~~~

GSAP setup:

~~~tsx
import { useGsapScope } from "../../motion/useGsapScope";
import { gsap } from "../../motion/gsap";

export function HorizontalStory({ items }: { items: StoryItem[] }) {
  const scopeRef = useGsapScope<HTMLElement>((scope) => {
    const viewport = scope.querySelector<HTMLElement>(
      ".horizontal-story__viewport"
    );
    const track = scope.querySelector<HTMLElement>(
      "[data-horizontal-track]"
    );

    if (!viewport || !track) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: () => "+=" + Math.max(distance(), 1),
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger?.kill();
      }
    );

    return () => media.revert();
  }, [items.length]);

  return (
    <section ref={scopeRef} className="horizontal-story">
      {/* Render the existing track and panels here. */}
    </section>
  );
}
~~~

Mobile CSS fallback:

~~~css
.horizontal-story__viewport {
  overflow: hidden;
}

.horizontal-story__track {
  display: flex;
  width: max-content;
  gap: clamp(1rem, 3vw, 2rem);
}

.horizontal-story__panel {
  flex: 0 0 min(72vw, 620px);
  min-width: 0;
}

@media (max-width: 899px), (prefers-reduced-motion: reduce) {
  .horizontal-story__viewport {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
  }

  .horizontal-story__track {
    transform: none !important;
  }

  .horizontal-story__panel {
    flex-basis: min(86vw, 620px);
    scroll-snap-align: start;
  }
}
~~~

Use a visible swipe affordance and ensure all panels remain reachable by keyboard. Do not apply the pinned version to mobile.

## 5. Stacking cards pattern

Markup contract:

~~~tsx
<section ref={scopeRef} className="stacking-scene">
  <div className="stacking-scene__stage" data-stack-stage>
    {items.map((item, index) => (
      <article
        className="stacking-scene__card"
        data-stack-card
        key={item.id}
        aria-label={item.title}
      >
        {renderCard(item, index)}
      </article>
    ))}
  </div>
</section>
~~~

GSAP setup:

~~~tsx
import { useGsapScope } from "../../motion/useGsapScope";
import { gsap } from "../../motion/gsap";

export function StackingScene({ items, renderCard }: StackingSceneProps) {
  const scopeRef = useGsapScope<HTMLElement>((scope) => {
    const stage = scope.querySelector<HTMLElement>("[data-stack-stage]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", scope);

    if (!stage || cards.length < 2) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(cards, {
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 0%",
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top+=88",
            end: () => "+=" + Math.max(1, (cards.length - 1) * 380),
            pin: stage,
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          if (index === 0) return;

          timeline.fromTo(
            card,
            { yPercent: 110, scale: 0.96, rotate: 1.5 },
            { yPercent: index * 1.5, scale: 1, rotate: 0, ease: "none" }
          );

          timeline.to(
            cards[index - 1],
            { scale: 0.95, y: -18, opacity: 0.7, ease: "none" },
            "<"
          );
        });

        return () => {
          timeline.scrollTrigger?.kill();
          gsap.set(cards, {
            clearProps: "position,inset,transform,opacity",
          });
        };
      }
    );

    return () => media.revert();
  }, [items.length]);

  return (
    <section ref={scopeRef} className="stacking-scene">
      {/* Render stage and real cards here. */}
    </section>
  );
}
~~~

Do not blindly copy this into a grid with variable-height cards. Measure the stage, define a consistent card-height strategy and ensure content is not clipped. The mobile/reduced-motion layout must switch back to normal vertical flow and must not leave cards absolutely positioned.

Accessibility note: a visual stack must not hide important information from assistive technology. If inactive cards are visually covered, use a clear active-card interaction model with accessible previous/next controls, or use a normal list instead.

## 6. Three.js progress bridge

Keep the renderer and scene lifecycle inside the existing HeroOrbitalSculpture component. The scroll timeline should communicate only normalized progress to the Three.js scene controller.

Controller contract:

~~~ts
export interface HeroSceneController {
  setScrollProgress(progress: number): void;
  setPointerTarget?(x: number, y: number): void;
  dispose(): void;
}
~~~

Timeline bridge:

~~~ts
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: heroRoot,
    start: "top top",
    end: "+=700",
    pin: modelStage,
    scrub: 0.7,
    invalidateOnRefresh: true,
  },
});

timeline.to(
  { progress: 0 },
  {
    progress: 1,
    ease: "none",
    onUpdate() {
      const progress = Number(timeline.progress().toFixed(4));
      sceneController.setScrollProgress(progress);
    },
  }
);
~~~

The real implementation should avoid creating a new object every render and must dispose the controller with the Three.js component. The renderer should pause when offscreen or when the document is hidden. Do not rotate the canvas DOM element as a fake 3D effect.

## 7. Carousel integration contract

The reusable component is:

- src/components/motion/ArcCardCarousel.tsx
- src/components/motion/arc-card-carousel.css

Its item contract is:

~~~ts
export interface ArcCarouselItem {
  id: string;
  title: string;
}
~~~

The parent maps existing project data into this shape and supplies renderCard. Do not create a second static projects array. Connect onActiveChange to the existing featured-project selection state, not a new parallel state variable.

## 8. QA checklist for every animation

- [ ] No console errors.
- [ ] No horizontal page overflow.
- [ ] No overlapping pinned sections.
- [ ] Reverse scrolling works.
- [ ] Resize/orientation changes refresh measurements.
- [ ] Reduced motion renders content without pinning.
- [ ] Mobile uses native scrolling.
- [ ] Keyboard focus is visible.
- [ ] All important content remains accessible.
- [ ] GSAP context reverts on unmount.
- [ ] Three.js resources dispose correctly.
- [ ] Existing links and data remain unchanged.
