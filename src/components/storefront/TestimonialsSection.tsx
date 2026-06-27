import type { TestimonialRow } from "@/lib/supabase/database.types";

type TestimonialsSectionProps = {
  testimonials: TestimonialRow[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-off-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Loved by customers
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            What people are saying
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-accent/10 bg-background p-6 shadow-sm"
            >
              <blockquote className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4">
                <p className="font-semibold text-foreground">{item.author_name}</p>
                {item.author_role ? (
                  <p className="text-sm text-foreground/60">{item.author_role}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
