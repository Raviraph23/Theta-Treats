"use client";

import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { InstagramSection } from "@/components/InstagramSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

export function Storefront() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />

        <section id="brownies" className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Menu
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
                Brownies
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
                Every brownie is baked fresh to order. Add to cart and place your
                order via WhatsApp — we&apos;ll confirm delivery details with
                you.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <InstagramSection />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
