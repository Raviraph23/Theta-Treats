export type WeightOption = "500g" | "750g" | "1kg";
export type PackOption = "3" | "6" | "12";
export type ProductVariant = WeightOption | PackOption;
export type ProductCategory = "brownie" | "cookie";

export type WeightPricing = Record<WeightOption, number>;
export type PackPricing = Record<PackOption, number>;

type BaseProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  isActive?: boolean;
  sortOrder?: number;
};

export type BrownieProduct = BaseProduct & {
  category: "brownie";
  pricing: WeightPricing;
};

export type CookieProduct = BaseProduct & {
  category: "cookie";
  pricing: PackPricing;
};

export type Product = BrownieProduct | CookieProduct;

export const WEIGHT_OPTIONS: WeightOption[] = ["500g", "750g", "1kg"];
export const PACK_OPTIONS: PackOption[] = ["3", "6", "12"];
