import type {
  OrderStatus,
  OrderWithItems,
  PaymentStatus,
} from "@/lib/supabase/database.types";
import { getLocalDateString, getLocalDayBounds } from "@/lib/format/date";

export type DashboardStats = {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  deliveredToday: number;
};

export type DailyMetric = {
  date: string;
  label: string;
  orders: number;
  revenue: number;
};

export type ProductionLine = {
  productName: string;
  variantLabel: string;
  quantity: number;
};

export type ProductionOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  deliverySlot: string | null;
  status: OrderStatus;
  itemCount: number;
};

export type ProductionSummary = {
  date: string;
  lines: ProductionLine[];
  orders: ProductionOrder[];
};

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

function isCountableOrder(status: OrderStatus): boolean {
  return status !== "cancelled";
}

function isRevenueOrder(status: OrderStatus, paymentStatus: PaymentStatus): boolean {
  return status !== "cancelled" && paymentStatus !== "failed";
}

export function computeDashboardStats(orders: OrderWithItems[]): DashboardStats {
  const today = getLocalDateString();
  const { start, end } = getLocalDayBounds(today);

  let ordersToday = 0;
  let revenueToday = 0;
  let pendingOrders = 0;
  let deliveredToday = 0;

  for (const order of orders) {
    if (order.status === "pending") pendingOrders += 1;

    const createdToday =
      order.created_at >= start && order.created_at <= end;

    if (createdToday && isCountableOrder(order.status)) {
      ordersToday += 1;
      if (isRevenueOrder(order.status, order.payment_status)) {
        revenueToday += order.total;
      }
    }

    if (
      order.status === "delivered" &&
      order.updated_at >= start &&
      order.updated_at <= end
    ) {
      deliveredToday += 1;
    }
  }

  return { ordersToday, revenueToday, pendingOrders, deliveredToday };
}

export function computeWeeklyMetrics(orders: OrderWithItems[]): DailyMetric[] {
  const days: DailyMetric[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const dateString = getLocalDateString(date);
    const { start, end } = getLocalDayBounds(dateString);

    let dayOrders = 0;
    let dayRevenue = 0;

    for (const order of orders) {
      if (order.created_at < start || order.created_at > end) continue;
      if (!isCountableOrder(order.status)) continue;
      dayOrders += 1;
      if (isRevenueOrder(order.status, order.payment_status)) {
        dayRevenue += order.total;
      }
    }

    const label = new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);

    days.push({ date: dateString, label, orders: dayOrders, revenue: dayRevenue });
  }

  return days;
}

export function computeProductionSummary(
  orders: OrderWithItems[],
  dateString = getLocalDateString(),
): ProductionSummary {
  const bakeStatuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
  ];

  const todaysOrders = orders.filter(
    (order) =>
      order.delivery_date === dateString &&
      bakeStatuses.includes(order.status),
  );

  const lineMap = new Map<string, ProductionLine>();

  for (const order of todaysOrders) {
    for (const item of order.order_items) {
      const key = `${item.product_name}::${item.variant_label}`;
      const existing = lineMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        lineMap.set(key, {
          productName: item.product_name,
          variantLabel: item.variant_label,
          quantity: item.quantity,
        });
      }
    }
  }

  const lines = [...lineMap.values()].sort((a, b) => {
    const nameCompare = a.productName.localeCompare(b.productName);
    if (nameCompare !== 0) return nameCompare;
    return a.variantLabel.localeCompare(b.variantLabel);
  });

  const productionOrders: ProductionOrder[] = todaysOrders
    .map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      deliverySlot: order.delivery_slot,
      status: order.status,
      itemCount: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
    }))
    .sort((a, b) => a.orderNumber.localeCompare(b.orderNumber));

  return { date: dateString, lines, orders: productionOrders };
}

export type OrderFilters = {
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  dateFrom?: string;
  dateTo?: string;
};

export function filterOrders(
  orders: OrderWithItems[],
  filters: OrderFilters,
): OrderWithItems[] {
  return orders.filter((order) => {
    if (filters.status && filters.status !== "all" && order.status !== filters.status) {
      return false;
    }
    if (
      filters.paymentStatus &&
      filters.paymentStatus !== "all" &&
      order.payment_status !== filters.paymentStatus
    ) {
      return false;
    }
    if (filters.dateFrom) {
      const { start } = getLocalDayBounds(filters.dateFrom);
      if (order.created_at < start) return false;
    }
    if (filters.dateTo) {
      const { end } = getLocalDayBounds(filters.dateTo);
      if (order.created_at > end) return false;
    }
    return true;
  });
}

export function parseOrderFilters(searchParams: {
  status?: string;
  payment?: string;
  from?: string;
  to?: string;
}): OrderFilters {
  const statusValues: (OrderStatus | "all")[] = [
    "all",
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  const paymentValues: (PaymentStatus | "all")[] = [
    "all",
    "pending",
    "paid",
    "failed",
    "cod",
  ];

  const status = statusValues.includes(searchParams.status as OrderStatus | "all")
    ? (searchParams.status as OrderStatus | "all")
    : "all";
  const paymentStatus = paymentValues.includes(
    searchParams.payment as PaymentStatus | "all",
  )
    ? (searchParams.payment as PaymentStatus | "all")
    : "all";

  return {
    status,
    paymentStatus,
    dateFrom: searchParams.from || undefined,
    dateTo: searchParams.to || undefined,
  };
}
