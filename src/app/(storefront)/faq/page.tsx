import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ordering, delivery, allergens, and payments at ${SITE.name}.`,
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Help centre
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70">
            Everything you need to know about ordering fresh brownies and cookies
            from {SITE.name}.
          </p>

          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-accent/15 bg-off-white shadow-sm"
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-accent transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <div className="border-t border-accent/10 px-5 py-4 text-sm leading-relaxed text-foreground/70">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-accent/15 bg-primary/15 p-6 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              Still have questions?
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              We&apos;re happy to help on WhatsApp or email.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${SITE.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-off-white transition hover:bg-accent/90"
              >
                Chat on WhatsApp
              </a>
              <Link
                href="/menu"
                className="inline-flex h-10 items-center justify-center rounded-full border border-accent/30 px-5 text-sm font-semibold text-accent transition hover:bg-primary/30"
              >
                Browse menu
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
