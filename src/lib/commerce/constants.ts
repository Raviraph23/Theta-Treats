export type DeliveryZone = {
  prefix: string;
  label: string;
  fee: number;
};

export type StoreSettings = {
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  defaultDeliveryFee: number;
  deliveryZones: DeliveryZone[];
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  minOrderAmount: 500,
  freeDeliveryThreshold: 999,
  defaultDeliveryFee: 49,
  deliveryZones: [
    { prefix: "560", label: "Central Bangalore", fee: 0 },
    { prefix: "561", label: "North Bangalore", fee: 39 },
    { prefix: "562", label: "East Bangalore", fee: 39 },
    { prefix: "563", label: "South Bangalore", fee: 49 },
  ],
};

export const STORE_SETTINGS_CACHE_TAG = "store-settings";
