export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidProductId(id: string): boolean {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) &&
    id.length >= 2 &&
    id.length <= 80
  );
}
