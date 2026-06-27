"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import {
  isValidIndianPhone,
  normalizePhone,
  validateCartLines,
  type CartLineInput,
} from "@/lib/orders/validation";
import {
  isValidDeliveryDate,
  isValidDeliverySlot,
} from "@/lib/orders/delivery-slots";
import { calculateOrderPricing } from "@/lib/commerce/pricing";
import { validatePromoForOrder } from "@/lib/commerce/promo";
import { getStoreSettings } from "@/lib/commerce/settings";
import { getProductsSoldToday } from "@/lib/commerce/stock";
import type { DeliverySlot, OrderWithItems } from "@/lib/supabase/database.types";
import { getCatalogForValidation } from "@/lib/products/catalog";
import { upsertCustomer } from "@/lib/customers/upsert";
import { notifyNewOrderTelegram } from "@/lib/notifications/telegram";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlot: string;
  notes?: string;
  giftMessage?: string;
  occasion?: string;
  promoCode?: string;
  whatsappConsent: boolean;
  items: CartLineInput[];
};

export type CreateOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const customerName = input.customerName?.trim();
  const deliveryAddress = input.deliveryAddress?.trim();
  const notes = input.notes?.trim() || null;
  const giftMessage = input.giftMessage?.trim() || null;
  const occasion = input.occasion?.trim() || null;
  const deliveryDate = input.deliveryDate?.trim();
  const deliverySlot = input.deliverySlot?.trim();

  if (!customerName || customerName.length < 2 || customerName.length > 100) {
    return { success: false, error: "Please enter a valid name." };
  }

  if (!deliveryAddress || deliveryAddress.length < 5 || deliveryAddress.length > 500) {
    return { success: false, error: "Please enter a valid delivery address." };
  }

  if (!input.whatsappConsent) {
    return {
      success: false,
      error: "Please agree to be contacted on WhatsApp about this order.",
    };
  }

  if (!isValidIndianPhone(input.customerPhone)) {
    return {
      success: false,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  if (!deliveryDate || !isValidDeliveryDate(deliveryDate)) {
    return { success: false, error: "Please choose a valid delivery date." };
  }

  if (!deliverySlot || !isValidDeliverySlot(deliverySlot)) {
    return { success: false, error: "Please choose a delivery time slot." };
  }

  if (giftMessage && giftMessage.length > 300) {
    return {
      success: false,
      error: "Gift message must be 300 characters or fewer.",
    };
  }

  const catalog = await getCatalogForValidation();
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const soldToday = await getProductsSoldToday(productIds);
  const validated = validateCartLines(input.items, catalog, soldToday);
  if (!validated.ok) {
    return { success: false, error: validated.error };
  }

  const settings = await getStoreSettings();
  if (validated.total < settings.minOrderAmount) {
    return {
      success: false,
      error: `Minimum order is ₹${settings.minOrderAmount.toLocaleString("en-IN")}. Add more items to continue.`,
    };
  }

  const supabase = createAdminClient();
  let promoRow = null;
  const promoInput = input.promoCode?.trim().toUpperCase();

  if (promoInput) {
    const { data: promo, error: promoError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", promoInput)
      .maybeSingle();

    if (promoError || !promo) {
      return { success: false, error: "Invalid promo code." };
    }

    const promoResult = validatePromoForOrder(promo, validated.total);
    if (!promoResult.ok) {
      return { success: false, error: promoResult.error };
    }

    promoRow = promo;
  }

  const pricing = calculateOrderPricing(
    validated.total,
    deliveryAddress,
    settings,
    promoRow,
  );

  const orderNumber = generateOrderNumber();
  const customerPhone = normalizePhone(input.customerPhone);

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_slot: deliverySlot as DeliverySlot,
        notes,
        gift_message: giftMessage,
        occasion,
        whatsapp_consent: true,
        status: "pending",
        payment_status: "pending",
        subtotal: pricing.subtotal,
        discount_amount: pricing.discountAmount,
        delivery_fee: pricing.deliveryFee,
        promo_code: pricing.promo?.code ?? null,
        total: pricing.total,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert failed:", orderError);
      return { success: false, error: "Could not save your order. Please try again." };
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      validated.lines.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        product_name: line.productName,
        variant: line.variant,
        variant_label: line.variantLabel,
        quantity: line.quantity,
        unit_price: line.unitPrice,
        line_total: line.lineTotal,
      })),
    );

    if (itemsError) {
      console.error("Order items insert failed:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "Could not save your order. Please try again." };
    }

    if (promoRow) {
      await supabase
        .from("promo_codes")
        .update({ use_count: promoRow.use_count + 1 })
        .eq("id", promoRow.id);
    }

    await upsertCustomer(customerPhone, customerName, deliveryAddress);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";

    void notifyNewOrderTelegram({
      orderNumber,
      customerName,
      customerPhone,
      deliveryAddress,
      total: pricing.total,
      itemCount: validated.lines.reduce((sum, l) => sum + l.quantity, 0),
      adminUrl: `${siteUrl}/admin/orders/${order.id}`,
    });

    return { success: true, orderNumber };
  } catch (err) {
    console.error("createOrder error:", err);
    return {
      success: false,
      error: "Server configuration error. Please contact support.",
    };
  }
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderWithItems | null> {
  if (!orderNumber || !/^TT-\d{8}-\d{4}$/.test(orderNumber)) {
    return null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .single();

    if (error || !data) return null;
    return data as OrderWithItems;
  } catch {
    return null;
  }
}

export type TrackOrderResult =
  | { success: true; order: OrderWithItems }
  | { success: false; error: string };

export async function trackOrder(
  orderNumber: string,
  phone: string,
): Promise<TrackOrderResult> {
  const trimmedOrderNumber = orderNumber.trim().toUpperCase();
  const order = await getOrderByNumber(trimmedOrderNumber);

  if (!order) {
    return {
      success: false,
      error: "Order not found. Check your order number and try again.",
    };
  }

  if (!isValidIndianPhone(phone)) {
    return {
      success: false,
      error: "Please enter the phone number used when placing the order.",
    };
  }

  const normalizedPhone = normalizePhone(phone);
  if (order.customer_phone !== normalizedPhone) {
    return {
      success: false,
      error: "Phone number does not match this order.",
    };
  }

  return { success: true, order };
}
