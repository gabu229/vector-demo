import { RevealText } from "./RevealText";

export function AskSection() {
  return (
    <section
      id="askSection"
      className="bg-[#F7F7F4] min-h-screen text-black! px-6 py-24 lg:py-28 relative z-20"
    >
      <div className="mx-auto max-w-300">
        <div className="mb-12 flex flex-col justify-center items-center text-center gap-4 border-b border-line pb-6">
          <RevealText
            as={"h2"}
            theme="dark"
            className="font-display text-3xl font-medium sm:text-4xl"
          >
            Ask. Analyse. Go Faster.
          </RevealText>
          <RevealText
            as={"p"}
            delay={0.2}
            theme="dark"
            className="font-light max-w-2xl"
          >
            Get instant, expert-level answers from your AI race engineer.
            Natural language, Real insight, built on your data.
          </RevealText>
        </div>
        <div className="w-full flex justify-between items-stretch gap-5 md:gap-10">
          {/* Left Column (Will perfectly match the height of the right column) */}
          <div className="w-full max-w-150 relative">
            <div className="absolute inset-0 rounded-xl border border-black/50">
              {/* Your left column content goes here */}
            </div>
          </div>

          {/* Right Column (The master column that sets the height via aspect ratio) */}
          <div className="w-full max-w-120 rounded-xl overflow-hidden aspect-square">
            <img
              src="/assets/details/race-map.png"
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
