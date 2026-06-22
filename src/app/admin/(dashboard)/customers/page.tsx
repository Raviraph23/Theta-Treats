import Link from "next/link";
import { getCustomers } from "@/lib/admin/queries";
import { formatPhoneDisplay } from "@/lib/orders/validation";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Customers
        </h1>
        <span className="text-sm text-foreground/60">
          {customers.length} total
        </span>
      </div>

      <p className="mt-2 text-sm text-foreground/60">
        Repeat buyers are tracked by phone when they place an order.
      </p>

      {customers.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">
          No customers yet. They&apos;ll appear here after the first checkout.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-accent/15">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-accent/15 bg-primary/20">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Last address</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-accent/10 last:border-0 hover:bg-primary/10"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/80">
                    {formatPhoneDisplay(customer.phone)}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-foreground/70">
                    <span className="line-clamp-2">
                      {customer.last_address ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {customer.order_count}
                  </td>
                  <td className="px-4 py-3 text-foreground/70">
                    {formatDate(customer.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
