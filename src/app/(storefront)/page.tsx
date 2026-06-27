import { ContactSection } from "@/components/storefront/ContactSection";
import { BestsellersSection } from "@/components/storefront/BestsellersSection";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { InstagramSection } from "@/components/storefront/InstagramSection";
import { getStoreSettings } from "@/lib/commerce/settings";
import { getProductsSoldToday } from "@/lib/commerce/stock";
import { getActiveProducts } from "@/lib/products/catalog";
import { getFeaturedProducts } from "@/lib/products/featured";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);
  const soldToday = await getProductsSoldToday(products.map((p) => p.id));
  const featured = getFeaturedProducts(products, 4);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <DeliveryBanner settings={settings} />

        <BestsellersSection products={featured} soldToday={soldToday} />

        <InstagramSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
