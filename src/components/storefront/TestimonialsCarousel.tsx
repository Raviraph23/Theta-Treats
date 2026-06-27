"use client";

import { useCallback, useEffect, useState } from "react";
import type { TestimonialRow } from "@/lib/supabase/database.types";

type TestimonialsCarouselProps = {
  testimonials: TestimonialRow[];
};

const AUTO_ADVANCE_MS = 6000;

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const active = testimonials[activeIndex];

  return (
    <div className="relative mx-auto max-w-2xl">
      <figure className="rounded-2xl border border-accent/10 bg-background px-6 py-8 shadow-sm sm:px-10 sm:py-10">
        <blockquote className="text-center text-base leading-relaxed text-foreground/85 sm:text-lg">
          &ldquo;{active.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 text-center">
          <p className="font-semibold text-foreground">{active.author_name}</p>
          {active.author_role ? (
            <p className="text-sm text-foreground/60">{active.author_role}</p>
          ) : null}
        </figcaption>
      </figure>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/20 text-accent transition hover:bg-primary/30"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Testimonial ${index + 1} of ${count}`}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition ${
                  index === activeIndex
                    ? "w-6 bg-accent"
                    : "w-2 bg-accent/30 hover:bg-accent/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/20 text-accent transition hover:bg-primary/30"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
