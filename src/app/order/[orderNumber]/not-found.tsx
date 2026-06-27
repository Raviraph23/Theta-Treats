import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Order not found
      </h1>
      <p className="mt-3 text-sm text-foreground/70">
        We couldn&apos;t find an order with that ID. Check the link from your
        confirmation message or contact us if you need help.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition active:scale-[0.98]"
      >
        Back to menu
      </Link>
    </div>
  );
}
