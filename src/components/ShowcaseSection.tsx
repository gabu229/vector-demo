import { useMd } from "@/hooks/use-media-queries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function ShowcaseSection() {
  const isMd = useMd();

  useGSAP(() => {
    const unmaskTimeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: "#showcase",
        start: "top top",
        end: "+=200%",
        scrub: 1.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    unmaskTimeline
      .to(
        ".masked-img-01",
        {
          scale: 1,
          maskSize: isMd ? "400%" : "800%",
          duration: 5,
        },
        0,
      )
      .to(
        "#showcase",
        {
          padding: 0,
          duration: 2,
        },
        4,
      )
      .to(
        ".cc",
        {
          borderRadius: 0,
          height: "100vh",
          duration: 1,
        },
        4.5,
      );
  });

  return (
    <section
      id="showcase"
      className="p-16 min-h-screen cursor-keep-scrolling-light!"
    >
      <div className="bb flex flex-wrap items-center justify-center gap-4">
        <div className="cc w-full h-[80vh] relative overflow-hidden rounded-3xl flex justify-center items-center">
          {/* <img
            src="/assets/details/003.png"
            alt="Det"
            className="w-full h-full object-cover masked-img-01"
            style={{
              maskSize: "150%",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "150%",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
            }}
          /> */}
          <video
            src="/assets/details/ferrari_heatmap.mp4"
            className="w-full h-full object-cover masked-img-01"
            autoPlay
            muted
            loop
            style={{
              maskSize: "150%",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "150%",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
    </section>
  );
}
