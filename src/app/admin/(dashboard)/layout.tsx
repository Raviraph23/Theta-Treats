import Link from "next/link";
import { signOut } from "@/app/actions/admin";
import { SITE } from "@/lib/constants";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-off-white">
      <header className="border-b border-accent/15 bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <Link
              href="/admin/orders"
              className="font-display text-xl font-semibold text-foreground"
            >
              {SITE.name} Admin
            </Link>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/admin/orders"
              className="text-foreground/70 hover:text-accent"
            >
              Orders
            </Link>
            <Link
              href="/admin/products"
              className="text-foreground/70 hover:text-accent"
            >
              Menu
            </Link>
            <Link
              href="/admin/customers"
              className="text-foreground/70 hover:text-accent"
            >
              Customers
            </Link>
            <Link href="/" className="text-foreground/70 hover:text-accent">
              Storefront
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-foreground/70 hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
