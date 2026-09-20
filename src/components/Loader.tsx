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
  const numberRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  const [countDisplay, setCountDisplay] = useState<string>("3");
  const [isWaitingForPage, setIsWaitingForPage] = useState<boolean>(false);

  // Core state reference to prevent stale closures
  const isLoadedRef = useRef(isBrowserLoaded);
  useEffect(() => {
    isLoadedRef.current = isBrowserLoaded;
  }, [isBrowserLoaded]);

  // Handle the Realistic 3D Ripple Exit Animation
  const triggerExitAnimation = () => {
    if (!containerRef.current || !filterRef.current || !turbulenceRef.current)
      return;

    // Reset the displacement map scale before starting
    gsap.set(filterRef.current, { attr: { scale: 0 } });

    // 🎛️ RIPPLE TIMING CONTROLS - ADJUST THESE:
    const RIPPLE_DISTORTION_DURATION = 1; // How long the ripple distortion takes ⭐
    const WAVE_ANIMATION_DURATION = 1; // How long the wave turbulence animates ⭐
    const FADE_OUT_DURATION = 0.2; // How long the fade to black takes ⭐
    const FADE_OUT_DELAY = 0.2; // When fade starts (after ripple begins)

    const tl = gsap.timeline({
      onComplete, // Signals isLoading=false to App.tsx
    });

    // 1. Ramp up the displacement scale, creating the ripple distortion
    tl.to(
      filterRef.current,
      {
        attr: { scale: 150 }, // How distorted it gets (higher = more ripple)
        duration: RIPPLE_DISTORTION_DURATION,
        ease: "power2.out",
      },
      0,
    );

    // 2. Animate the 'waves' themselves, making them look turbulent and realistic
    tl.to(
      turbulenceRef.current,
      {
        attr: {
          baseFrequency: 0.015, // Low frequency = large waves
          numOctaves: 4, // Higher complexity for realistic water detail
        },
        duration: WAVE_ANIMATION_DURATION,
        ease: "none",
      },
      0,
    );

    // 3. Fade out the entire container as it warps away
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        filter: "blur(10px)", // Optional blur adds realism
        duration: FADE_OUT_DURATION,
        ease: "power2.inOut",
      },
      FADE_OUT_DELAY,
    );
  };

  // Setup the entry animation and countdown sequence
  useEffect(() => {
    // ⏱️ TIMING CONTROLS - ADJUST THESE VALUES:
    const SCALE_UP_DURATION = 0.1; // How fast number scales in
    const HOLD_DURATION = 0.2; // How long number stays visible ⭐
    const SCALE_DOWN_DURATION = 0.1; // How fast number scales out

    // Total time per number = SCALE_UP + HOLD + SCALE_DOWN
    // Default: 0.4 + 0.6 + 0.4 = 1.4 seconds per number

    const ctx = gsap.context(() => {
      // Helper function for digit animation
      const animateNumberStep = (val: string, startTime: number) => {
        return (
          gsap
            .timeline()
            // Start invisible and scaled down
            .set(numberRef.current, { scale: 0.5, opacity: 0 }, startTime)
            // Change the number BEFORE it becomes visible
            .call(() => setCountDisplay(val), [], startTime)
            // Scale up and fade in
            .to(
              numberRef.current,
              {
                scale: 1,
                opacity: 1,
                duration: SCALE_UP_DURATION,
                ease: "back.out(1.7)",
              },
              startTime,
            )
            // Hold at full visibility
            .to(
              numberRef.current,
              {
                scale: 1,
                opacity: 1,
                duration: HOLD_DURATION,
                ease: "none",
              },
              startTime + SCALE_UP_DURATION,
            )
            // Scale up and fade out
            .to(
              numberRef.current,
              {
                scale: 1.4,
                opacity: 0,
                duration: SCALE_DOWN_DURATION,
                ease: "power2.in",
              },
              startTime + SCALE_UP_DURATION + HOLD_DURATION,
            )
        );
      };

      // Calculate timing for smooth sequential countdown
      const totalDurationPerNumber =
        SCALE_UP_DURATION + HOLD_DURATION + SCALE_DOWN_DURATION;

      // 3-second countdown (3... 2... 1...)
      const countdownTl = gsap.timeline({
        onComplete: () => {
          if (isLoadedRef.current) {
            triggerExitAnimation();
          } else {
            setIsWaitingForPage(true);
          }
        },
      });

      countdownTl
        .add(animateNumberStep("3", 0))
        .add(animateNumberStep("2", totalDurationPerNumber))
        .add(animateNumberStep("1", totalDurationPerNumber * 2));
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Listen for page load while waiting in fallback state
  useEffect(() => {
    if (isBrowserLoaded && isWaitingForPage) {
      triggerExitAnimation();
    }
  }, [isBrowserLoaded, isWaitingForPage]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 select-none overflow-hidden"
      // APPLY THE RIPPLE FILTER TO THE CONTAINER
      style={{ filter: "url(#ripple)" }}
    >
      {/* 1. Grid Pattern Background (makes distortion very visible) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      {/* 2. Main Countdown Display */}
      {!isWaitingForPage ? (
        <div
          ref={numberRef}
          className="text-9xl font-heading font-extrabold tracking-widest text-white z-20"
        >
          {countDisplay}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 z-20 animate-fade-in">
          <svg
            className="w-16 h-16 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg font-medium tracking-widest text-zinc-400 uppercase">
            Loading...
          </span>
        </div>
      )}

      {/* 4. DEFINE THE SVG RIPPLE DISPLACEMENT FILTER */}
      <svg className="hidden">
        <defs>
          <filter id="ripple" colorInterpolationFilters="sRGB">
            {/* a. Create raw noise (turbulence) to define the wave shape */}
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.001" // Starting low (very large waves)
              numOctaves="1" // Starting simple
              seed="1"
              stitchTiles="stitch"
              result="noise"
            />
            {/* b. Distort the original pixels based on the noise map */}
            <feDisplacementMap
              ref={filterRef}
              in="SourceGraphic"
              in2="noise"
              scale="0" // Starting distortion is zero
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
