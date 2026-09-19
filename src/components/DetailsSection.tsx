import { Detail, details } from "@/data/details";
import { RevealText } from "./RevealText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function DetailsSection() {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#items",
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
        invalidateOnRefresh: true,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(".card-block", {
      xPercent: -50,
    });
  });
  return (
    <section id="details" className="min-h-screen px-6 py-24 lg:py-28">
      <div className="mx-auto max-w-300">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-line pb-6">
          <RevealText
            as={"h2"}
            className="font-display text-3xl font-medium lg:max-w-1/2 sm:text-4xl"
          >
            SPEED is hidden in the space between what happened and why
          </RevealText>
          <RevealText
            delay={0.2}
            as={"p"}
            className="text-sm text-muted/50 lg:max-w-80"
          >
            Vector turns the noise of a race car into the next clear decision so
            drivers and engineers can find speed while it still matters.
          </RevealText>
        </div>
      </div>
      <div
        id="items"
        className="w-full mx-auto max-w-300 h-screen flex items-center"
      >
        <div className="card-block flex gap-5 md:gap-10 xl:gap-16 flex-nowrap">
          {details.map((detail) => (
            <DetailCard key={detail.title} {...detail} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function DetailCard({ title, description, metrics, image }: Detail) {
  return (
    <div className="w-full min-w-90 md:min-w-120 lg:min-w-150 bg-card/50 backdrop-blur-sm border-white/20 rounded-3xl border-t-2 p-6 pb-16 flex flex-col gap-5">
      <div className="w-full aspect-video relative overflow-hidden rounded-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h3 className="text-2xl font-medium">{title}</h3>
      <p className="text-muted/50 mt-2 text-sm">{description}</p>
      <div className="mt-4">
        {metrics.map(
          (metric: { label: string; value: string }, index: number) => (
            <div key={index} className="text-base flex gap-4">
              <p className="font-heading font-bold text-primary w-full max-w-30">
                {metric.value}
              </p>
              <span className="ms-5 text-muted/70">|</span>
              <p className="font-heading text-muted/70 w-full">
                {metric.label}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
