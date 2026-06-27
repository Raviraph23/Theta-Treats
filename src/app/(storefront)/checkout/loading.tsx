import { Skeleton } from "@/components/loading/Skeleton";

export default function CheckoutLoading() {
  return (
    <div
      className="mx-auto max-w-lg px-4 py-8"
      aria-busy="true"
      aria-label="Loading checkout"
    >
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-6 h-4 w-full max-w-sm" />

      <div className="mt-8 space-y-3 rounded-2xl border border-accent/15 p-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
