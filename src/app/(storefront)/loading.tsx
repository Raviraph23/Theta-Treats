import { ContactSection } from "@/components/storefront/ContactSection";
import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { InstagramSection } from "@/components/storefront/InstagramSection";
import { Skeleton } from "@/components/loading/Skeleton";

function MenuSectionSkeleton() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <Skeleton className="mx-auto h-3 w-20" />
          <Skeleton className="mx-auto mt-3 h-9 w-40" />
          <Skeleton className="mx-auto mt-3 h-4 w-full max-w-md" />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-accent/15 bg-off-white"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-2 h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StorefrontLoading() {
  return (
    <>
      <Header />
      <main aria-busy="true" aria-label="Loading menu">
        <Hero />
        <MenuSectionSkeleton />
        <MenuSectionSkeleton />
        <InstagramSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
