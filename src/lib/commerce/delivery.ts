import type { StoreSettings } from "@/lib/commerce/constants";
import { formatPrice } from "@/lib/products/formatting";

export function extractPincode(address: string): string | null {
  const matches = address.match(/\b(\d{6})\b/g);
  if (!matches?.length) return null;
  return matches[matches.length - 1] ?? null;
}

export function matchDeliveryZone(
  address: string,
  settings: StoreSettings,
): { label: string; fee: number } | null {
  const pincode = extractPincode(address);
  if (!pincode) return null;

  const sorted = [...settings.deliveryZones].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );

  for (const zone of sorted) {
    if (pincode.startsWith(zone.prefix)) {
      return { label: zone.label, fee: zone.fee };
    }
  }

  return null;
}

export function calculateDeliveryFee(
  subtotalAfterDiscount: number,
  address: string,
  settings: StoreSettings,
): { fee: number; zoneLabel: string | null; isFree: boolean } {
  if (subtotalAfterDiscount >= settings.freeDeliveryThreshold) {
    return { fee: 0, zoneLabel: null, isFree: true };
  }

  const zone = matchDeliveryZone(address, settings);
  const fee = zone?.fee ?? settings.defaultDeliveryFee;

  return {
    fee,
    zoneLabel: zone?.label ?? null,
    isFree: fee === 0,
  };
}

export function formatDeliveryFeeMessage(settings: StoreSettings): string {
  return `Free delivery on orders above ${formatPrice(settings.freeDeliveryThreshold)}`;
}
