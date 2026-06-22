import { PRODUCT_ASSETS_BUCKET } from "@/lib/products/storage.constants";

export function isSupabaseStorageImageUrl(src: string): boolean {
  if (src.startsWith("/")) return false;
  try {
    const url = new URL(src);
    return (
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}

export function shouldUseUnoptimizedImage(src: string): boolean {
  return isSupabaseStorageImageUrl(src);
}

/** Normalize legacy storage paths and public asset paths for next/image. */
export function resolveProductImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) {
    return trimmed;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return trimmed;

  return `${base}/storage/v1/object/public/${PRODUCT_ASSETS_BUCKET}/${trimmed}`;
}
