import { Skeleton } from "@/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-7 w-44 mt-2" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />

        <div className="grid gap-3 md:gap-4 grid-cols-3 auto-rows-fr">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
