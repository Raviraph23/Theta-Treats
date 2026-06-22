import { StorefrontCartShell } from "@/components/storefront/StorefrontCartShell";
import { getActiveProducts } from "@/lib/products/catalog";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getActiveProducts();

  return (
    <StorefrontCartShell products={products}>{children}</StorefrontCartShell>
  );
}
