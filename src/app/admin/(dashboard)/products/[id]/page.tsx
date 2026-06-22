import Link from "next/link";
import { getStorageImagesByCategory, getProduct } from "@/lib/admin/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, storageImagesByCategory] = await Promise.all([
    getProduct(id),
    getStorageImagesByCategory(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← All products
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-3xl font-bold text-foreground">
          {product.name}
        </h1>
        <p className="mt-1 text-sm capitalize text-foreground/60">
          {product.category} · {product.id}
        </p>
      </div>

      <div className="mt-8 max-w-xl">
        <ProductForm
          mode="edit"
          product={product}
          storageImagesByCategory={storageImagesByCategory}
        />
      </div>
    </div>
  );
}
