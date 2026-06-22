"use client";

import { CartProvider } from "@/context/CartContext";
import { CartDrawerLazy } from "@/components/storefront/CartDrawerLazy";
import type { Product } from "@/data/products";
import type { ReactNode } from "react";

type StorefrontCartShellProps = {
  products: Product[];
  children: ReactNode;
};

export function StorefrontCartShell({
  products,
  children,
}: StorefrontCartShellProps) {
  return (
    <CartProvider products={products}>
      {children}
      <CartDrawerLazy />
    </CartProvider>
  );
}
