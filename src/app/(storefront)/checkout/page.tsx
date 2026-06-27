import type { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getStoreSettings } from "@/lib/commerce/settings";
import { getActiveProducts } from "@/lib/products/catalog";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Theta Treats order.",
};

export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);

  return <CheckoutForm products={products} settings={settings} />;
}
