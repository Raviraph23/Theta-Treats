import { Skeleton } from "@/components/loading/Skeleton";

export function AdminLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading admin page">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-accent/15">
        <div className="border-b border-accent/15 bg-primary/20 px-4 py-3">
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <ul className="divide-y divide-accent/10">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-4 w-24 shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-16 sm:block" />
              <Skeleton className="hidden h-4 w-20 md:block" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
