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

export const Chart = ({ habits }: { habits: HabitWithEntries[] }) => {
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    date.setHours(0, 0, 0, 0);
    const count = habits.reduce((acc, val) => {
      return (
        acc +
        val.entries.filter((e) => {
          const entryDate = new Date(e.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime();
        }).length
      );
    }, 0);
    return {
      day: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date),
      count,
    };
  });

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
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
