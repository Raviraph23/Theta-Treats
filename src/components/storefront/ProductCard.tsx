"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  formatPrice,
  getDefaultVariant,
  getProductPrice,
} from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import { getSoldOutReason, isProductSoldOut } from "@/lib/commerce/stock";
import type { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { VariantToggle } from "@/components/storefront/VariantToggle";

type ProductCardProps = {
  product: Product;
  soldToday?: number;
};

export function ProductCard({ product, soldToday = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState<ProductVariant>(
    getDefaultVariant(product),
  );
  const price = getProductPrice(product, variant);
  const soldOut = isProductSoldOut(product, soldToday);
  const soldOutLabel = getSoldOutReason(product, soldToday);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-accent/15 bg-off-white shadow-sm transition hover:shadow-md ${soldOut ? "opacity-90" : ""}`}
    >
      <Link
        href={`/menu/${product.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-primary/30"
      >
        <Image
          key={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className={`object-cover transition hover:scale-[1.02] ${soldOut ? "grayscale-[30%]" : ""}`}
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
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-off-white shadow-sm">
              {product.tags[0]}
            </span>
          )
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/${product.id}`} className="group">
          <h3 className="font-display text-xl font-semibold text-foreground transition group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        <VariantToggle
          product={product}
          value={variant}
          onChange={setVariant}
          disabled={soldOut}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-accent">{formatPrice(price)}</p>
          <div className="flex items-center gap-2">
            <Link
              href={`/menu/${product.id}`}
              className="hidden rounded-full border border-accent/25 px-3 py-2 text-xs font-semibold text-accent transition hover:bg-primary/30 sm:inline-flex"
            >
              Details
            </Link>
            <button
            type="button"
            onClick={() => addItem(product.id, variant)}
            disabled={soldOut}
            className="flex h-11 min-w-[110px] items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-off-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-foreground/30"
          >
            {soldOut ? "Sold out" : "Add to Cart"}
          </button>
          </div>
        </div>
      </div>
    </article>
  );
}
