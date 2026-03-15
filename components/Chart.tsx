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
import { getLastWeekHabits } from "@/lib/utils";

export const Chart = ({ habits }: { habits: HabitWithEntries[] }) => {
  const data = getLastWeekHabits(habits, true);

  return (
    <Card className="p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Activity This Week
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Number of habits completed each day
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} className="text-slate-600 dark:text-slate-400">
          <CartesianGrid
            strokeDasharray="3 3"
            className="text-slate-800"
            stroke="currentColor"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-slate-800"
            stroke="currentColor"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-slate-800"
            stroke="currentColor"
          />
          <Bar
            dataKey="count"
            className="fill-emerald-600 dark:fill-emerald-500"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
