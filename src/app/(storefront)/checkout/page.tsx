import type { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getActiveProducts } from "@/lib/products/catalog";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Theta Treats order.",
};

export default async function CheckoutPage() {
  const products = await getActiveProducts();

  return <CheckoutForm products={products} />;
}
