import gsap from "gsap";
// import "lenis/dist/lenis.css";

import ReactLenis, { type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";

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

function App() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // const lenisInstance = lenisRef.current?.lenis;
    // if (lenisInstance) {
    //   lenisInstance.on('scroll', ScrollTrigger.update);
    // }

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.08, duration: 1.5, smoothWheel: true }}
      ref={lenisRef}
    >
      <div className="min-h-screen bg-ink text-fg">
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
      </div>
    </ReactLenis>
  );
}

export default App;
