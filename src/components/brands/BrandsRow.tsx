import { brandList } from "@/data/brands";
import { Marquee } from "../shadcn-space/animations/marquee";

export function BrandsRow() {
  return (
    <section
      aria-label="Trusted by"
      className="border-y border-line/70 bg-surface/40 py-10"
    >
      <div className="no-scrollbar mx-auto max-w-350 overflow-hidden">
        <Marquee className="[--duration:20s] p-0" pauseOnHover>
          {brandList.map((brand, index) => (
            <div key={index}>
              <img
                src={brand.image}
                alt={brand.name}
                className="w-36 h-8 mr-6 lg:mr-20 dark:hidden"
              />
              <img
                src={brand.image}
                alt={brand.name}
                className="hidden dark:block w-36 h-8 mr-12 lg:mr-20"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
