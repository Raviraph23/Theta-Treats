import { AdminTestimonialList } from "@/components/admin/AdminTestimonialList";
import { TestimonialCreateForm } from "@/components/admin/TestimonialCreateForm";
import { getTestimonials } from "@/lib/admin/queries";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Testimonials
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Manage customer quotes shown on the homepage.
      </p>

      <div className="mt-8">
        <AdminTestimonialList testimonials={testimonials} />
      </div>

      <div className="mt-8">
        <TestimonialCreateForm />
      </div>
    </div>
  );
}
