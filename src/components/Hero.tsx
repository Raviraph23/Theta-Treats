import Image from "next/image";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero-gold-border relative overflow-hidden bg-primary px-4 pb-10 pt-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-accent/10"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-off-white p-2 shadow-lg ring-4 ring-accent/20">
          <Image
            src={SITE.logo}
            alt={`${SITE.name} logo`}
            width={160}
            height={160}
            className="h-36 w-36 rounded-full object-cover sm:h-44 sm:w-44"
            priority
          />
        </div>

        <h1 className="font-brand text-4xl whitespace-nowrap text-foreground sm:text-5xl">
          {SITE.name}
        </h1>
        <p className="mt-4 font-display text-base italic text-accent sm:text-lg">
          {SITE.tagline}
        </p>
        <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-foreground/80 sm:text-base">
          Handcrafted brownies baked fresh with premium ingredients. Rich,
          fudgy, and made with love — one wholesome bite at a time.
        </p>

        <a
          href="#brownies"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-off-white shadow-md transition hover:bg-accent/90 active:scale-[0.98]"
        >
          Shop Brownies
        </a>
      </div>
    </section>
  );
}
