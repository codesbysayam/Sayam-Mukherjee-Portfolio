import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../motion/tokens";

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
 * - No autoplay.
 * - Pointer drag is horizontal; vertical page scrolling remains native.
 * - Only the active and adjacent cards are exposed to keyboard navigation.
 * - Layout is measured with ResizeObserver and adapts to the available width.
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

  const finishPointer = useCallback(() => {
    if (pointerId.current === null) return;

    const threshold = Math.max(42, stageWidth * 0.07);
    if (dragOffset <= -threshold) select(safeIndex + 1);
    else if (dragOffset >= threshold) select(safeIndex - 1);

    setIsDragging(false);
    setDragOffset(0);
    pointerId.current = null;
  }, [dragOffset, safeIndex, select, stageWidth]);

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

    const resistance =
      (safeIndex === 0 && delta > 0) ||
      (safeIndex === items.length - 1 && delta < 0)
        ? 0.28
        : 1;

    setDragOffset(delta * resistance);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    draggedRef.current = false;
  };

  // Measure the stage rather than assuming a desktop card width.
  // ResizeObserver is scoped to this component and cleaned up automatically.
  const setStageNode = useCallback((node: HTMLDivElement | null) => {
    const previous = stageRef.current;
    if (previous && previous !== node) {
      // The observer is owned by the effect below; the ref only tracks the node.
    }
    stageRef.current = node;
  }, []);

  React.useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const update = () => {
      const width = node.getBoundingClientRect().width;
      if (width > 0) setStageWidth(width);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  const step = Math.min(330, Math.max(150, stageWidth * 0.31));

  return (
    <section className={"arc-carousel " + className} aria-label={ariaLabel}>
      <div
        ref={setStageNode}
        className={"arc-carousel__stage" + (isDragging ? " is-dragging" : "")}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onLostPointerCapture={finishPointer}
        onClickCapture={handleClickCapture}
      >
        {items.map((item, index) => {
          const offset = index - safeIndex;
          const visible = Math.abs(offset) <= 2;
          const isActive = index === safeIndex;

          return (
            <motion.article
              key={item.id}
              className="arc-carousel__card"
              aria-label={(index + 1) + " of " + items.length + ": " + item.title}
              aria-hidden={!visible}
              inert={!visible}
              style={{
                x: offset * step + dragOffset,
                y: Math.abs(offset) * 22,
                rotateZ: offset * -5.5,
                scale: Math.max(0.78, 1 - Math.abs(offset) * 0.085),
                opacity: visible ? Math.max(0.28, 1 - Math.abs(offset) * 0.27) : 0,
                zIndex: items.length - Math.abs(offset),
                pointerEvents: visible ? "auto" : "none",
              }}
              animate={{
                x: offset * step + dragOffset,
                y: Math.abs(offset) * 22,
                rotateZ: offset * -5.5,
                scale: Math.max(0.78, 1 - Math.abs(offset) * 0.085),
                opacity: visible ? Math.max(0.28, 1 - Math.abs(offset) * 0.27) : 0,
              }}
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

        <span className="arc-carousel__status" aria-live="polite" aria-atomic="true">
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
