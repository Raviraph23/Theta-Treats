import type { DeliverySlot } from "@/lib/supabase/database.types";

export const DELIVERY_CUTOFF_HOUR = 18;

export const DELIVERY_SLOT_OPTIONS: {
  id: DeliverySlot;
  label: string;
  time: string;
}[] = [
  { id: "morning", label: "Morning", time: "9 AM – 12 PM" },
  { id: "afternoon", label: "Afternoon", time: "12 PM – 4 PM" },
  { id: "evening", label: "Evening", time: "4 PM – 8 PM" },
];

export const OCCASION_OPTIONS = [
  { value: "", label: "None" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "thank_you", label: "Thank you" },
  { value: "just_because", label: "Just because" },
  { value: "corporate", label: "Corporate gift" },
  { value: "other", label: "Other" },
] as const;

export const OCCASION_LABELS: Record<string, string> = Object.fromEntries(
  OCCASION_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label]),
);

export const DELIVERY_SLOT_LABELS = Object.fromEntries(
  DELIVERY_SLOT_OPTIONS.map((s) => [s.id, `${s.label} (${s.time})`]),
) as Record<DeliverySlot, string>;

export function isPastCutoff(now = new Date()): boolean {
  return now.getHours() >= DELIVERY_CUTOFF_HOUR;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getAvailableDeliveryDates(now = new Date()): {
  value: string;
  label: string;
}[] {
  const startOffset = isPastCutoff(now) ? 2 : 1;
  const dates: { value: string; label: string }[] = [];

  for (let i = 0; i < 4; i += 1) {
    const date = addDays(now, startOffset + i);
    const value = toDateKey(date);
    const weekday = date.toLocaleDateString("en-IN", { weekday: "short" });
    const dayMonth = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    dates.push({ value, label: `${weekday}, ${dayMonth}` });
  }

  return dates;
}

export function isValidDeliveryDate(value: string, now = new Date()): boolean {
  return getAvailableDeliveryDates(now).some((d) => d.value === value);
}

export function isValidDeliverySlot(value: string): value is DeliverySlot {
  return DELIVERY_SLOT_OPTIONS.some((slot) => slot.id === value);
}

export function formatDeliverySlot(
  deliveryDate: string | null,
  deliverySlot: DeliverySlot | null,
): string | null {
  if (!deliveryDate || !deliverySlot) return null;

  const date = new Date(`${deliveryDate}T12:00:00`);
  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const slotLabel = DELIVERY_SLOT_LABELS[deliverySlot];

  return `${dateLabel} · ${slotLabel}`;
}

export function getCutoffMessage(now = new Date()): string {
  if (isPastCutoff(now)) {
    return "Orders placed after 6 PM are baked for delivery in 2 days.";
  }
  return "Order by 6 PM for next-day delivery.";
}

export function formatOccasion(occasion: string | null): string | null {
  if (!occasion) return null;
  return OCCASION_LABELS[occasion] ?? occasion;
}
