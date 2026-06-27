"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, PromoDiscountType } from "@/lib/supabase/database.types";
import { requireAdmin } from "@/lib/admin/auth";
import { STORE_SETTINGS_CACHE_TAG } from "@/lib/commerce/constants";
import type { DeliveryZone } from "@/lib/commerce/constants";
import { getProductStorageImages } from "@/lib/admin/queries";
import { ADMIN_STATUS_OPTIONS } from "@/lib/orders/whatsapp";
import {
  getProductByIdAdmin,
  PRODUCTS_CACHE_TAG,
} from "@/lib/products/catalog";
import {
  parsePricingFromForm,
  parseTagFromForm,
} from "@/lib/products/admin-form";
import {
  uploadProductImage,
  type StorageImageOption,
} from "@/lib/products/storage";
import { isValidProductId, slugify } from "@/lib/products/slug";
import type { ProductCategory } from "@/types/product";

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/admin/orders");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!ADMIN_STATUS_OPTIONS.includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const { supabase } = await requireAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("order_number")
    .eq("id", orderId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "Order not found." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, error: "Could not update status." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/order/${existing.order_number}`);
  return { success: true };
}

function revalidateProductPaths(productId?: string) {
  revalidatePath("/admin/products");
  if (productId) {
    revalidatePath(`/admin/products/${productId}`);
  }
  revalidatePath("/");
  updateTag(PRODUCTS_CACHE_TAG);
}

export async function updateProductActive(
  productId: string,
  isActive: boolean,
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) {
    console.error("updateProductActive error:", error);
    return { success: false, error: "Could not update availability." };
  }

  revalidateProductPaths(productId);
  return { success: true };
}

/** Client-callable refresh after storage upload (ProductImagePicker). */
export async function refreshProductStorageImages(
  category: ProductCategory,
): Promise<StorageImageOption[]> {
  return getProductStorageImages(category);
}

export async function uploadProductImageAction(
  category: ProductCategory,
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image file." };
  }

  const result = await uploadProductImage(category, file);
  if ("error" in result) {
    return { success: false, error: result.error };
  }

  return { success: true, url: result.url };
}

export async function createProductFromForm(
  formData: FormData,
): Promise<{ success: boolean; productId?: string; error?: string }> {
  const category = formData.get("category")?.toString() as ProductCategory;
  if (category !== "brownie" && category !== "cookie") {
    return { success: false, error: "Choose a valid category." };
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const image = formData.get("image")?.toString().trim();
  const idRaw = formData.get("id")?.toString().trim();
  const id = idRaw || (name ? slugify(name) : "");

  if (!name) {
    return { success: false, error: "Name is required." };
  }
  if (!description) {
    return { success: false, error: "Description is required." };
  }
  if (!image) {
    return { success: false, error: "Select a product image." };
  }
  if (!isValidProductId(id)) {
    return {
      success: false,
      error: "ID must be lowercase letters, numbers, and hyphens only.",
    };
  }

  const pricingResult = parsePricingFromForm(category, formData);
  if (pricingResult.error || !pricingResult.pricing) {
    return { success: false, error: pricingResult.error ?? "Invalid pricing." };
  }

  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A product with this ID already exists." };
  }

  const { data: lastInCategory } = await supabase
    .from("products")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (lastInCategory?.sort_order ?? 0) + 1;
  const isActive = formData.get("isActive") === "on";
  const isSoldOut = formData.get("isSoldOut") === "on";
  const dailyLimitRaw = formData.get("dailyLimit")?.toString().trim();
  const dailyLimit = dailyLimitRaw ? Number(dailyLimitRaw) : null;

  if (dailyLimit !== null && (!Number.isInteger(dailyLimit) || dailyLimit <= 0)) {
    return { success: false, error: "Daily limit must be a positive whole number." };
  }

  const { error } = await supabase.from("products").insert({
    id,
    category,
    name,
    description,
    image,
    tags: parseTagFromForm(formData),
    pricing: pricingResult.pricing,
    is_active: isActive,
    is_sold_out: isSoldOut,
    daily_limit: dailyLimit,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("createProductFromForm error:", error);
    return { success: false, error: "Could not create product." };
  }

  revalidateProductPaths(id);
  return { success: true, productId: id };
}

export async function saveProductFromForm(
  productId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const product = await getProductByIdAdmin(productId);
  if (!product) {
    return { success: false, error: "Product not found." };
  }

  const pricingResult = parsePricingFromForm(product.category, formData);
  if (pricingResult.error || !pricingResult.pricing) {
    return { success: false, error: pricingResult.error ?? "Invalid pricing." };
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const image = formData.get("image")?.toString().trim();

  if (!name) {
    return { success: false, error: "Name is required." };
  }
  if (!description) {
    return { success: false, error: "Description is required." };
  }
  if (!image) {
    return { success: false, error: "Select a product image." };
  }

  const isActive = formData.get("isActive") === "on";
  const isSoldOut = formData.get("isSoldOut") === "on";
  const dailyLimitRaw = formData.get("dailyLimit")?.toString().trim();
  const dailyLimit = dailyLimitRaw ? Number(dailyLimitRaw) : null;

  if (dailyLimit !== null && (!Number.isInteger(dailyLimit) || dailyLimit <= 0)) {
    return { success: false, error: "Daily limit must be a positive whole number." };
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("products")
    .update({
      pricing: pricingResult.pricing,
      is_active: isActive,
      is_sold_out: isSoldOut,
      daily_limit: dailyLimit,
      name,
      description,
      image,
      tags: parseTagFromForm(formData),
    })
    .eq("id", productId);

  if (error) {
    console.error("saveProductFromForm error:", error);
    return { success: false, error: "Could not save product." };
  }

  revalidateProductPaths(productId);
  return { success: true };
}

export async function reorderProduct(
  productId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const product = await getProductByIdAdmin(productId);
  if (!product) {
    return { success: false, error: "Product not found." };
  }

  const { supabase } = await requireAdmin();
  const { data: siblings, error: listError } = await supabase
    .from("products")
    .select("id, sort_order")
    .eq("category", product.category)
    .order("sort_order", { ascending: true });

  if (listError || !siblings) {
    console.error("reorderProduct list error:", listError);
    return { success: false, error: "Could not reorder product." };
  }

  const index = siblings.findIndex((row) => row.id === productId);
  if (index === -1) {
    return { success: false, error: "Product not found." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return { success: true };
  }

  const current = siblings[index];
  const neighbor = siblings[swapIndex];

  const { error: firstError } = await supabase
    .from("products")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);

  if (firstError) {
    console.error("reorderProduct first update error:", firstError);
    return { success: false, error: "Could not reorder product." };
  }

  const { error: secondError } = await supabase
    .from("products")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);

  if (secondError) {
    console.error("reorderProduct second update error:", secondError);
    return { success: false, error: "Could not reorder product." };
  }

  revalidateProductPaths();
  return { success: true };
}

function revalidateSettingsPaths() {
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/checkout");
  updateTag(STORE_SETTINGS_CACHE_TAG);
}

export async function saveStoreSettingsFromForm(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const minOrderAmount = Number(formData.get("minOrderAmount"));
  const freeDeliveryThreshold = Number(formData.get("freeDeliveryThreshold"));
  const defaultDeliveryFee = Number(formData.get("defaultDeliveryFee"));

  if (
    !Number.isInteger(minOrderAmount) ||
    minOrderAmount < 0 ||
    !Number.isInteger(freeDeliveryThreshold) ||
    freeDeliveryThreshold < 0 ||
    !Number.isInteger(defaultDeliveryFee) ||
    defaultDeliveryFee < 0
  ) {
    return { success: false, error: "Enter valid whole numbers for all amounts." };
  }

  const zones: DeliveryZone[] = [];
  for (let i = 0; i < 10; i += 1) {
    const prefix = formData.get(`zone_prefix_${i}`)?.toString().trim();
    const label = formData.get(`zone_label_${i}`)?.toString().trim();
    const fee = Number(formData.get(`zone_fee_${i}`));
    if (!prefix) continue;
    if (!Number.isInteger(fee) || fee < 0) {
      return { success: false, error: `Invalid fee for zone ${prefix}.` };
    }
    zones.push({ prefix, label: label || prefix, fee });
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("store_settings")
    .update({
      min_order_amount: minOrderAmount,
      free_delivery_threshold: freeDeliveryThreshold,
      default_delivery_fee: defaultDeliveryFee,
      delivery_zones: zones,
    })
    .eq("id", "default");

  if (error) {
    console.error("saveStoreSettingsFromForm error:", error);
    return { success: false, error: "Could not save settings." };
  }

  revalidateSettingsPaths();
  return { success: true };
}

export async function createPromoFromForm(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const code = formData.get("code")?.toString().trim().toUpperCase();
  const discountType = formData.get("discountType")?.toString() as PromoDiscountType;
  const discountValue = Number(formData.get("discountValue"));
  const minOrder = Number(formData.get("minOrder") ?? 0);
  const maxUsesRaw = formData.get("maxUses")?.toString().trim();
  const maxUses = maxUsesRaw ? Number(maxUsesRaw) : null;
  const isActive = formData.get("isActive") === "on";

  if (!code || code.length < 3) {
    return { success: false, error: "Code must be at least 3 characters." };
  }
  if (discountType !== "percent" && discountType !== "fixed") {
    return { success: false, error: "Choose a valid discount type." };
  }
  if (!Number.isInteger(discountValue) || discountValue <= 0) {
    return { success: false, error: "Enter a valid discount value." };
  }
  if (discountType === "percent" && discountValue > 100) {
    return { success: false, error: "Percent discount cannot exceed 100." };
  }
  if (!Number.isInteger(minOrder) || minOrder < 0) {
    return { success: false, error: "Enter a valid minimum order." };
  }
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
    return { success: false, error: "Max uses must be a positive number." };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("promo_codes").insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order: minOrder,
    max_uses: maxUses,
    is_active: isActive,
  });

  if (error) {
    console.error("createPromoFromForm error:", error);
    if (error.code === "23505") {
      return { success: false, error: "A promo with this code already exists." };
    }
    return { success: false, error: "Could not create promo code." };
  }

  revalidatePath("/admin/promos");
  return { success: true };
}

export async function updatePromoActive(
  promoId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active: isActive })
    .eq("id", promoId);

  if (error) {
    console.error("updatePromoActive error:", error);
    return { success: false, error: "Could not update promo." };
  }

  revalidatePath("/admin/promos");
  return { success: true };
}

export async function deletePromo(
  promoId: string,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("promo_codes").delete().eq("id", promoId);

  if (error) {
    console.error("deletePromo error:", error);
    return { success: false, error: "Could not delete promo." };
  }

  revalidatePath("/admin/promos");
  return { success: true };
}

export async function updateProductSoldOut(
  productId: string,
  isSoldOut: boolean,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({ is_sold_out: isSoldOut })
    .eq("id", productId);

  if (error) {
    console.error("updateProductSoldOut error:", error);
    return { success: false, error: "Could not update sold-out status." };
  }

  revalidateProductPaths(productId);
  return { success: true };
}
