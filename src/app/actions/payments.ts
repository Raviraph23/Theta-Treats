"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMockPaymentsEnabled } from "@/lib/payments/config";
import {
  generateMockPaymentReference,
  isValidMockPaymentMethod,
} from "@/lib/payments/mock";
import type { PaymentStatus } from "@/lib/supabase/database.types";

export type CompleteMockPaymentResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function completeMockPayment(
  orderNumber: string,
  method: string,
): Promise<CompleteMockPaymentResult> {
  if (!isMockPaymentsEnabled()) {
    return { success: false, error: "Mock payments are not enabled." };
  }

  if (!orderNumber || !/^TT-\d{8}-\d{4}$/.test(orderNumber)) {
    return { success: false, error: "Invalid order." };
  }

  if (!isValidMockPaymentMethod(method)) {
    return { success: false, error: "Please select a payment method." };
  }

  try {
    const supabase = createAdminClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("order_number", orderNumber)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "Order not found." };
    }

    if (order.payment_status !== "pending") {
      return { success: false, error: "This order has already been paid." };
    }

    const isCod = method === "cod";
    const paymentStatus: PaymentStatus = isCod ? "cod" : "paid";
    const paymentReference = isCod
      ? null
      : generateMockPaymentReference(orderNumber);

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_method: method,
        payment_reference: paymentReference,
        paid_at: isCod ? null : new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_status", "pending");

    if (updateError) {
      console.error("completeMockPayment error:", updateError);
      return { success: false, error: "Could not complete payment. Try again." };
    }

    revalidatePath(`/order/${orderNumber}`);
    revalidatePath(`/order/${orderNumber}/pay`);
    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath("/admin/orders");

    return { success: true, orderNumber };
  } catch (err) {
    console.error("completeMockPayment error:", err);
    return { success: false, error: "Server error. Please try again." };
  }
}
