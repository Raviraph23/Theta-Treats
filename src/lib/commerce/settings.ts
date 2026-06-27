import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  DEFAULT_STORE_SETTINGS,
  STORE_SETTINGS_CACHE_TAG,
  type DeliveryZone,
  type StoreSettings,
} from "@/lib/commerce/constants";

function parseDeliveryZones(raw: unknown): DeliveryZone[] {
  if (!Array.isArray(raw)) return DEFAULT_STORE_SETTINGS.deliveryZones;

  const zones: DeliveryZone[] = [];
  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      "prefix" in item &&
      "fee" in item &&
      typeof item.prefix === "string" &&
      typeof item.fee === "number"
    ) {
      zones.push({
        prefix: item.prefix,
        label:
          "label" in item && typeof item.label === "string"
            ? item.label
            : item.prefix,
        fee: item.fee,
      });
    }
  }

  return zones.length > 0 ? zones : DEFAULT_STORE_SETTINGS.deliveryZones;
}

function rowToSettings(
  row: Database["public"]["Tables"]["store_settings"]["Row"],
): StoreSettings {
  return {
    minOrderAmount: row.min_order_amount,
    freeDeliveryThreshold: row.free_delivery_threshold,
    defaultDeliveryFee: row.default_delivery_fee,
    deliveryZones: parseDeliveryZones(row.delivery_zones),
  };
}

const fetchStoreSettingsFromDb = unstable_cache(
  async (): Promise<StoreSettings> => {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      console.error("getStoreSettings error:", error);
      return DEFAULT_STORE_SETTINGS;
    }

    return rowToSettings(data);
  },
  ["store-settings"],
  { tags: [STORE_SETTINGS_CACHE_TAG] },
);

export const getStoreSettings = cache(fetchStoreSettingsFromDb);
