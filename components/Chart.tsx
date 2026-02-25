"use client";

import { HabitWithEntries } from "@/lib/prisma";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
    <BarChart
      data={data}
      responsive
      style={{
        height: "calc(100% - 20px)",
        maxHeight: "30vh",
        width: "33%",
        aspectRatio: 1,
      }}
    >
      <XAxis
        dataKey="day"
        className="text-slate-600 dark:text-slate-400"
        stroke="currentColor"
      />
      <YAxis
        allowDecimals={false}
        className="text-slate-600 dark:text-slate-400"
        stroke="currentColor"
      />
      <Bar dataKey="count" className="fill-emerald-600 dark:fill-emerald-500" />
    </BarChart>
  );
};
