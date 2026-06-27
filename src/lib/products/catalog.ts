import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import { rowToProduct } from "@/lib/products/map";

export const PRODUCTS_CACHE_TAG = "products";

function createPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const fetchActiveProductsFromDb = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("getActiveProducts error:", error);
      return [];
    }

    return (data ?? []).map(rowToProduct);
  },
  ["active-products"],
  { tags: [PRODUCTS_CACHE_TAG] },
);

/** Cached storefront catalog — revalidate via `revalidateTag(PRODUCTS_CACHE_TAG)`. */
export const getActiveProducts = cache(fetchActiveProductsFromDb);

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllProductsAdmin error:", error);
    return [];
  }

  return (data ?? []).map(rowToProduct);
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToProduct(data);
}

/** Server-side catalog for order validation (includes inactive for price lookup safety). */
export async function getCatalogForValidation(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("getCatalogForValidation error:", error);
    return [];
  }

  return (data ?? []).map(rowToProduct);
}
