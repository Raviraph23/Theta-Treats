import { createClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/lib/supabase/database.types";

export async function getActiveTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getActiveTestimonials error:", error);
    return [];
  }

  return (data ?? []) as TestimonialRow[];
}
