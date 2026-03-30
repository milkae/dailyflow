import { Heading } from "../ui/typography";

type Props = {
  completedCount: number;
  totalCount: number;
  mealsCount: number;
};

export function DashboardHeader({
  completedCount,
  totalCount,
  mealsCount,
}: Props) {
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
        {totalCount > 0 && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>
                <strong className="font-semibold text-foreground">
                  {completedCount}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-foreground">
                  {totalCount}
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
        {totalCount === 0 && mealsCount === 0 && (
          <span>Start your day by creating habits and planning meals</span>
        )}
      </div>
    </div>
  );
}
