import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { DEFAULT_STORE_SETTINGS } from "@/lib/commerce/constants";
import { getStoreSettingsAdmin } from "@/lib/admin/queries";

function parseZones(raw: unknown) {
  if (!Array.isArray(raw)) return DEFAULT_STORE_SETTINGS.deliveryZones;
  return raw
    .filter(
      (z): z is { prefix: string; label?: string; fee: number } =>
        z &&
        typeof z === "object" &&
        typeof z.prefix === "string" &&
        typeof z.fee === "number",
    )
    .map((z) => ({
      prefix: z.prefix,
      label: z.label ?? z.prefix,
      fee: z.fee,
    }));
}

export default async function AdminSettingsPage() {
  const row = await getStoreSettingsAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Store settings
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Minimum order, delivery fees, and pincode zones shown at checkout.
      </p>

      <div className="mt-8">
        <StoreSettingsForm
          minOrderAmount={row?.min_order_amount ?? DEFAULT_STORE_SETTINGS.minOrderAmount}
          freeDeliveryThreshold={
            row?.free_delivery_threshold ??
            DEFAULT_STORE_SETTINGS.freeDeliveryThreshold
          }
          defaultDeliveryFee={
            row?.default_delivery_fee ?? DEFAULT_STORE_SETTINGS.defaultDeliveryFee
          }
          deliveryZones={parseZones(row?.delivery_zones)}
        />
      </div>
    </div>
  );
}
