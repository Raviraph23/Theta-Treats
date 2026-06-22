import Link from "next/link";
import { getStorageImagesByCategory } from "@/lib/admin/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const storageImagesByCategory = await getStorageImagesByCategory();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← All products
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
        Add product
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Choose a category, pick an image from Supabase Storage, set prices, and
        save. Use the order arrows on the menu list to control storefront order.
      </p>

      <div className="mt-8 max-w-xl">
        <ProductForm
          mode="create"
          storageImagesByCategory={storageImagesByCategory}
        />
      </div>
    </div>
  );
}
