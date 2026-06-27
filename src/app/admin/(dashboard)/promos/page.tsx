import { AdminPromoList } from "@/components/admin/AdminPromoList";
import { PromoCreateForm } from "@/components/admin/PromoCreateForm";
import { getPromoCodes } from "@/lib/admin/queries";

export default async function AdminPromosPage() {
  const promos = await getPromoCodes();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Promo codes
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Manage discount codes for checkout. Demo codes: THETA10 (10% off), FLAT50
        (₹50 off, min ₹800).
      </p>

      <div className="mt-8">
        <AdminPromoList promos={promos} />
      </div>

      <div className="mt-8">
        <PromoCreateForm />
      </div>
    </div>
  );
}
