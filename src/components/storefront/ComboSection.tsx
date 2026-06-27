"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatVariantLabel } from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import type { ResolvedBundle } from "@/lib/commerce/bundles";

type ComboSectionProps = {
  bundles: ResolvedBundle[];
};

export function ComboSection({ bundles }: ComboSectionProps) {
  const { addBundleItems } = useCart();

  if (bundles.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Combo offers
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
          Curated bundles
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-foreground/70">
          Add a full combo to your cart in one tap — great for gifting or trying
          our bestsellers together.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <article
            key={bundle.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-accent/15 bg-off-white shadow-sm"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-primary/30">
              <Image
                alt={bundle.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
                {...productImageProps(bundle.image)}
              />
              <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-off-white">
                {bundle.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {bundle.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">
                {bundle.description}
              </p>

              <ul className="mt-4 space-y-1.5 text-xs text-foreground/60">
                {bundle.items.map((item) => (
                  <li key={`${item.productId}-${item.variant}`}>
                    {item.product.name} ·{" "}
                    {formatVariantLabel(item.product, item.variant)}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-accent">
                  {formatPrice(bundle.totalPrice)}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    addBundleItems(
                      bundle.items.map((item) => ({
                        productId: item.productId,
                        variant: item.variant,
                      })),
                      bundle.name,
                    )
                  }
                  className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-off-white transition hover:bg-foreground/90 active:scale-95"
                >
                  Add combo
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
