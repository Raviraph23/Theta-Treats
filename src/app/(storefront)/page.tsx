import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InstagramSection } from "@/components/InstagramSection";
import { MenuSection } from "@/components/storefront/MenuSection";
import { getActiveProducts } from "@/lib/products/catalog";

export default async function Home() {
  const products = await getActiveProducts();
  const brownies = products.filter((p) => p.category === "brownie");
  const cookies = products.filter((p) => p.category === "cookie");

  return (
    <>
      <Header />
      <main>
        <Hero />

        <MenuSection
          id="brownies"
          title="Brownies"
          description="Every brownie is baked fresh to order. Add to cart and place your order via WhatsApp — we'll confirm delivery details with you."
          products={brownies}
        />

        <MenuSection
          id="cookies"
          title="Cookies"
          description="Handcrafted cookies in packs of 3, 6, or 12. From classic chocolate chunk to luxury stuffed varieties — baked fresh when you order."
          products={cookies}
        />

        <InstagramSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
