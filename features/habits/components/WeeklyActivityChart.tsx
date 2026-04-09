"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TypedHabitWithEntries } from "@/features/habits/types";
import { getLastWeekHabits } from "@/utils/habits";

const chartConfig = {
  count: {
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const WeeklyActivityChart = ({
  habits,
}: {
  habits: TypedHabitWithEntries[];
}) => {
  const data = getLastWeekHabits(habits, true);

  return (
    <ChartContainer config={chartConfig} className="min-h-20">
      <BarChart data={data} accessibilityLayer responsive>
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} width={20} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="completed"
          className="fill-(--color-count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
