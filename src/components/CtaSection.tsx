import { LN4Link } from "./ln-link";
import { RevealText } from "./RevealText";
import { Button } from "./ui/button";

export function CTASection() {
  return (
    <section id="ctaSection" className="min-h-screen px-6 py-24 lg:py-28 relative z-30">
      <div className="mx-auto max-w-300">
        <div className="mb-12 flex flex-col justify-center items-center text-center gap-4 ">
          <RevealText
            as={"h2"}
            className="font-display text-3xl font-medium sm:text-4xl max-w-150"
          >
            The Car Produces data. We Turn It Into Speed.
          </RevealText>
          <RevealText as={"p"} delay={0.2} className="font-light max-w-2xl">
            Same data. A faster tomorrow.
          </RevealText>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg">
              <LN4Link href="#">Request Access</LN4Link>
            </Button>
            <Button size="lg" variant="secondary">
              <LN4Link href="#">Talk to an engineer</LN4Link>
            </Button>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full max-w-120"></div>
        </div>
      </div>
    </section>
  );
}
