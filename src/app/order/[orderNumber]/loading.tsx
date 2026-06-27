import { Skeleton } from "@/components/loading/Skeleton";

export default function OrderLoading() {
  return (
    <div
      className="mx-auto max-w-lg px-4 py-10"
      aria-busy="true"
      aria-label="Loading order"
    >
      <div className="text-center">
        <Skeleton className="mx-auto h-10 w-10 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-9 w-56" />
        <Skeleton className="mx-auto mt-3 h-4 w-full max-w-xs" />
      </div>

      <div className="mt-8 space-y-3 rounded-2xl border border-accent/15 bg-primary/20 p-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-accent/10 p-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      <Skeleton className="mt-8 h-12 w-full rounded-full" />
    </div>
  );
}
