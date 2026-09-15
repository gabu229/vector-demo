import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cars } from "@/data/cars";
import { cn } from "@/lib/utils";

import { CarWireframeReveal } from "./CarWireframeReveal";

function signedOffset(index: number, current: number, total: number) {
  let distance = (index - current + total) % total;
  if (distance > total / 2) distance -= total;
  return distance;
}

export function CarCarousel() {
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const blockRef = useRef<HTMLDivElement | null>(null);
  const total = cars.length;

  const go = (dir: number) =>
    setCurrent((currentIndex) => (currentIndex + dir + total) % total);
  const goTo = (index: number) => setCurrent(index);

  useGSAP(() => {
    gsap.to(
      blockRef.current,
      // { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.5 },
    );
    gsap.to(blockRef.current, {
      opacity: 1,
      duration: 1,
      delay: 2,
      filter: "blur(0px)",
    });

    cars.forEach((car, index) => {
      const element = slideRefs.current[car.id];
      if (!element) return;
      const offset = signedOffset(index, current, total);
      const visible = Math.abs(offset) <= 1;

      gsap.fromTo(
        element,
        {
          opacity: 0.5,
          filter: "blur(12px)",
          scale: 0.8,
          zIndex: 10 - Math.abs(offset),
        },
        {
          // delay: 0.5,
          xPercent: offset * 75,
          scale: offset === 0 ? 1 : 0.72,
          opacity: visible ? (offset === 0 ? 1 : 0.4) : 0,
          filter: offset === 0 ? "blur(0px)" : "blur(4px)",
          zIndex: offset === 0 ? 20 : 10 - Math.abs(offset),
          pointerEvents: visible ? "auto" : "none",
          duration: 0.9,
          ease: "power3.inOut",
        },
      );
    });
  }, [current]);

  return (
    <div className="relative">
      <div
        ref={blockRef}
        className="relative mx-auto h-70 max-w-5xl sm:h-85 md:h-100 opacity-0 blur-3xl"
      >
        {cars.map((car, i) => {
          const isActive = i === current;
          return (
            <div
              key={car.id}
              ref={(el) => {
                slideRefs.current[car.id] = el;
              }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ willChange: "transform, opacity" }}
            >
              <button
                type="button"
                aria-label={`Show ${car.name}`}
                onClick={() => !isActive && goTo(i)}
                className={cn(
                  "relative w-full max-w-4xl",
                  !isActive && "cursor-pointer",
                )}
                tabIndex={isActive ? -1 : 0}
              >
                <CarWireframeReveal
                  solid={car.solid}
                  wireframe={car.wireframe}
                  name={car.name}
                  active={isActive}
                />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous car"
        onClick={() => go(-1)}
        className="absolute left-2 sm:left-[20%] top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/70 text-fg/70 backdrop-blur transition-colors hover:border-accent/60 hover:text-fg "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Next car"
        onClick={() => go(1)}
        className="absolute right-2 sm:right-[20%] top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/70 text-fg/70 backdrop-blur transition-colors hover:border-accent/60 hover:text-fg"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-6 hidden items-center justify-center gap-2">
        {cars.map((car, i) => (
          <button
            key={car.id}
            type="button"
            aria-label={`Go to ${car.name}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-accent" : "w-1.5 bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}
