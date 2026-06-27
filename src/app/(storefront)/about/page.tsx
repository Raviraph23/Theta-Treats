import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { ABOUT_STORY } from "@/lib/content/about";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE.name} — handcrafted brownies and cookies baked fresh to order with premium ingredients.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Our story
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
            {ABOUT_STORY.headline}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/75">
            {ABOUT_STORY.intro}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {ABOUT_STORY.values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-accent/15 bg-off-white p-5 shadow-sm"
              >
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground">
              From order to oven
            </h2>
            <ol className="mt-6 space-y-4">
              {ABOUT_STORY.process.map((step) => (
                <li
                  key={step.step}
                  className="flex gap-4 rounded-2xl border border-accent/15 bg-primary/15 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-off-white">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-10 rounded-2xl border border-accent/15 bg-off-white p-6 text-center shadow-sm">
            <p className="font-display text-xl font-semibold text-foreground">
              Ready to taste the difference?
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              Browse our full menu or reach out on WhatsApp — we&apos;d love to
              bake for you.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition hover:bg-accent/90"
              >
                View menu
              </Link>
              <a
                href={`https://wa.me/${SITE.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
