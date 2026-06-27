import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/types/product";

function getTodayStartIst(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  ist.setUTCHours(0, 0, 0, 0);
  const utcStart = new Date(ist.getTime() - istOffset);
  return utcStart.toISOString();
}

export async function getProductsSoldToday(
  productIds: string[],
): Promise<Record<string, number>> {
  if (productIds.length === 0) return {};

  const supabase = createAdminClient();
  const todayStart = getTodayStartIst();

  const { data: todayOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .gte("created_at", todayStart)
    .neq("status", "cancelled");

  if (ordersError) {
    console.error("getProductsSoldToday orders error:", ordersError);
    return {};
  }

  const orderIds = (todayOrders ?? []).map((o) => o.id);
  if (orderIds.length === 0) return {};

  const { data, error } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .in("order_id", orderIds)
    .in("product_id", productIds);

  if (error) {
    console.error("getProductsSoldToday error:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.product_id] = (counts[row.product_id] ?? 0) + row.quantity;
  }
  return counts;
}

export function isProductSoldOut(
  product: Product,
  soldToday: number,
  requestedQty = 0,
): boolean {
  if (product.isSoldOut) return true;
  if (product.dailyLimit != null && soldToday + requestedQty > product.dailyLimit) {
    return true;
  }
  return false;
}

export function getSoldOutReason(
  product: Product,
  soldToday: number,
): string | null {
  if (product.isSoldOut) return "Sold out";
  if (product.dailyLimit != null && soldToday >= product.dailyLimit) {
    return "Sold out today";
  }
  return null;
}
