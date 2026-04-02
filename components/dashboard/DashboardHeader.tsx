import { Heading } from "../ui/typography";
import { getDashboardData } from "@/lib/dashboard-data";

export async function DashboardHeader() {
  const { stats } = await getDashboardData();
  const { total, completed, mealsCount } = stats;

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
        {total > 0 ? (
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
                    meals scheduled for today
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <span>Start your day by creating habits and planning meals</span>
        )}
      </div>
    </div>
  );
}
