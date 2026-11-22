import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../motion/tokens";
import "./arc-card-carousel.css";

export interface ArcCarouselItem {
  id: string;
  title: string;
}

interface ArcCardCarouselProps<T extends ArcCarouselItem> {
  items: T[];
  renderCard: (item: T, index: number, active: boolean) => ReactNode;
  ariaLabel?: string;
  onActiveChange?: (item: T, index: number) => void;
  className?: string;
}

/**
 * Finite, accessible arc carousel.
 * Native vertical scrolling is preserved; horizontal pointer movement selects slides.
 */
export function ArcCardCarousel<T extends ArcCarouselItem>({
  items,
  renderCard,
  ariaLabel = "Featured items",
  onActiveChange,
  className = "",
}: ArcCardCarouselProps<T>) {
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef(0);
  const pointerId = useRef<number | null>(null);
  const draggedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(900);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const safeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));

  const select = useCallback(
    (nextIndex: number) => {
      if (items.length === 0) return;
      const next = Math.max(0, Math.min(items.length - 1, nextIndex));
      setActiveIndex(next);
      setDragOffset(0);
      const item = items[next];
      if (item) onActiveChange?.(item, next);
    },
    [items, onActiveChange]
  );

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > items.length - 1) {
      setActiveIndex(items.length - 1);
    }
  }, [activeIndex, items.length]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const update = () => {
      const width = node.getBoundingClientRect().width;
      if (width > 0) setStageWidth(width);
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update, { passive: true });
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const finishPointer = useCallback(
    (shouldCommit: boolean) => {
      if (pointerId.current === null) return;

      if (shouldCommit) {
        const threshold = Math.max(42, stageWidth * 0.07);
        if (dragOffset <= -threshold) select(safeIndex + 1);
        else if (dragOffset >= threshold) select(safeIndex - 1);
      }

      setIsDragging(false);
      setDragOffset(0);
      pointerId.current = null;
    },
    [dragOffset, safeIndex, select, stageWidth]
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (items.length < 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointerStartX.current = event.clientX;
    pointerId.current = event.pointerId;
    draggedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return;

    const delta = event.clientX - pointerStartX.current;
    if (Math.abs(delta) > 5) draggedRef.current = true;

    const atFirstAndDraggingRight = safeIndex === 0 && delta > 0;
    const atLastAndDraggingLeft = safeIndex === items.length - 1 && delta < 0;
    const resistance =
      atFirstAndDraggingRight || atLastAndDraggingLeft ? 0.28 : 1;

    setDragOffset(delta * resistance);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(safeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(safeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(items.length - 1);
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    draggedRef.current = false;
  };

  if (items.length === 0) return null;

  const step = Math.min(330, Math.max(150, stageWidth * 0.31));

  return (
    <section className={"arc-carousel " + className} aria-label={ariaLabel}>
      <div
        ref={stageRef}
        className={"arc-carousel__stage" + (isDragging ? " is-dragging" : "")}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => finishPointer(true)}
        onPointerCancel={() => finishPointer(false)}
        onLostPointerCapture={() => finishPointer(false)}
        onClickCapture={handleClickCapture}
      >
        {items.map((item, index) => {
          const offset = index - safeIndex;
          const visible = Math.abs(offset) <= 2;
          const isActive = index === safeIndex;
          const x = offset * step + dragOffset;
          const y = Math.abs(offset) * 22;
          const rotateZ = offset * -5.5;
          const scale = Math.max(0.78, 1 - Math.abs(offset) * 0.085);
          const opacity = visible
            ? Math.max(0.28, 1 - Math.abs(offset) * 0.27)
            : 0;

          return (
            <motion.article
              key={item.id}
              className="arc-carousel__card"
              aria-label={
                index + 1 + " of " + items.length + ": " + item.title
              }
              aria-hidden={!visible}
              inert={!visible}
              style={{
                x,
                y,
                rotateZ,
                scale,
                opacity,
                zIndex: items.length - Math.abs(offset),
                pointerEvents: visible ? "auto" : "none",
              }}
              animate={{ x, y, rotateZ, scale, opacity }}
              transition={{
                duration: reducedMotion || isDragging ? 0 : 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              data-active={isActive ? "true" : "false"}
            >
              {renderCard(item, index, isActive)}
            </motion.article>
          );
        })}
      </div>

      <div className="arc-carousel__controls">
        <button
          type="button"
          onClick={() => select(safeIndex - 1)}
          disabled={safeIndex === 0}
          aria-label="Previous item"
        >
          Previous
        </button>

        <span
          className="arc-carousel__status"
          aria-live="polite"
          aria-atomic="true"
        >
          {safeIndex + 1} / {items.length}
        </span>

        <button
          type="button"
          onClick={() => select(safeIndex + 1)}
          disabled={safeIndex === items.length - 1}
          aria-label="Next item"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default ArcCardCarousel;
