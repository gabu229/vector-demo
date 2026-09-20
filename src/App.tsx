import gsap from "gsap";
import ReactLenis, { type LenisRef } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { BrandsRow } from "@/components/brands/BrandsRow";
import { HeroSection } from "@/components/hero/HeroSection";
import { Navbar } from "@/components/layout/Navbar";
import { PartAnalysisSection } from "@/components/part-analysis/PartAnalysisSection";
import { DetailsSection } from "./components/DetailsSection";
import { ShowcaseSection } from "./components/ShowcaseSection";
import { DataSection } from "./components/DataSection";
import { AskSection } from "./components/AskSection";
import { FridaySection } from "./components/FridaySection";
import { CTASection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import { Loader } from "./components/Loader";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  const lenisRef = useRef<LenisRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBrowserLoaded, setIsBrowserLoaded] = useState<boolean>(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );

  useEffect(() => {
    if (document.readyState === "complete") {
      return;
    }
    const handleLoad = () => setIsBrowserLoaded(true);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  // Setup Lenis + GSAP integration
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.on("scroll", ScrollTrigger.update);
    }

    return () => {
      gsap.ticker.remove(update);
      if (lenisInstance) {
        lenisInstance.off("scroll", ScrollTrigger.update);
      }
    };
  }, []);

  // Handle scroll position when loader completes
  useEffect(() => {
    if (!isLoading) {
      // Ensure scroll is at top when content appears
      window.scrollTo(0, 0);

      // Reset Lenis scroll position
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.scrollTo(0, { immediate: true });
      }

      // Give DOM time to render, then refresh ScrollTrigger
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLoading]);

  useGSAP(() => {
    if (isLoading) return;

    // Wait for next frame to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const sections = [
        "#dataSection",
        "#askSection",
        "#fridaySection",
        "#ctaSection",
      ];

      sections.forEach((sectionId) => {
        const element = document.querySelector(sectionId);
        if (!element) {
          console.warn(`Section ${sectionId} not found in DOM`);
          return;
        }

        ScrollTrigger.create({
          trigger: sectionId,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          markers: false, // Set to true for debugging
        });
      });

      // Force recalculation after all pins are created
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.08, duration: 2.5, smoothWheel: true }}
      ref={lenisRef}
    >
      <div className="min-h-screen bg-ink text-fg">
        {isLoading ? (
          <Loader
            isBrowserLoaded={isBrowserLoaded}
            onComplete={() => setIsLoading(false)}
          />
        ) : (
          <>
            <Navbar />
            <main>
              <HeroSection />
              <BrandsRow />
              <PartAnalysisSection />
              <DetailsSection />
              <ShowcaseSection />
              <DataSection />
              <AskSection />
              <FridaySection />
              <CTASection />
              <Footer />
            </main>
          </>
        )}
      </div>
    </ReactLenis>
  );
}

export default App;
