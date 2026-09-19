import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  isBrowserLoaded: boolean;
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({
  isBrowserLoaded,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState<number>(0);
  const counterTweenRef = useRef<gsap.core.Tween | null>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create the core timeline but PAUSE it at the point where it waits for the browser
      const tl = gsap.timeline({ paused: true });

      // Wild entry animations
      tl.addLabel("exitSequence").to(containerRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "power4.inOut",
        onComplete,
      });

      masterTimelineRef.current = tl;
      tl.play(); // Play the entry phase

      // --- Counter Logic (Initial fake progress up to 85%) ---
      const counterObj = { value: 0 };
      counterTweenRef.current = gsap.to(counterObj, {
        value: 85,
        duration: 4, // Intentionally slow down to wait for network
        ease: "power1.out",
        onUpdate: () => setCount(Math.floor(counterObj.value)),
      });

      // --- Background Particle Generation ---
      const colors = ["#FF0055", "#00FFCC", "#9900FF", "#FFFF00"];
      for (let i = 0; i < 35; i++) {
        const dot = document.createElement("div");
        dot.className =
          "absolute w-4 h-4 rounded-full pointer-events-none opacity-0";
        dot.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        containerRef.current?.appendChild(dot);

        gsap.fromTo(
          dot,
          {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
            opacity: 1,
          },
          {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 3 + 1,
            opacity: 0,
            duration: Math.random() * 2 + 1,
            repeat: -1, // Keep loops going while waiting
            ease: "power2.out",
            delay: Math.random() * 1,
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  // Watch for the parent component to signal that the browser has finished loading
  useEffect(() => {
    if (isBrowserLoaded && masterTimelineRef.current) {
      // 1. Kill the slow 85% counter tween
      if (counterTweenRef.current) counterTweenRef.current.kill();

      // 2. Instantly burst the counter from its current number up to 100%
      const finalCounter = { value: count };
      gsap.to(finalCounter, {
        value: 100,
        duration: 0.4,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.floor(finalCounter.value)),
        onComplete: () => {
          // 3. Trigger the crazy exit sequence animation
          masterTimelineRef.current?.tweenTo(
            masterTimelineRef.current.duration(),
          );
        },
      });
    }
  }, [isBrowserLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 select-none overflow-hidden"
      style={{ clipPath: "circle(100% at 50% 50%)" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div
        ref={counterRef}
        className="text-8xl font-heading font-bold tracking-widest"
      >
        {count}
      </div>
    </div>
  );
};
