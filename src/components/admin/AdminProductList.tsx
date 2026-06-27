"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { reorderProduct } from "@/app/actions/admin";
import { ProductAvailabilityToggle } from "@/components/admin/ProductAvailabilityToggle";
import {
  formatPrice,
  getDefaultVariant,
  getProductPrice,
} from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import type { Product, ProductCategory } from "@/types/product";

type AdminProductListProps = {
  products: Product[];
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  brownie: "Brownies",
  cookie: "Cookies",
};

function ProductRow({
  product,
  isFirst,
  isLast,
}: {
  product: Product;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultVariant = getDefaultVariant(product);
  const fromPrice = getProductPrice(product, defaultVariant);

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await reorderProduct(product.id, direction);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-accent/10 last:border-0 hover:bg-primary/10">
      <td className="px-2 py-3">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => move("up")}
            disabled={isPending || isFirst}
            aria-label={`Move ${product.name} up`}
            className="rounded px-1 text-foreground/50 hover:bg-accent/10 hover:text-accent disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move("down")}
            disabled={isPending || isLast}
            aria-label={`Move ${product.name} down`}
            className="rounded px-1 text-foreground/50 hover:bg-accent/10 hover:text-accent disabled:opacity-30"
          >
            ↓
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              alt={product.name}
              fill
              sizes="40px"
              className="object-cover"
              {...productImageProps(product.image)}
            />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-foreground/60">{product.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 capitalize">{product.category}</td>
      <td className="px-4 py-3 font-semibold">{formatPrice(fromPrice)}</td>
      <td className="px-4 py-3">
        {product.tags[0] ? (
          <span className="rounded-full bg-primary/40 px-2 py-0.5 text-xs">
            {product.tags[0]}
          </span>
        ) : (
          <span className="text-xs text-foreground/40">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <ProductAvailabilityToggle
          productId={product.id}
          isActive={product.isActive !== false}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-accent hover:underline"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

export function AdminProductList({ products }: AdminProductListProps) {
  const categories: ProductCategory[] = ["brownie", "cookie"];

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category,
        );

        if (categoryProducts.length === 0) return null;

        return (
          <section key={category}>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-accent/15">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-accent/15 bg-primary/20">
                  <tr>
                    <th className="px-2 py-3 font-semibold w-10">Order</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">From</th>
                    <th className="px-4 py-3 font-semibold">Tag</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {categoryProducts.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isFirst={index === 0}
                      isLast={index === categoryProducts.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
