import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product } from "@/types/product";

type BestsellersSectionProps = {
  products: Product[];
  soldToday?: Record<string, number>;
};

export function BestsellersSection({
  products,
  soldToday = {},
}: BestsellersSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id="bestsellers" className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Customer favourites
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            Bestsellers
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
            A taste of what people love most. Explore the full menu for every
            brownie, cookie, and combo.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              soldToday={soldToday[product.id] ?? 0}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-off-white shadow-md transition hover:bg-accent/90 active:scale-[0.98]"
          >
            View full menu
          </Link>
        </div>
      </div>
    </section>
  );
}
