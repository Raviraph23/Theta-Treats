import type { Metadata } from "next";
import Link from "next/link";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Theta Treats order status.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link
        href="/"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← Back to menu
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
        Track your order
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Enter your order number and phone number to see live status updates.
      </p>

      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </div>
  );
}
