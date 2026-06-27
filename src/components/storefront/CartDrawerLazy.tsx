"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () =>
    import("@/components/storefront/CartDrawer").then((mod) => ({
      default: mod.CartDrawer,
    })),
  { ssr: false },
);

export function CartDrawerLazy() {
  return <CartDrawer />;
}
