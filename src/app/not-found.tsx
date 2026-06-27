import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <header className="border-b border-accent/15 px-4 py-4">
        <Link href="/" className="mx-auto flex max-w-lg items-center gap-3">
          <Image
            src={SITE.logo}
            alt={`${SITE.name} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-accent/30 object-cover"
          />
          <span className="font-display text-lg font-semibold text-foreground">
            {SITE.name}
          </span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="font-display text-7xl font-bold text-accent/30">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
          That link doesn&apos;t lead anywhere on our menu. Head back home, browse
          treats, or track an existing order.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition active:scale-[0.98]"
          >
            Back to home
          </Link>
          <Link
            href="/menu"
            className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
          >
            Browse menu
          </Link>
          <Link
            href="/track"
            className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
          >
            Track order
          </Link>
        </div>
      </main>
    </div>
  );
}
