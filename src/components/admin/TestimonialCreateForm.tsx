"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTestimonialFromForm } from "@/app/actions/admin";

export function TestimonialCreateForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    const result = await createTestimonialFromForm(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Could not create testimonial.");
      return;
    }

    router.refresh();
    (document.getElementById("testimonial-form") as HTMLFormElement | null)?.reset();
  }

  return (
    <form
      id="testimonial-form"
      action={handleSubmit}
      className="rounded-2xl border border-accent/15 bg-background p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        Add testimonial
      </h2>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-foreground/70">Quote</span>
          <textarea
            name="quote"
            required
            rows={3}
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-3 py-2"
            placeholder="What did the customer say?"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-foreground/70">Author name</span>
            <input
              name="authorName"
              required
              className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-3 py-2"
              placeholder="Priya S."
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-foreground/70">
              Location / role (optional)
            </span>
            <input
              name="authorRole"
              className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-3 py-2"
              placeholder="Koramangala"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Add testimonial"}
      </button>
    </form>
  );
}
