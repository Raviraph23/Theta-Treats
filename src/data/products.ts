export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: "classic-fudgy",
    name: "Classic Fudgy Brownies",
    description:
      "Rich, dense, and deeply chocolatey. Our signature brownie with a crackly top and molten fudgy center.",
    price: 150,
    image: "/brownies/classic-fudgy-brownie.png",
    tags: ["Bestseller"],
  },
  {
    id: "banana-walnut",
    name: "Banana Walnut Brownies",
    description:
      "Ripe banana folded into fudgy chocolate batter with toasted walnuts for a wholesome, nutty bite.",
    price: 180,
    image: "/brownies/banana-walnut-brownie.png",
    tags: ["Wholesome"],
  },
  {
    id: "rich-coffee",
    name: "Rich Coffee Brownies",
    description:
      "Dark chocolate meets bold espresso in a deeply indulgent brownie with a subtle coffee kick.",
    price: 170,
    image: "/brownies/rich-coffee-brownie.png",
    tags: ["Bold"],
  },
  {
    id: "lotus-biscoff",
    name: "Lotus Biscoff Brownies",
    description:
      "Caramelized Biscoff biscuit crumbs swirled through chocolate brownie — buttery, spiced, irresistible.",
    price: 190,
    image: "/brownies/lotus-biscoff-brownie.png",
    tags: ["Fan favourite"],
  },
  {
    id: "pistachio",
    name: "Pistachio Brownies",
    description:
      "Premium pistachios baked into rich chocolate with a delicate green pistachio drizzle on top.",
    price: 200,
    image: "/brownies/pistachio-brownie.png",
    tags: ["Premium"],
  },
  {
    id: "oreo",
    name: "Oreo Brownies",
    description:
      "Creamy cookie chunks and crushed Oreo folded into fudgy chocolate — a playful classic twist.",
    price: 180,
    image: "/brownies/oreo-brownie.png",
    tags: ["Indulgent"],
  },
];

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
