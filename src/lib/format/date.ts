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

/** Payment timestamp — medium date with time. */
export function formatPaidAt(iso: string): string {
  return formatDateTime(iso);
}
