"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTestimonial, updateTestimonialActive } from "@/app/actions/admin";
import type { TestimonialRow } from "@/lib/supabase/database.types";

type AdminTestimonialListProps = {
  testimonials: TestimonialRow[];
};

export function AdminTestimonialList({ testimonials }: AdminTestimonialListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      await updateTestimonialActive(id, !isActive);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this testimonial?")) return;
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  }

  if (testimonials.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No testimonials yet. Add one below.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {testimonials.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-accent/15 bg-background p-5"
        >
          <blockquote className="text-sm leading-relaxed text-foreground/80">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {item.author_name}
            {item.author_role ? (
              <span className="font-normal text-foreground/60">
                {" "}
                · {item.author_role}
              </span>
            ) : null}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleActive(item.id, item.is_active)}
              disabled={isPending}
              className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
                item.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.is_active ? "Active" : "Hidden"}
            </button>
            <button
              type="button"
              onClick={() => remove(item.id)}
              disabled={isPending}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
