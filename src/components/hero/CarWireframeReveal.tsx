import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

const LENS_SIZE = 300;
const INFO_WIDTH = 340;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type CarWireframeRevealProps = {
  solid: string;
  wireframe: string;
  name: string;
  active?: boolean;
};

/**
 * Renders a car photo with a hidden wireframe/blueprint layer underneath.
 * Hovering reveals the wireframe through a square "lens" that follows the
 * cursor with smooth, lagged motion (gsap tween on a proxy position object),
 * like a magnifying glass moving over the chassis.
 */
export function CarWireframeReveal({
  solid,
  wireframe,
  name,
  active = true,
}: CarWireframeRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wireRef = useRef<HTMLImageElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0, scale: 0, visible: false });
  const tween = useRef<gsap.core.Tween | null>(null);

  const paint = () => {
    const { x, y, scale, visible } = pos.current;
    const currentSize = LENS_SIZE * scale;
    const half = currentSize / 2;

    // Show wireframe & reticle as long as scale > 0 and visible is true
    if (wireRef.current) {
      if (visible && scale > 0.001) {
        const clip = `polygon(${x - half}px ${y - half}px, ${x + half}px ${y - half}px, ${x + half}px ${y + half}px, ${x - half}px ${y + half}px)`;
        wireRef.current.style.visibility = "visible";
        wireRef.current.style.clipPath = clip;
      } else {
        wireRef.current.style.visibility = "hidden";
        wireRef.current.style.clipPath = "none";
      }
    }

    if (lensRef.current) {
      if (visible && scale > 0.001) {
        lensRef.current.style.opacity = "1";
        lensRef.current.style.transform = `translate3d(${x - half}px, ${y - half}px, 0) scale(${scale})`;
      } else {
        lensRef.current.style.opacity = "0";
      }
    }

    if (infoRef.current && containerRef.current) {
      if (visible && scale > 0.001) {
        const maxX = Math.max(
          16,
          containerRef.current.clientWidth - INFO_WIDTH - 16,
        );
        const maxY = Math.max(16, containerRef.current.clientHeight - 52);
        const infoX = clamp(x + 24, 16, maxX);
        const infoY = clamp(y + 24, 16, maxY);

        infoRef.current.style.opacity = `${scale}`;
        infoRef.current.style.transform = `translate3d(${infoX}px, ${infoY}px, 0)`;
      } else {
        infoRef.current.style.opacity = "0";
      }
    }
  };

  const animateTo = (
    target: { x?: number; y?: number; scale?: number },
    opts: { duration?: number; ease?: string } = {},
  ) => {
    tween.current?.kill();
    tween.current = gsap.to(pos.current, {
      ...target,
      duration: opts.duration ?? 0.45,
      ease: opts.ease ?? "power3.inOut",
      onUpdate: paint,
    });
  };

  useEffect(() => {
    paint();
    return () => {
      tween.current?.kill();
    };
  }, []);

  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Clear any existing timeouts or leave animations
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    tween.current?.kill();

    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    pos.current.x = startX;
    pos.current.y = startY;

    // Delay scale-up by 0.5 seconds while cursor rests on element
    enterTimeout.current = setTimeout(() => {
      pos.current.visible = true;
      animateTo({ scale: 1 }, { duration: 0.1 });
    }, 100);
  };

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    // If still shrinking down during mouse leave, continue tracking cursor position
    if (!pos.current.visible && pos.current.scale > 0) {
      animateTo(
        { x: targetX, y: targetY, scale: 0 },
        { duration: 0.35, ease: "power2.in" },
      );
      return;
    }

    // Normal active move tracking
    if (pos.current.visible) {
      animateTo(
        { x: targetX, y: targetY, scale: 1 },
        { duration: 0.3, ease: "power2.out" },
      );
    }
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    if (!active) return;

    // Cancel pending delayed enter if user leaves before 0.5s
    if (enterTimeout.current) clearTimeout(enterTimeout.current);

    const rect = containerRef.current?.getBoundingClientRect();
    const exitX = rect ? event.clientX - rect.left : pos.current.x;
    const exitY = rect ? event.clientY - rect.top : pos.current.y;

    // Scale down to 0 while moving to final exit position
    animateTo(
      { x: exitX, y: exitY, scale: 0 },
      {
        duration: 0.1,
        ease: "power2.in",
        // onComplete: () => {
        //   pos.current.visible = false;
        //   paint();
        // },
      },
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative aspect-video w-full cursor-pointer"
    >
      <img
        src={solid}
        alt={name}
        draggable="false"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      />
      <img
        ref={wireRef}
        src={wireframe}
        alt=""
        draggable="false"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      />
      <div
        ref={infoRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300 z-10"
        style={{ width: "min(90%, 340px)" }}
      >
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-line-strong bg-surface/90 py-1.5 pl-4 pr-1.5 shadow-lg shadow-black/40 backdrop-blur">
          <span className="truncate text-[12.5px] text-muted">
            Analyse the car in real time
          </span>
          <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      {/* Decorative reticle that traces the lens boundary */}
      <div
        ref={lensRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300"
        style={{ width: LENS_SIZE, height: LENS_SIZE }}
      >
        <div className="relative h-full w-full *:border-[#EB6737]">
          <span className="absolute -left-1 -top-1 h-2 w-2 border bg-fg z-10" />
          <span className="absolute -right-1 -top-1 h-2 w-2 border bg-fg z-10" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 border bg-fg z-10" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 border bg-fg z-10" />
          <div className="absolute inset-0 border " />
        </div>
      </div>
    </div>
  );
}
