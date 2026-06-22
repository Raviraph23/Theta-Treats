export type PaymentProvider = "mock" | "razorpay";

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (provider === "razorpay") return "razorpay";
  return "mock";
}

export function isMockPaymentsEnabled(): boolean {
  return getPaymentProvider() === "mock";
}
