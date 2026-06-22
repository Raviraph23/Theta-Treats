import Link from "next/link";
import { getProducts } from "@/lib/admin/queries";
import { AdminProductList } from "@/components/admin/AdminProductList";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Menu
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Add products, edit details, reorder within each category, and toggle
            availability. Changes appear on the storefront immediately.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground/60">
            {products.filter((p) => p.isActive !== false).length} available
          </span>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-off-white"
          >
            Add product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">
          No products yet.{" "}
          <Link href="/admin/products/new" className="text-accent underline">
            Add your first product
          </Link>{" "}
          or run the Phase 2 SQL migration in Supabase.
        </p>
      ) : (
        <div className="mt-8">
          <AdminProductList products={products} />
        </div>
      )}
    </div>
  );
}
