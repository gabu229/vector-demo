import { TowerControl } from "lucide-react";
import { RevealText } from "./RevealText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Insight = {
  title: string;
  description: string;
  icon: React.JSX.Element;
};

const insights: Insight[] = [
  {
    title: "Brake 11m later",
    description:
      "You can brake 11m later into turn 7 while maintaining stability",
    icon: <TowerControl />,
  },
  {
    title: "Minimum speed +4.1km/hr",
    description: "Carry more speed through the corner with a later apex.",
    icon: <TowerControl />,
  },
  {
    title: "Estimated gain 0.12s",
    description: "Potential time gain based on current conditions.",
    icon: <TowerControl />,
  },
];

export function DataSection() {
  useGSAP(() => {
    gsap.fromTo(
      ".insight-card",
      {
        y: "50%",
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        // ease: "power2.inOut",
        delay: 0.75,
        duration: 0.5,
        stagger: 0.2,
        yoyo: true,
        scrollTrigger: {
          trigger: "#dataSection",
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      ".img-00",
      {
        // opacity: 0,
        filter: "blur(48px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        // ease: "power2.inOut",
        delay: 1,
        duration: 1,
        scrollTrigger: {
          trigger: "#dataSection",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  return (
    <section
      id="dataSection"
      className="p-6 md:p-16 min-h-screen flex justify-center items-center relative z-0"
    >
      <div className="w-full mx-auto max-w-300 flex flex-col lg:flex-row lg:items-stretch justify-between gap-5 md:gap-10">
        <div className="w-full max-w-130! flex flex-col gap-4 md:gap-10 ">
          <RevealText
            as={"h2"}
            className="font-display text-3xl font-medium sm:text-4xl"
          >
            Data finds <br /> opportunity
          </RevealText>
          <RevealText as={"p"} delay={0.4} className="text-base text-muted/50">
            Vector turns the noise of a race car into the next clear decision so
            drivers and engineers can find speed while it still matters.
          </RevealText>
          <div className="flex flex-col gap-5">
            <p className="text-base text-primary img-00">View insights</p>
            {insights.map((insight: Insight) => (
              <div className="w-full flex gap-5 border border-white/20 p-4 rounded-lg insight-card">
                <div className="w-full aspect-square! flex justify-center items-center text-primary max-w-12 p-3 bg-primary/20 border-primary border rounded-md">
                  {insight.icon}
                </div>
                <div className="w-full flex flex-col justify-between">
                  <h5 className="font-display text-base font-medium">
                    {insight.title}
                  </h5>
                  <p className="text-sm text-muted/50">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full min-h-100 hidden img-00 max-w-140! aspect-3/2.7 relative bg-card/50 backdrop-blur-sm border-white/20 rounded-3xl border-t-2 lg:flex flex-col gap-5 overflow-hidden">
          <div className="w-full absolute top-12 left-12 overflow-hidden rounded-md">
            <img
              src="/assets/details/vector-dashboard-sidebar.png"
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
