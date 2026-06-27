import { getCutoffMessage } from "@/lib/orders/delivery-slots";
import { formatDeliveryFeeMessage } from "@/lib/commerce/delivery";
import type { StoreSettings } from "@/lib/commerce/constants";
import { formatPrice } from "@/lib/products/formatting";

type DeliveryBannerProps = {
  settings: StoreSettings;
};

export function DeliveryBanner({ settings }: DeliveryBannerProps) {
  return (
    <div className="border-y border-accent/15 bg-primary/25 px-4 py-3">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 text-center text-sm text-foreground/80 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        <p>{getCutoffMessage()}</p>
        <span className="hidden text-accent/40 sm:inline" aria-hidden>
          ·
        </span>
        <p>{formatDeliveryFeeMessage(settings)}</p>
        <span className="hidden text-accent/40 sm:inline" aria-hidden>
          ·
        </span>
        <p>
          Min order {formatPrice(settings.minOrderAmount)}
        </p>
      </div>
    </div>
  );
}
