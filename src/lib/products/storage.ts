import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductCategory } from "@/data/products";
import { PRODUCT_ASSETS_BUCKET } from "@/lib/products/storage.constants";

export { PRODUCT_ASSETS_BUCKET };
export {
  isSupabaseStorageImageUrl,
  resolveProductImageSrc,
  shouldUseUnoptimizedImage,
} from "@/lib/products/image-src";

export function storageFolderForCategory(category: ProductCategory): string {
  return category === "brownie" ? "brownies" : "Cookies";
}

export function getProductImagePublicUrl(storagePath: string): string {
  const admin = createAdminClient();
  return admin.storage.from(PRODUCT_ASSETS_BUCKET).getPublicUrl(storagePath)
    .data.publicUrl;
}

export type StorageImageOption = {
  path: string;
  url: string;
  name: string;
};

export async function listProductImages(
  category: ProductCategory,
): Promise<StorageImageOption[]> {
  const admin = createAdminClient();
  const folder = storageFolderForCategory(category);
  const { data, error } = await admin.storage
    .from(PRODUCT_ASSETS_BUCKET)
    .list(folder);

  if (error || !data) {
    console.error("listProductImages error:", error);
    return [];
  }

  return data
    .filter((file) => file.name && /\.(png|jpe?g|webp)$/i.test(file.name))
    .map((file) => {
      const path = `${folder}/${file.name}`;
      return {
        path,
        url: getProductImagePublicUrl(path),
        name: file.name,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function uploadProductImage(
  category: ProductCategory,
  file: File,
): Promise<{ path: string; url: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
  const folder = storageFolderForCategory(category);
  const path = `${folder}/${safeName}`;

  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from(PRODUCT_ASSETS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("uploadProductImage error:", error);
    return { error: "Could not upload image." };
  }

  return { path, url: getProductImagePublicUrl(path) };
}
