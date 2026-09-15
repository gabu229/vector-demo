import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LN4Link } from "../ln-link";

type NavLink = {
  label: string;
  href: string;
};

const links: NavLink[] = [
  { label: "Product", href: "#product" },
  { label: "Technology", href: "#technology" },
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar if scrolling down and scrolled past 50px threshold
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-5 z-50 mx-auto w-full max-w-5xl rounded-full border border-line/60 bg-white/5 backdrop-blur-md transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-5 py-3">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/vector-logo-light.svg" alt="Vector Logo" />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <LN4Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </LN4Link>
          ))}
        </nav>

        <Button className="hidden sm:inline-flex">
          Request Access
          <span aria-hidden>&rsaquo;</span>
        </Button>
      </div>
    </header>
  );
}
