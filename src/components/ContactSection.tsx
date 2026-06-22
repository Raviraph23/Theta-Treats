import { SITE } from "@/lib/constants";

export function ContactSection() {
  return (
    <section id="contact" className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Get in Touch
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            Contact Us
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
            Have a question, custom order, or bulk enquiry? We&apos;d love to
            hear from you.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="flex items-center gap-4 rounded-2xl border border-accent/15 bg-off-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl">
              📞
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Phone
              </p>
              <p className="mt-0.5 font-semibold text-foreground">
                {SITE.phone}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-4 rounded-2xl border border-accent/15 bg-off-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl">
              ✉️
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Email
              </p>
              <p className="mt-0.5 truncate font-semibold text-foreground">
                {SITE.email}
              </p>
            </div>
          </a>

          <a
            href={`https://wa.me/${SITE.phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-accent/15 bg-off-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99] sm:col-span-2"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-xl">
              💬
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                WhatsApp
              </p>
              <p className="mt-0.5 font-semibold text-foreground">
                Chat with us on WhatsApp
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
