import { NextResponse } from "next/server";
import { buildOrdersCsv } from "@/lib/admin/export";
import { getOrders } from "@/lib/admin/queries";
import { parseOrderFilters } from "@/lib/admin/stats";
import { requireAdmin } from "@/lib/admin/auth";
import { getLocalDateString } from "@/lib/format/date";

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const filters = parseOrderFilters({
    status: searchParams.get("status") ?? undefined,
    payment: searchParams.get("payment") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const orders = await getOrders(filters);
  const csv = buildOrdersCsv(orders);
  const filename = `theta-treats-orders-${getLocalDateString()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
