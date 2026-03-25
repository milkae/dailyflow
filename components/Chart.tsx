"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { getLastWeekHabits } from "@/lib/habits";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Heading } from "./ui/typography";
import { TypedHabitWithEntries } from "@/lib/types";

const chartConfig = {
  count: {
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const Chart = ({ habits }: { habits: TypedHabitWithEntries[] }) => {
  const data = getLastWeekHabits(habits, true);

  return (
    <Card className="p-4">
      <div>
        <Heading as="h3">Activity This Week</Heading>
        <p className="text-sm text-muted-foreground mt-1">
          Number of habits completed each day
        </p>
      </div>
      <ChartContainer config={chartConfig} className="min-h-20">
        <BarChart accessibilityLayer data={data} responsive>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} width={20} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            className="fill-(--color-count)"
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
};
