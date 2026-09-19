import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarCarousel } from "./CarCarousel";
import gsap from "gsap";
import { useRef } from "react";
import { LN4Link } from "../ln-link";
import { useGSAP } from "@gsap/react";
import { RevealText } from "../RevealText";
import { SplitText } from "gsap/all";
import { useMd } from "@/hooks/use-media-queries";

export function HeroSection() {
  const topSectionRef = useRef<HTMLDivElement | null>(null);
  const carSectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const headerBlockRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const isMd = useMd();

  useGSAP(() => {
    const heroSplit = new SplitText(headerRef.current, {
      type: "lines, words, chars",
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char",
    });

    gsap.from(heroSplit.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.03,
      duration: 2,
      ease: "power4.out",
      delay: 0.5,
    });

    gsap.fromTo(
      badgeRef.current,
      {
        opacity: 0.3,
        rotateX: -90,
        duration: 1,
        ease: "power4.out",
        delay: 0.5,
      },
      {
        opacity: 1,
        rotateX: 0,
        duration: 2,
        filter: "blur(0px)",
        ease: "power4.out",
        delay: 0.5,
      },
    );

    if (!topSectionRef.current) return;

    // Create a timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: topSectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Add animations to the timeline
    tl.to(
      headerBlockRef.current,
      {
        y: -50,
        opacity: -4,
        scale: 0.95,
        transformOrigin: "center center",
        ease: "none",
      },
      0,
    )
      .to(
        carSectionRef.current,
        {
          marginTop: "-20%",
          scale: isMd ? 1.6667 : 1.3,
          // transformOrigin: "center center",
          ease: "none",
        },
        0,
      )
      .to(
        ctaRef.current,
        {
          y: isMd ? "100%" : 0,
          // opacity: 0,
          ease: "none",
        },
        0,
      );

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={topSectionRef}
      id="top"
      className="relative overflow-hidden px-6 pt-30 lg:pt-40"
    >
      <div
        ref={headerBlockRef}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center gap-10 md:gap-5"
      >
        <div className="blur-3xl opacity-0" ref={badgeRef}>
          <Badge className="px-4 py-2 bg-white/5 backdrop-blur-3xl">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-primary" />
            AI Race Engineer / Live System
          </Badge>
        </div>
        <h1
          ref={headerRef}
          className="text-[clamp(3rem,9vw,6rem)] font-semibold leading-[0.95] uppercase text-fg"
        >
          Speed
          <br />
          Starts
          <br />
          Here
        </h1>
      </div>

      <div className="relative -mt-5" ref={carSectionRef}>
        <CarCarousel />
      </div>

      <div
        ref={ctaRef}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <RevealText
          as={"p"}
          delay={1}
          className="mt-8 max-w-lg text-balance text-sm leading-relaxed text-muted/70"
        >
          Vector turns the noise of a race car into the next clear decision, so
          drivers and engineers can find speed while it still matters.
        </RevealText>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg">
            <LN4Link href="#">Request Access</LN4Link>
            {/* <span aria-hidden>&rsaquo;</span> */}
          </Button>
          <Button size="lg" variant="secondary">
            <LN4Link href="#">Talk to an engineer</LN4Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
