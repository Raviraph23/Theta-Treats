"use client";

import Image from "next/image";
import { SITE } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount, openCart } = useCart();

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
            priority
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

        <button
          type="button"
          onClick={openCart}
          className="relative flex h-11 min-w-11 items-center justify-center rounded-full bg-accent px-4 text-off-white transition active:scale-95"
          aria-label={`Open cart, ${itemCount} items`}
        >
          <CartIcon />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-bold text-off-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
