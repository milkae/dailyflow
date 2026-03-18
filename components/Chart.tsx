"use client";

import { HabitWithEntries } from "@/lib/prisma";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { getLastWeekHabits } from "@/lib/habits";

export const Chart = ({ habits }: { habits: HabitWithEntries[] }) => {
  const data = getLastWeekHabits(habits, true);

  return (
    <Card className="p-6">
      <div>
        <h3 className="text-lg font-semibold">Activity This Week</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Number of habits completed each day
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} className="text-muted-foreground">
          <CartesianGrid
            strokeDasharray="3 3"
            className="text-border"
            stroke="currentColor"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-border"
            stroke="currentColor"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-border"
            stroke="currentColor"
          />
          <Bar dataKey="count" className="fill-chart-1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
