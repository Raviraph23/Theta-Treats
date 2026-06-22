import Image from "next/image";
import { SITE } from "@/lib/constants";
import { CartButton } from "@/components/storefront/CartButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-accent/20 bg-off-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5">
        <a
          href="#"
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
        </a>

        <CartButton />
      </div>
    </header>
  );
}
