import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type ElementTag = keyof React.JSX.IntrinsicElements;

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
  as?: ElementTag;
  duration?: number;
  delay?: number;
  startTrigger?: string;
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  className = "",
  theme = "light",
  as: Tag = "p",
  duration = 1.5,
  delay = 0,
  startTrigger = "top 75%",
}) => {
  const textRef = useRef<HTMLElement | null>(null);
  const isLight = theme === "light";
  const finalColor = isLight ? "#ffffff" : "#000000";
  const startColor = isLight ? "#000000" : "#ffffff";
  const Component = Tag as React.ElementType;

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      gsap.fromTo(
        el,
        {
          opacity: 0,
          backgroundPosition: "100% 0%",
        },
        {
          opacity: 1,
          backgroundPosition: "0% 0%",
          duration,
          delay,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: el,
            start: startTrigger,
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: textRef },
  );

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        textRef.current = node;
      }}
      className={className}
      style={{
        color: "transparent",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundImage: `linear-gradient(145deg, ${finalColor} 0%, ${finalColor} 50%, #ff6600 60%, ${startColor} 75%, ${startColor} 100%)`,
        backgroundSize: "250% 100%",
        willChange: "background-position, opacity",
      }}
    >
      {children}
    </Component>
  );
};
