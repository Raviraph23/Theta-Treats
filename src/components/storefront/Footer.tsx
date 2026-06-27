import Image from "next/image";
import { SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-accent/15 bg-foreground px-4 py-8 text-off-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <Image
          src={SITE.logo}
          alt={`${SITE.name} logo`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/50"
        />
        <p className="font-brand mt-4 text-xl sm:text-2xl">{SITE.name}</p>
        <p className="mt-2 text-sm italic text-primary">{SITE.tagline}</p>

        <nav className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-off-white/70">
          <a href="#brownies" className="transition hover:text-primary">
            Brownies
          </a>
          <a href="#cookies" className="transition hover:text-primary">
            Cookies
          </a>
          <a href="#instagram" className="transition hover:text-primary">
            Instagram
          </a>
          <a href="#contact" className="transition hover:text-primary">
            Contact
          </a>
        </nav>

        <p className="mt-6 text-xs text-off-white/50">
          © {year} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
