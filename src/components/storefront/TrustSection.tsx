const TRUST_BADGES = [
  {
    title: "Fresh-baked daily",
    description: "Every order is baked to schedule — never from a warehouse shelf.",
    icon: OvenIcon,
  },
  {
    title: "Premium ingredients",
    description: "Belgian chocolate, real butter, and quality nuts in every batch.",
    icon: LeafIcon,
  },
  {
    title: "Handcrafted with care",
    description: "Small-batch baking with attention to texture, taste, and finish.",
    icon: HeartIcon,
  },
  {
    title: "Egg-free baking",
    description:
      "Every brownie and cookie is made without eggs — wholesome indulgence for more people.",
    icon: EggFreeIcon,
  },
] as const;

export function TrustSection() {
  return (
    <section className="border-y border-accent/15 bg-background px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Why Theta Treats
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            Baked with intention
          </h2>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <li
              key={badge.title}
              className="flex flex-col items-center rounded-2xl border border-accent/10 bg-off-white p-6 text-center shadow-sm"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/40 text-accent">
                <badge.icon />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {badge.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {badge.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OvenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h6" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function EggFreeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
