"use client";

import Image from "next/image";
import { useState } from "react";
import {
  formatPrice,
  getDefaultVariant,
  getProductPrice,
} from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import type { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { VariantToggle } from "@/components/storefront/VariantToggle";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState<ProductVariant>(
    getDefaultVariant(product),
  );
  const price = getProductPrice(product, variant);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-accent/15 bg-off-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/30">
        <Image
          key={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
          {...productImageProps(product.image)}
        />
        {product.tags[0] && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-off-white shadow-sm">
            {product.tags[0]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        <VariantToggle
          product={product}
          value={variant}
          onChange={setVariant}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-accent">{formatPrice(price)}</p>
          <button
            type="button"
            onClick={() => addItem(product.id, variant)}
            className="flex h-11 min-w-[110px] items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-off-white transition active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
