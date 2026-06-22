"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import {
  isValidIndianPhone,
  normalizePhone,
  validateCartLines,
  type CartLineInput,
} from "@/lib/orders/validation";
import type { OrderWithItems } from "@/lib/supabase/database.types";
import { getCatalogForValidation } from "@/lib/products/catalog";
import { upsertCustomer } from "@/lib/customers/upsert";
import { notifyNewOrderTelegram } from "@/lib/notifications/telegram";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
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

  const catalog = await getCatalogForValidation();
  const validated = validateCartLines(input.items, catalog);
  if (!validated.ok) {
    return { success: false, error: validated.error };
  }

  const orderNumber = generateOrderNumber();
  const customerPhone = normalizePhone(input.customerPhone);

  try {
    const supabase = createAdminClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        notes,
        whatsapp_consent: true,
        status: "pending",
        payment_status: "pending",
        total: validated.total,
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

    await upsertCustomer(customerPhone, customerName, deliveryAddress);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";

    void notifyNewOrderTelegram({
      orderNumber,
      customerName,
      customerPhone,
      deliveryAddress,
      total: validated.total,
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
