import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://thetatreats.com";

const SEO_DESCRIPTION =
  "Order handcrafted brownies and cookies from Theta Treats — fudgy classics, Lotus Biscoff, Nutella lava bombs, and more. Freshly baked to order. Place your order via WhatsApp.";

const SEO_KEYWORDS = [
  "Theta Treats",
  "handcrafted brownies",
  "handcrafted cookies",
  "brownies online",
  "cookies online",
  "order brownies",
  "order cookies",
  "premium pastries",
  "fudgy brownies",
  "Lotus Biscoff brownies",
  "pistachio brownies",
  "Nutella cookies",
  "bakery Chennai",
  "WhatsApp order",
  "fresh baked brownies",
  "fresh baked cookies",
  "India brownies",
] as const;

const OG_IMAGE = {
  path: "/brownies/classic-fudgy-brownie.png",
  width: 1200,
  height: 630,
  alt: "Classic fudgy brownies from Theta Treats",
} as const;

export const SEO = {
  title: `${SITE.name} | Handcrafted Brownies, Cookies & Premium Pastries`,
  titleTemplate: `%s | ${SITE.name}`,
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  ogImage: OG_IMAGE,
  locale: "en_IN",
  instagram: "https://www.instagram.com/theta_treats/",
  twitterHandle: "@theta_treats",
} as const;

export function createSiteMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SEO.title,
      template: SEO.titleTemplate,
    },
    description: SEO.description,
    keywords: [...SEO.keywords],
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE_URL }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "Food & Drink",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: SEO.locale,
      url: SITE_URL,
      siteName: SITE.name,
      title: SEO.title,
      description: SEO.description,
      images: [
        {
          url: SEO.ogImage.path,
          width: SEO.ogImage.width,
          height: SEO.ogImage.height,
          alt: SEO.ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SEO.title,
      description: SEO.description,
      images: [SEO.ogImage.path],
      creator: SEO.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: SITE.name,
    description: SEO.description,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE.logo}`,
    image: `${SITE_URL}${SEO.ogImage.path}`,
    telephone: SITE.phone,
    email: SITE.email,
    sameAs: [SEO.instagram],
    slogan: SITE.tagline,
    servesCuisine: "Desserts",
    priceRange: "₹₹",
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://wa.me/${SITE.phoneRaw}`,
        actionPlatform: [
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/DesktopWebPlatform",
        ],
      },
    },
  };
}
