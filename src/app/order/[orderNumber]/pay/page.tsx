import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderByNumber } from "@/app/actions/orders";
import { MockPaymentForm } from "@/components/MockPaymentForm";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/products/formatting";
import { isMockPaymentsEnabled } from "@/lib/payments/config";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Pay ${orderNumber}`,
    description: "Complete your Theta Treats order payment.",
  };
}

export default async function OrderPaymentPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  if (order.payment_status === "paid" || order.payment_status === "cod") {
    redirect(`/order/${orderNumber}`);
  }

  if (!isMockPaymentsEnabled()) {
    redirect(`/order/${orderNumber}`);
  }

  const lineItems = order.order_items.map((item) => ({
    name: item.product_name,
    quantity: item.quantity,
    lineTotal: item.line_total,
  }));

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="border-b border-accent/10 bg-off-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-display text-lg font-semibold text-foreground">
            {SITE.name}
          </Link>
          <span className="text-sm text-foreground/60">
            Order{" "}
            <span className="font-mono font-medium text-foreground">
              {order.order_number}
            </span>
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-5 lg:gap-8">
        <aside className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-8 rounded-2xl border border-accent/15 bg-off-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Order summary
            </h2>
            <p className="mt-1 text-sm text-foreground/60">{order.customer_name}</p>

            <ul className="mt-6 space-y-3 border-b border-accent/10 pb-4">
              {lineItems.map((item) => (
                <li
                  key={`${item.name}-${item.quantity}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-foreground/80">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 text-sm">
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-foreground/70">
                  <span>Delivery</span>
                  <span>{formatPrice(order.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold text-accent">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="rounded-2xl border border-accent/15 bg-off-white p-6 shadow-sm sm:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Complete payment
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              Choose how you&apos;d like to pay for your order.
            </p>

            <div className="mt-8">
              <MockPaymentForm
                orderNumber={order.order_number}
                total={order.total}
                customerName={order.customer_name}
                items={lineItems}
              />
            </div>
          </div>

          <Link
            href={`/order/${order.order_number}`}
            className="mt-4 inline-block text-sm text-accent underline-offset-2 hover:underline"
          >
            ← Back to order
          </Link>
        </main>
      </div>
    </div>
  );
}
