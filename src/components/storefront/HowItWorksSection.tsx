import Link from "next/link";

const STEPS = [
  {
    title: "Browse & add to cart",
    description:
      "Explore brownies and cookies, pick your size or pack, and build your order.",
  },
  {
    title: "Checkout & schedule",
    description:
      "Enter delivery details, choose a date and slot, and apply promo codes if you have one.",
  },
  {
    title: "Pay your way",
    description:
      "Complete mock UPI or card payment on this demo site, or choose cash on delivery.",
  },
  {
    title: "Fresh bake & deliver",
    description:
      "We bake your order fresh, then deliver in your chosen window. Track status anytime.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-y border-accent/15 bg-primary/15 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Simple process
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
            From cart to doorstep in four easy steps — no account needed.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-accent/15 bg-off-white p-5 shadow-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-off-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/menu"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-off-white transition hover:bg-accent/90"
          >
            Browse full menu
          </Link>
          <Link
            href="/faq"
            className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-accent transition hover:bg-primary/30"
          >
            Read FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
