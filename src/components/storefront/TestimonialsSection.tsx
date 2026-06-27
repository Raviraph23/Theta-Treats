import { TestimonialsCarousel } from "@/components/storefront/TestimonialsCarousel";
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

        <div className="mt-10">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
