type NewOrderAlert = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  total: number;
  itemCount: number;
  adminUrl?: string;
};

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export async function notifyNewOrderTelegram(
  order: NewOrderAlert,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const lines = [
    "🧁 New order!",
    "",
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Address: ${order.deliveryAddress}`,
    `Items: ${order.itemCount}`,
    `Total: ${formatInr(order.total)}`,
    "",
    `Admin: ${order.adminUrl ?? `${siteUrl}/admin/orders`}`,
  ];

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
        }),
      },
    );

    if (!res.ok) {
      console.error("Telegram notify failed:", await res.text());
    }
  } catch (err) {
    console.error("Telegram notify error:", err);
  }
}
