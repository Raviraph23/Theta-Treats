import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderByNumber } from "@/app/actions/orders";
import { MockPaymentForm } from "@/components/MockPaymentForm";
import { formatPrice } from "@/data/products";
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

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link
        href="/"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← Back to menu
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
        Complete payment
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Order <span className="font-mono font-medium">{order.order_number}</span>{" "}
        is saved. Choose how you&apos;d like to pay.
      </p>

      <div className="mt-6 rounded-2xl border border-accent/15 bg-primary/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/60">Order total</span>
          <span className="text-xl font-bold text-accent">
            {formatPrice(order.total)}
          </span>
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          {order.order_items.length} item
          {order.order_items.length === 1 ? "" : "s"} · {order.customer_name}
        </p>
      </div>

      <div className="mt-8">
        <MockPaymentForm orderNumber={order.order_number} total={order.total} />
      </div>
    </div>
  );
}
