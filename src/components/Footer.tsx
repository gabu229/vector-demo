interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerData: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "API", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Brand", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPA", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full min-h-screen antialiased relative z-50 bg-black p-6 pt-12 md:p-16" id="footer">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          {/* Left Column: Logo & Description */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <div className="">
              <a href="/" className="flex items-center gap-2.5">
                <img src="/vector-logo-light.svg" alt="Vector Logo" />
              </a>
            </div>

            {/* Subtext */}
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              AI race engineering for drivers and teams.{" "}
              <br className="hidden sm:inline" />
              Turn complex telemetry into clear insights,{" "}
              <br className="hidden sm:inline" />
              faster decisions and better lap times.
            </p>
          </div>

          {/* Right Columns: Navigation Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerData.map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-sm font-medium text-white">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section Divider & Rights */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 Ownsearch. All rights reserved.</p>
          <p>Designed by Entropy</p>
        </div>
      </div>
    </footer>
  );
}
