import type {
  Customer,
  OrderWithItems,
  PromoCodeRow,
  TestimonialRow,
} from "@/lib/supabase/database.types";
import type { Product, ProductCategory } from "@/types/product";
import {
  getAllProductsAdmin,
  getProductByIdAdmin,
} from "@/lib/products/catalog";
import {
  listProductImages,
  type StorageImageOption,
} from "@/lib/products/storage";
import { requireAdmin } from "@/lib/admin/auth";
import { getLocalDayBounds } from "@/lib/format/date";
import type { OrderFilters } from "@/lib/admin/stats";

export async function getOrders(filters?: OrderFilters): Promise<OrderWithItems[]> {
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.paymentStatus && filters.paymentStatus !== "all") {
    query = query.eq("payment_status", filters.paymentStatus);
  }
  if (filters?.dateFrom) {
    const { start } = getLocalDayBounds(filters.dateFrom);
    query = query.gte("created_at", start);
  }
  if (filters?.dateTo) {
    const { end } = getLocalDayBounds(filters.dateTo);
    query = query.lte("created_at", end);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getOrders error:", error);
    return [];
  }

  return (data ?? []) as OrderWithItems[];
}

export async function getCustomers(): Promise<Customer[]> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getCustomers error:", error);
    return [];
  }

  return (data ?? []) as Customer[];
}

export type CustomerDetail = {
  customer: Customer;
  orders: OrderWithItems[];
};

/** Single auth check; fetches customer then order history in one session. */
export async function getCustomerDetail(
  id: string,
): Promise<CustomerDetail | null> {
  const { supabase } = await requireAdmin();

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (customerError || !customer) return null;

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_phone", customer.phone)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("getCustomerDetail orders error:", ordersError);
    return { customer: customer as Customer, orders: [] };
  }

  return {
    customer: customer as Customer,
    orders: (orders ?? []) as OrderWithItems[],
  };
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as OrderWithItems;
}

export async function getProducts(): Promise<Product[]> {
  await requireAdmin();
  return getAllProductsAdmin();
}

export async function getProduct(id: string): Promise<Product | null> {
  await requireAdmin();
  return getProductByIdAdmin(id);
}

export type StorageImagesByCategory = Record<
  ProductCategory,
  StorageImageOption[]
>;

export async function getStorageImagesByCategory(): Promise<StorageImagesByCategory> {
  await requireAdmin();

  const [brownie, cookie] = await Promise.all([
    listProductImages("brownie"),
    listProductImages("cookie"),
  ]);

  return { brownie, cookie };
}

export async function getPromoCodes(): Promise<PromoCodeRow[]> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPromoCodes error:", error);
    return [];
  }

  return (data ?? []) as PromoCodeRow[];
}

export async function getStoreSettingsAdmin() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) return null;
  return data;
}

export async function getProductStorageImages(
  category: ProductCategory,
): Promise<StorageImageOption[]> {
  await requireAdmin();
  return listProductImages(category);
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTestimonials error:", error);
    return [];
  }

  return (data ?? []) as TestimonialRow[];
}
