"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveStoreSettingsFromForm } from "@/app/actions/admin";
import type { DeliveryZone } from "@/lib/commerce/constants";

type StoreSettingsFormProps = {
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  defaultDeliveryFee: number;
  deliveryZones: DeliveryZone[];
};

export function StoreSettingsForm({
  minOrderAmount,
  freeDeliveryThreshold,
  defaultDeliveryFee,
  deliveryZones,
}: StoreSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>(
    deliveryZones.length > 0 ? deliveryZones : [{ prefix: "", label: "", fee: 0 }],
  );

  function addZone() {
    setZones((prev) => [...prev, { prefix: "", label: "", fee: 0 }]);
  }

  function removeZone(index: number) {
    setZones((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);

    zones.forEach((zone, index) => {
      formData.set(`zone_prefix_${index}`, zone.prefix);
      formData.set(`zone_label_${index}`, zone.label);
      formData.set(`zone_fee_${index}`, String(zone.fee));
    });

    startTransition(async () => {
      const result = await saveStoreSettingsFromForm(formData);
      if (result.success) {
        setMessage("Settings saved.");
        router.refresh();
      } else {
        setError(result.error ?? "Could not save settings.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-accent/15 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          Order rules
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="minOrderAmount" className="block text-sm font-medium">
              Minimum order (₹)
            </label>
            <input
              id="minOrderAmount"
              name="minOrderAmount"
              type="number"
              min={0}
              required
              defaultValue={minOrderAmount}
              className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="freeDeliveryThreshold"
              className="block text-sm font-medium"
            >
              Free delivery above (₹)
            </label>
            <input
              id="freeDeliveryThreshold"
              name="freeDeliveryThreshold"
              type="number"
              min={0}
              required
              defaultValue={freeDeliveryThreshold}
              className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="defaultDeliveryFee"
              className="block text-sm font-medium"
            >
              Default delivery fee (₹)
            </label>
            <input
              id="defaultDeliveryFee"
              name="defaultDeliveryFee"
              type="number"
              min={0}
              required
              defaultValue={defaultDeliveryFee}
              className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-accent/15 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Delivery zones
          </h2>
          <button
            type="button"
            onClick={addZone}
            className="text-sm font-medium text-accent hover:underline"
          >
            + Add zone
          </button>
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          Match pincode prefixes (e.g. 560 for central Bangalore). First match
          wins. Unmatched pincodes use the default fee.
        </p>

        <div className="mt-4 space-y-3">
          {zones.map((zone, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto]">
              <input
                value={zone.prefix}
                onChange={(e) =>
                  setZones((prev) =>
                    prev.map((z, i) =>
                      i === index ? { ...z, prefix: e.target.value } : z,
                    ),
                  )
                }
                placeholder="Prefix (560)"
                className="rounded-xl border border-accent/20 bg-off-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <input
                value={zone.label}
                onChange={(e) =>
                  setZones((prev) =>
                    prev.map((z, i) =>
                      i === index ? { ...z, label: e.target.value } : z,
                    ),
                  )
                }
                placeholder="Label"
                className="rounded-xl border border-accent/20 bg-off-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <input
                value={zone.fee}
                type="number"
                min={0}
                onChange={(e) =>
                  setZones((prev) =>
                    prev.map((z, i) =>
                      i === index
                        ? { ...z, fee: Number(e.target.value) || 0 }
                        : z,
                    ),
                  )
                }
                className="rounded-xl border border-accent/20 bg-off-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => removeZone(index)}
                className="text-sm text-foreground/50 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

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
        disabled={isPending}
        className="inline-flex h-11 items-center rounded-full bg-accent px-8 text-sm font-semibold text-off-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
