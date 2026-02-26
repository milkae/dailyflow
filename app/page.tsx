import { Chart } from "@/components/Chart";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { StatCard } from "@/components/StatCard";
import { getLastMonthHabits } from "@/lib/actions";
import { HabitWithEntries } from "@/lib/prisma";
import { getLastWeekHabits, isHabitCompletedToday } from "@/lib/utils";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";

function getWeeklyPercentage(habits: HabitWithEntries[]) {
  const total = (habits.length || 1) * 7;
  const lastWeekHabits = getLastWeekHabits(habits);
  const habitCompletedCount = lastWeekHabits.reduce(
    (acc, val) => acc + val.count,
    0,
  );

  return Math.round((habitCompletedCount * 100) / total);
}

export default async function Home() {
  const habits = await getLastMonthHabits();

  const stats = [
    {
      label: "Total active habits",
      icon: <WalletCards />,
      stat: habits.length,
    },
    {
      label: "Completed today",
      icon: <CalendarCheck />,
      stat: habits.filter(isHabitCompletedToday).length,
    },
    {
      label: "Weekly completion",
      icon: <CalendarDays />,
      stat: `${getWeeklyPercentage(habits)}%`,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-8 m-auto">
      <div className="flex items-center justify-between flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">My Habits</h1>
        <CreateHabitForm />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, id) => (
          <StatCard key={id} {...stat} />
        ))}
      </div>
      <Chart habits={habits} />
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">General</h2>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {habits.length} {habits.length === 1 ? "habit" : "habits"}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </section>
    </div>
  );
}
