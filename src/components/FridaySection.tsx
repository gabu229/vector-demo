import { processes, RaceProcess } from "@/data/race";
import { RevealText } from "./RevealText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FridaySection() {
  useGSAP(() => {
    gsap.fromTo(
      ".f-card",
      {
        x: "-50%",
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        x: "0",
        filter: "blur(0px)",
        ease: "bounce.inOut",
        duration: 1.5,
        stagger: 0.3,
        yoyo: true,
        scrollTrigger: {
          trigger: "#fridaySection",
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  return (
    <section
      id="fridaySection"
      className="min-h-screen px-6 py-24 lg:py-28 flex flex-col justify-center items-center gap-5 lg:gap-16"
    >
      <div className=" max-w-300 flex flex-col justify-center items-center text-center gap-5">
        <RevealText as={"h2"} className="text-3xl font-medium sm:text-4xl">
          From Friday To Flag.
        </RevealText>
        <RevealText
          as={"p"}
          delay={0.2}
          className="font-light max-w-2xl text-muted/70"
        >
          One platform. Every session. maximum insight.
        </RevealText>
      </div>
      <div className="w-full max-w-300 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {processes.map((p: RaceProcess) => (
          <div
            key={p.title}
            className="f-card w-full max-w-120 p-5 rounded-xl md:rounded-3xl border space-y-3 hover:border-primary cursor-cell transition-all duration-500"
          >
            <h2 className="font-display text-lg font-medium sm:text-2xl">
              {p.title}
            </h2>
            <p className="font-light max-w-2xl text-sm">{p.description}</p>
            <img src={p.image} className="w-auto max-w-9/12 h-40 mx-auto" />
            <ul className="list-disc ml-3 marker:text-primary space-y-1">
              {p.steps.map((s) => (
                <li key={s} className="text-sm text-muted/70 font-light">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
