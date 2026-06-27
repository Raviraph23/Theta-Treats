import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import { CartButton } from "@/components/storefront/CartButton";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/track", label: "Track" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-accent/20 bg-off-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 overflow-visible sm:gap-3"
        >
          <Image
            src={SITE.logo}
            alt={`${SITE.name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-accent/30 object-cover"
          />
          <div className="flex min-w-0 flex-col justify-center gap-0.5 overflow-visible py-0.5">
            <p className="font-brand pt-0.5 text-lg leading-none text-foreground sm:text-xl">
              {SITE.name}
            </p>
            <p className="truncate text-[10px] leading-snug tracking-wide text-accent sm:text-[11px]">
              {SITE.tagline}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/70 transition hover:bg-primary/30 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
