import type { Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { createOrganizationJsonLd, createSiteMetadata } from "@/lib/seo";
import { COLORS } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const brittany = localFont({
  src: "../fonts/BrittanySignature.woff",
  variable: "--font-brittany",
  weight: "400",
});

export const metadata = createSiteMetadata();

export const viewport: Viewport = {
  themeColor: COLORS.accent,
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = createOrganizationJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${brittany.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
