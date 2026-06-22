import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/database.types";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  cod: "Cash on delivery",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mock_upi: "UPI (demo)",
  mock_card: "Card (demo)",
  cod: "Cash on delivery",
};

export type MockPaymentMethod = "mock_upi" | "mock_card" | "cod";

export const MOCK_PAYMENT_OPTIONS: {
  value: MockPaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "mock_upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm — demo only",
  },
  {
    value: "mock_card",
    label: "Debit / Credit card",
    description: "Visa, Mastercard, RuPay — demo only",
  },
  {
    value: "cod",
    label: "Cash on delivery",
    description: "Pay when your order arrives",
  },
];
