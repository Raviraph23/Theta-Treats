const locale = "en-IN";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatDateFull(iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(new Date(iso));
}

export function formatDateTimeFull(iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** YYYY-MM-DD in Asia/Kolkata (store timezone). */
export function getLocalDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/** Start/end ISO timestamps for a local calendar day in Asia/Kolkata. */
export function getLocalDayBounds(dateString: string): {
  start: string;
  end: string;
} {
  const start = new Date(`${dateString}T00:00:00+05:30`);
  const end = new Date(`${dateString}T23:59:59.999+05:30`);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Payment timestamp — medium date with time. */
export function formatPaidAt(iso: string): string {
  return formatDateTime(iso);
}
