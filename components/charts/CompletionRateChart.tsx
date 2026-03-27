"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TypedHabitWithEntries } from "@/lib/types";
import { isHabitActiveOnDate, isHabitCompletedOnDate } from "@/lib/habits";

const chartConfig = {
  rate: {
    label: "Completed rate",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const CompletionRateChart = ({
  habits,
}: {
  habits: TypedHabitWithEntries[];
}) => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    date.setHours(0, 0, 0, 0);

    const activeHabits = habits.filter((h) => isHabitActiveOnDate(h, date));

    const completed = activeHabits.filter((habit) =>
      isHabitCompletedOnDate(habit, date),
    ).length;

    const rate =
      activeHabits.length > 0
        ? Math.round((completed / activeHabits.length) * 100)
        : 0;

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      rate,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-20">
      <AreaChart data={data} accessibilityLayer responsive>
        <defs>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex min-w-32.5 items-center text-xs text-muted-foreground">
                  {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                    {value}
                    <span className="font-normal text-muted-foreground">%</span>
                  </div>
                </div>
              )}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="var(--color-rate)"
          strokeWidth={2}
          fill="url(#colorRate)"
        />
      </AreaChart>
    </ChartContainer>
  );
};
