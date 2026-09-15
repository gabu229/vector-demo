import { parts } from "@/data/parts";
import { PartCard } from "./PartCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RevealText } from "../RevealText";

gsap.registerPlugin(ScrollTrigger);

export function PartAnalysisSection() {
  useGSAP(() => {
    gsap.from(".partCard", {
      opacity: 0,
      y: 40,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#technology",
        start: "top 50%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <section id="technology" className="px-6 py-24 lg:py-28">
      <div className="mx-auto max-w-350">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <RevealText
            as={"h2"}
            className="font-display text-3xl font-medium text-fg sm:text-4xl"
          >
            Part Analysis
          </RevealText>
          <RevealText
            as={"p"}
            delay={0.25}
            className="text-[12px] tracking-[0.16em] text-muted uppercase"
          >
            Data / Performance / Faster
          </RevealText>
        </div>

        {/* The asymmetrical layout is fully preserved */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start lg:[&>div:nth-child(3n+2)]:translate-y-20">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </section>
  );
}
