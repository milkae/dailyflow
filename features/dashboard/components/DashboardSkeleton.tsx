import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Heading } from "../../../components/ui/typography";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Heading>
          <Skeleton className="h-12 w-1/4" />
        </Heading>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pb-2">
            <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="py-6 px-4 border rounded-lg gap-3 flex">
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
            <div className="space-y-3.5  w-1/4">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-7 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-muted rounded w-24 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
              <div className="h-8 bg-muted rounded w-20 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex-row items-center">
                <div className="h-6.5 w-6.5 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
              </Card>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-muted rounded w-20 animate-pulse" />
            <div className="h-8 bg-muted rounded w-24 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 flex-row items-center">
                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                <div className="w-1/4 space-y-2.5">
                  <div className="h-7 bg-muted rounded animate-pulse" />
                  <div className="h-5 bg-muted rounded animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
