"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VariantToggle } from "@/components/storefront/VariantToggle";
import { useCart } from "@/context/CartContext";
import {
  formatPrice,
  formatVariantLabel,
  getDefaultVariant,
  getProductPrice,
} from "@/lib/products/formatting";
import { getStartingPriceLabel } from "@/lib/products/filter";
import { productImageProps } from "@/lib/products/image-props";
import { getSoldOutReason, isProductSoldOut } from "@/lib/commerce/stock";
import type { Product } from "@/types/product";

type ProductDetailProps = {
  product: Product;
  soldToday?: number;
  relatedProducts?: Product[];
};

export function ProductDetail({
  product,
  soldToday = 0,
  relatedProducts = [],
}: ProductDetailProps) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(getDefaultVariant(product));
  const price = getProductPrice(product, variant);
  const soldOut = isProductSoldOut(product, soldToday);
  const soldOutLabel = getSoldOutReason(product, soldToday);

  return (
    <div>
      <nav className="text-sm text-foreground/60">
        <Link href="/menu" className="hover:text-accent hover:underline">
          Menu
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize text-foreground/80">{product.category}s</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-accent/15 bg-primary/30">
          <Image
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover ${soldOut ? "grayscale-[30%]" : ""}`}
            {...productImageProps(product.image)}
          />
          {soldOut ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-off-white">
                {soldOutLabel}
              </span>
            </span>
          ) : (
            product.tags[0] && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-off-white shadow-sm">
                {product.tags[0]}
              </span>
            )
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {getStartingPriceLabel(product)}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/75">
            {product.description}
          </p>

          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/menu?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-accent/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent transition hover:bg-primary/30"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <VariantToggle
            product={product}
            value={variant}
            onChange={setVariant}
            disabled={soldOut}
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-3xl font-bold text-accent">{formatPrice(price)}</p>
            <button
              type="button"
              onClick={() => addItem(product.id, variant)}
              disabled={soldOut}
              className="flex h-12 min-w-[160px] flex-1 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-off-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-foreground/30 sm:flex-none"
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>

          <p className="mt-4 text-xs text-foreground/50">
            Selected: {formatVariantLabel(product, variant)} · Egg-free · Contains
            dairy · Baked fresh to order
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-accent/15 pt-10">
          <h2 className="font-display text-2xl font-bold text-foreground">
            You may also like
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedProducts.map((related) => (
              <li key={related.id}>
                <Link
                  href={`/menu/${related.id}`}
                  className="flex items-center gap-3 rounded-xl border border-accent/15 bg-off-white p-3 transition hover:border-accent/30 hover:shadow-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-primary/30">
                    <Image
                      alt={related.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      {...productImageProps(related.image)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {related.name}
                    </p>
                    <p className="text-sm text-accent">
                      {getStartingPriceLabel(related)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
