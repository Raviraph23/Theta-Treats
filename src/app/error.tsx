"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
        Something went wrong
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
        We hit a snag
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
        {SITE.name} ran into an unexpected error. Try again, or return to the
        menu to continue browsing.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
