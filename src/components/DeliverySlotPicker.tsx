"use client";

import {
  DELIVERY_SLOT_OPTIONS,
  getAvailableDeliveryDates,
  getCutoffMessage,
} from "@/lib/orders/delivery-slots";

type DeliverySlotPickerProps = {
  defaultDate?: string;
  defaultSlot?: string;
};

export function DeliverySlotPicker({
  defaultDate,
  defaultSlot,
}: DeliverySlotPickerProps) {
  const dates = getAvailableDeliveryDates();

  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium">Preferred delivery</legend>
      <p className="text-xs text-foreground/60">{getCutoffMessage()}</p>

      <div>
        <label htmlFor="deliveryDate" className="sr-only">
          Delivery date
        </label>
        <select
          id="deliveryDate"
          name="deliveryDate"
          required
          defaultValue={defaultDate ?? dates[0]?.value}
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
        >
          {dates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {DELIVERY_SLOT_OPTIONS.map((slot) => (
          <label
            key={slot.id}
            className="flex cursor-pointer items-start gap-2 rounded-xl border border-accent/20 bg-off-white px-3 py-3 has-[:checked]:border-accent has-[:checked]:bg-primary/30"
          >
            <input
              type="radio"
              name="deliverySlot"
              value={slot.id}
              required
              defaultChecked={defaultSlot ? defaultSlot === slot.id : slot.id === "evening"}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="block font-medium">{slot.label}</span>
              <span className="text-xs text-foreground/60">{slot.time}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
