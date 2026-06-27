"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  filterProducts,
  getProductTags,
  type ProductSort,
} from "@/lib/products/filter";
import type { Product, ProductCategory } from "@/types/product";

type MenuExplorerProps = {
  products: Product[];
  soldToday?: Record<string, number>;
};

const CATEGORY_OPTIONS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "brownie", label: "Brownies" },
  { value: "cookie", label: "Cookies" },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

export function MenuExplorer({
  products,
  soldToday = {},
}: MenuExplorerProps) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") ?? "";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState<ProductSort>("default");

  const availableTags = useMemo(() => getProductTags(products), [products]);

  const filtered = useMemo(
    () => filterProducts(products, { query, category, tag, sort }),
    [products, query, category, tag, sort],
  );

  return (
    <div>
      <div className="rounded-2xl border border-accent/15 bg-off-white p-4 shadow-sm">
        <label className="block">
          <span className="sr-only">Search menu</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brownies, cookies, tags…"
            className="w-full rounded-xl border border-accent/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === option.value
                  ? "bg-foreground text-off-white"
                  : "bg-primary/30 text-foreground/70 hover:bg-primary/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTag("")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                tag === ""
                  ? "bg-accent text-off-white"
                  : "border border-accent/25 text-accent hover:bg-primary/30"
              }`}
            >
              All tags
            </button>
            {availableTags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item === tag ? "" : item)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                  tag === item
                    ? "bg-accent text-off-white"
                    : "border border-accent/25 text-accent hover:bg-primary/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-foreground/60">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ProductSort)}
              className="rounded-lg border border-accent/20 bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-accent/25 bg-primary/10 px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            No treats match your filters
          </p>
          <p className="mt-2 text-sm text-foreground/60">
            Try a different search or clear your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setTag("");
              setSort("default");
            }}
            className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-off-white transition hover:bg-accent/90"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              soldToday={soldToday[product.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
