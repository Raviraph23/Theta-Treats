"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createProductFromForm,
  saveProductFromForm,
} from "@/app/actions/admin";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";
import { TAG_SUGGESTIONS } from "@/lib/products/admin-form";
import { slugify } from "@/lib/products/slug";
import type { StorageImagesByCategory } from "@/lib/admin/queries";
import {
  formatPrice,
  formatVariantLabel,
} from "@/lib/products/formatting";
import { PACK_OPTIONS, WEIGHT_OPTIONS } from "@/types/product";
import type { Product, ProductCategory } from "@/types/product";

type ProductFormProps = {
  storageImagesByCategory: StorageImagesByCategory;
} & (
  | { mode: "create" }
  | { mode: "edit"; product: Product }
);

export function ProductForm(props: ProductFormProps) {
  const router = useRouter();
  const isCreate = props.mode === "create";
  const product = props.mode === "edit" ? props.product : null;

  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "brownie",
  );
  const [productId, setProductId] = useState(product?.id ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image ?? "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = product?.category ?? category;
  const variants =
    activeCategory === "brownie" ? WEIGHT_OPTIONS : PACK_OPTIONS;
  const labelProduct = product ?? ({ category: activeCategory } as Product);
  const currentTag = product?.tags[0] ?? "";

  function handleNameBlur(name: string) {
    if (!isCreate || productId.trim()) return;
    const slug = slugify(name);
    if (slug) setProductId(slug);
  }

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);

    if (isCreate) {
      formData.set("category", category);
      formData.set("id", productId.trim());
    }
    formData.set("image", imageUrl);

    startTransition(async () => {
      if (isCreate) {
        const result = await createProductFromForm(formData);
        if (result.success && result.productId) {
          router.push(`/admin/products/${result.productId}`);
          return;
        }
        setError(result.error ?? "Could not create product.");
        return;
      }

      const result = await saveProductFromForm(product!.id, formData);
      if (result.success) {
        setMessage("Saved.");
        router.refresh();
      } else {
        setError(result.error ?? "Could not save.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {isCreate && (
        <fieldset className="rounded-2xl border border-accent/15 p-5">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-accent">
            Category
          </legend>
          <div className="mt-3 flex gap-4">
            {(["brownie", "cookie"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="categoryChoice"
                  value={value}
                  checked={category === value}
                  onChange={() => {
                    setCategory(value);
                    setImageUrl("");
                  }}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={product?.name ?? ""}
          required
          onBlur={(event) => handleNameBlur(event.target.value)}
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      {isCreate && (
        <div>
          <label htmlFor="id" className="block text-sm font-medium">
            ID (URL slug)
          </label>
          <input
            id="id"
            name="id"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-foreground/60">
            Lowercase letters, numbers, and hyphens only. Auto-filled from name.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          required
          className="mt-1 w-full resize-none rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="tag" className="block text-sm font-medium">
          Tag <span className="font-normal text-foreground/50">(optional badge on photo)</span>
        </label>
        <input
          id="tag"
          name="tag"
          list="tag-suggestions"
          defaultValue={currentTag}
          placeholder="e.g. Bestseller"
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <datalist id="tag-suggestions">
          {TAG_SUGGESTIONS.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>

      <fieldset className="rounded-2xl border border-accent/15 p-5">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-accent">
          Image
        </legend>
        <div className="mt-3">
          <ProductImagePicker
            category={product?.category ?? category}
            value={imageUrl}
            onChange={setImageUrl}
            storageImages={
              props.storageImagesByCategory[product?.category ?? category]
            }
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-accent/15 p-5">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-accent">
          Pricing
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {variants.map((variant) => (
            <div key={variant}>
              <label
                htmlFor={`price_${variant}`}
                className="block text-sm font-medium"
              >
                {formatVariantLabel(labelProduct, variant)}
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/50">
                  ₹
                </span>
                <input
                  id={`price_${variant}`}
                  name={`price_${variant}`}
                  type="number"
                  min={1}
                  step={1}
                  required
                  defaultValue={
                    product
                      ? product.pricing[
                          variant as keyof typeof product.pricing
                        ]
                      : undefined
                  }
                  className="w-full rounded-xl border border-accent/20 bg-off-white py-3 pl-7 pr-4 text-sm outline-none focus:border-accent"
                />
              </div>
              {product && (
                <p className="mt-1 text-xs text-foreground/50">
                  Current:{" "}
                  {formatPrice(
                    product.pricing[
                      variant as keyof typeof product.pricing
                    ],
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={product ? product.isActive !== false : true}
          className="h-4 w-4 rounded border-accent/30"
        />
        <span>Show on storefront (available to order)</span>
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="isSoldOut"
          defaultChecked={product?.isSoldOut === true}
          className="h-4 w-4 rounded border-accent/30"
        />
        <span>Mark as sold out (visible but not orderable)</span>
      </label>

      <div>
        <label htmlFor="dailyLimit" className="block text-sm font-medium">
          Daily limit{" "}
          <span className="font-normal text-foreground/50">(optional)</span>
        </label>
        <input
          id="dailyLimit"
          name="dailyLimit"
          type="number"
          min={1}
          defaultValue={product?.dailyLimit ?? ""}
          placeholder="e.g. 20"
          className="mt-1 w-full max-w-xs rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <p className="mt-1 text-xs text-foreground/60">
          Max units sold per day. Shows &quot;Sold out today&quot; when reached.
        </p>
      </div>

      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !imageUrl}
        className="inline-flex h-11 items-center rounded-full bg-accent px-8 text-sm font-semibold text-off-white disabled:opacity-60"
      >
        {isPending
          ? isCreate
            ? "Creating…"
            : "Saving…"
          : isCreate
            ? "Create product"
            : "Save changes"}
      </button>
    </form>
  );
}
