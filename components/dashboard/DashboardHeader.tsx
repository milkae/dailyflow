import { Heading } from "../ui/typography";
import { getDashboardStats } from "@/lib/dashboard-data";

export const DashboardHeader = async () => {
  const { total, completed, mealsCount } = await getDashboardStats();

  const today = new Date();

  return (
    <div className="space-y-4">
      <Heading>
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Heading>

      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        {total > 0 && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>
                <strong className="font-semibold text-foreground">
                  {completed}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-foreground">
                  {total}
                </strong>{" "}
                habits completed
              </span>
            </div>
            {mealsCount > 0 && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary" />
                  <span>
                    <strong className="font-semibold text-foreground">
                      {mealsCount}
                    </strong>{" "}
                    meals planned
                  </span>
                </div>
              </>
            )}
          </>
        )}
        {total === 0 && mealsCount === 0 && (
          <span>Start your day by creating habits and planning meals</span>
        )}
      </div>
    </div>
  );
};

export function DashboardHeaderSkeleton() {
  const today = new Date();

  return (
    <div className="space-y-4">
      <Heading>
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Heading>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pb-2">
          <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
