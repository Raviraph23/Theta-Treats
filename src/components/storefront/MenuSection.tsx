import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

type MenuSectionProps = {
  id: string;
  title: string;
  description: string;
  products: Product[];
};

export function MenuSection({
  id,
  title,
  description,
  products,
}: MenuSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Our Menu
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
            {description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
