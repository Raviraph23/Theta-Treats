import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Image
        src={SITE.logo}
        alt=""
        width={56}
        height={56}
        className="mx-auto h-14 w-14 rounded-full border border-accent/30 object-cover"
        aria-hidden
      />
      <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
        Order not found
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        We couldn&apos;t find an order with that ID. Check the link from your
        confirmation message or use track order with your phone number.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/track"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition active:scale-[0.98]"
        >
          Track order
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
        >
          Back to menu
        </Link>
      </div>
    </div>
  );
}
