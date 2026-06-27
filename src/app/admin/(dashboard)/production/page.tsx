import { AdminProductionList } from "@/components/admin/AdminProductionList";
import { getOrders } from "@/lib/admin/queries";
import { computeProductionSummary } from "@/lib/admin/stats";

export default async function AdminProductionPage() {
  const orders = await getOrders();
  const production = computeProductionSummary(orders);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Production
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Quantities to bake for today&apos;s scheduled deliveries.
      </p>

      <div className="mt-8">
        <AdminProductionList summary={production} />
      </div>
    </div>
  );
}
