"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Part } from "@/data/parts";
import { LucideChartNoAxesColumn } from "lucide-react";

type PartCardProps = {
  part: Part;
  isCentered?: boolean;
};

interface ShapedDivProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  isHovered?: boolean;
}

export function ShapedDiv({
  children,
  className,
  borderColor = "#555555",
  borderWidth = 2,
  isHovered = false,
}: ShapedDivProps) {
  const currentBorderColor = isHovered ? "#EB6737" : borderColor;

  return (
    <div className={cn("shaped-wrapper relative", className)}>
      {/* SVG for crisp borders */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 2 }}
      >
        <defs>
          <clipPath id="shape-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.0381,0 L0.962,0 C0.983,0,1,0.0248,1,0.0554 L1,0.8253 C1,0.856,0.983,0.8808,0.962,0.8808 L0.6409,0.8808 C0.6169,0.8808,0.5938,0.8947,0.5768,0.9194 L0.547,0.9628 C0.5307,0.9866,0.5085,1,0.4854,1 L0.0381,1 C0.017,1,0,0.9752,0,0.9446 L0,0.0554 C0,0.0248,0.017,0,0.0381,0 Z" />
          </clipPath>
        </defs>
        <path
          d="M3.81,0 L96.2,0 C98.3,0,100,2.48,100,5.54 L100,82.53 C100,85.6,98.3,88.08,96.2,88.08 L64.09,88.08 C61.69,88.08,59.38,89.47,57.68,91.94 L54.7,96.28 C53.07,98.66,50.85,100,48.54,100 L3.81,100 C1.7,100,0,97.52,0,94.46 L0,5.54 C0,2.48,1.7,0,3.81,0 Z"
          fill="none"
          stroke={currentBorderColor}
          strokeWidth={borderWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Content with clip-path */}
      <div
        className="shaped-content relative w-full h-full"
        style={{
          clipPath: "url(#shape-clip)",
        }}
      >
        {children}
      </div>

      <style>{`
        .shaped-wrapper {
          aspect-ratio: 1.457;
          position: relative;
        }

        .shaped-content {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export function PartCard({ part }: PartCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { title, tag, image, metrics = [], recommendation } = part;

  return (
    <div
      className={`partCard flex flex-col relative cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ShapedDiv
        className={`relative w-full transition-all duration-300 overflow-hidden`}
        borderWidth={2}
        isHovered={isHovered}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-500"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "70%",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />

        {/* Hover Details Overlay */}
        <div
          className={cn(
            "absolute w-full *:max-w-64 text-center inset-0 backdrop-blur-md bg-black/50 transition-opacity duration-300 flex flex-col items-center justify-center p-2 gap-4",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {/* Top section - Title and Tag */}
          <div className="w-full space-y-2">
            <h5 className="text-xl font-bold text-white">{title}</h5>
            <hr className="border-primary" />
          </div>

          {/* Middle section - Metrics */}
          {metrics.length > 0 && (
            <div className="space-y-2 w-full">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{metric.label}</span>
                    <span className="font-mono font-bold">{metric.value}</span>
                  </div>
                </div>
              ))}
              <hr className="border-primary" />
            </div>
          )}

          {/* Bottom section - Recommendation */}
          {recommendation && (
            <div className="w-full flex items-start gap-4">
              <div className="p-1 rounded-xs bg-primary/20">
                <LucideChartNoAxesColumn className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="tracking-wider">Recommendation</span>
                </div>
                <p className="text-sm text-primary">{recommendation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Non-hover state - Just show title at bottom */}
      </ShapedDiv>
      <div className={cn("absolute bottom-0 right-0")}>
        <p className="text-xs space-x-3">
          <span>{title}</span>
          <span>|</span>
          {tag && <span className="text-primary">{tag}</span>}
        </p>
      </div>
    </div>
  );
}
