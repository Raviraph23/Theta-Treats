import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { MenuExplorer } from "@/components/storefront/MenuExplorer";
import { ComboSection } from "@/components/storefront/ComboSection";
import { resolveBundles } from "@/lib/commerce/bundles";
import { getProductsSoldToday } from "@/lib/commerce/stock";
import { getActiveProducts } from "@/lib/products/catalog";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Menu",
  description: `Browse handcrafted brownies and cookies from ${SITE.name}. Search, filter, and add to cart.`,
  alternates: {
    canonical: "/menu",
  },
};

export default async function MenuPage() {
  const products = await getActiveProducts();
  const soldToday = await getProductsSoldToday(products.map((p) => p.id));
  const bundles = resolveBundles(products);

  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Full catalog
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
              Our menu
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-foreground/70">
              Search and filter our brownies and cookies. Tap any item for full
              details and shareable links.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-foreground/60">
              All items are made without eggs. Contains dairy; some include nuts.
            </p>
          </div>

          <div className="mt-8">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-accent/15 bg-off-white p-8 text-center text-sm text-foreground/60">
                  Loading menu…
                </div>
              }
            >
              <MenuExplorer products={products} soldToday={soldToday} />
            </Suspense>
          </div>

          <ComboSection bundles={bundles} />
        </div>
      </main>
      <Footer />
    </>
  );
}
