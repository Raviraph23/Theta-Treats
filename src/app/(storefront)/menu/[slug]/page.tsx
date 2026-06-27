import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { getProductsSoldToday } from "@/lib/commerce/stock";
import { getActiveProducts, getProductBySlug } from "@/lib/products/catalog";
import {
  createProductJsonLd,
  createProductMetadata,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return createProductMetadata(product);
}

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({ slug: product.id }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getActiveProducts(),
  ]);

  if (!product) notFound();

  const soldToday = await getProductsSoldToday([product.id]);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 2);
  const productJsonLd = createProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <ProductDetail
            product={product}
            soldToday={soldToday[product.id] ?? 0}
            relatedProducts={relatedProducts}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
