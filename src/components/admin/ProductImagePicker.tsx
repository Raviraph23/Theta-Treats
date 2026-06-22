"use client";

import { ProductImage } from "@/components/ProductImage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  refreshProductStorageImages,
  uploadProductImageAction,
} from "@/app/actions/admin";
import type { ProductCategory } from "@/data/products";
import type { StorageImageOption } from "@/lib/products/storage";

type ProductImagePickerProps = {
  category: ProductCategory;
  value: string;
  onChange: (url: string) => void;
  storageImages: StorageImageOption[];
};

export function ProductImagePicker({
  category,
  value,
  onChange,
  storageImages,
}: ProductImagePickerProps) {
  const router = useRouter();
  const [images, setImages] = useState(storageImages);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  useEffect(() => {
    setImages(storageImages);
  }, [storageImages]);

  function handleUploadClick() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Choose an image file.");
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      const result = await uploadProductImageAction(category, formData);
      if (!result.success || !result.url) {
        setUploadError(result.error ?? "Upload failed.");
        return;
      }

      const refreshed = await refreshProductStorageImages(category);
      setImages(refreshed);
      onChange(result.url);
      router.refresh();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  }

  function applyUrlInput() {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
    }
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="image" value={value} required />

      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-accent/15 bg-primary/10 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <ProductImage
              src={value}
              alt="Selected product"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <p className="text-xs text-foreground/70 break-all">{value}</p>
        </div>
      )}

      <div>
        <label htmlFor="image-url" className="block text-sm font-medium">
          Image URL
        </label>
        <p className="mt-1 text-xs text-foreground/60">
          Paste a Supabase Storage public URL, or a local path like{" "}
          <code className="text-foreground/80">/brownies/name.png</code>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="image-url"
            type="text"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onBlur={applyUrlInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyUrlInput();
              }
            }}
            placeholder="https://….supabase.co/storage/v1/object/public/…"
            className="min-w-0 flex-1 rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={applyUrlInput}
            className="rounded-full border border-accent/30 px-4 py-2 text-sm font-semibold text-accent"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Choose from storage</p>
        {images.length === 0 ? (
          <p className="mt-2 text-sm text-foreground/60">
            No images in storage for this category yet. Upload one below.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((image) => {
              const selected = value === image.url;
              return (
                <button
                  key={image.path}
                  type="button"
                  onClick={() => onChange(image.url)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                    selected
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-accent/15 hover:border-accent/40"
                  }`}
                >
                  <ProductImage
                    src={image.url}
                    alt={image.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-accent/25 p-4">
        <p className="text-sm font-medium">Upload new image</p>
        <p className="mt-1 text-xs text-foreground/60">
          PNG, JPG, or WebP up to 5 MB. Saved to Supabase Storage.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="max-w-full text-sm"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="rounded-full border border-accent/30 px-4 py-2 text-sm font-semibold text-accent disabled:opacity-60"
          >
            {isUploading ? "Uploading…" : "Upload"}
          </button>
        </div>
        {uploadError && (
          <p className="mt-2 text-sm text-red-700">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
