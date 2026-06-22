import type { MockPaymentMethod } from "@/lib/payments/labels";

export function generateMockPaymentReference(orderNumber: string): string {
  const suffix = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `MOCK-${orderNumber}-${suffix}`;
}

export function isValidMockPaymentMethod(
  method: string,
): method is MockPaymentMethod {
  return method === "mock_upi" || method === "mock_card" || method === "cod";
}
