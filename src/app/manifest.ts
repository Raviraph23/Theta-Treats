import type { MetadataRoute } from "next";
import { COLORS, SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: COLORS.offWhite,
    theme_color: COLORS.accent,
    orientation: "portrait-primary",
    categories: ["food", "shopping"],
    icons: [
      {
        src: "/theta (1).png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/theta (1).png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
