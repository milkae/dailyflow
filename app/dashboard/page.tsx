import { StatCard } from "@/components/StatCard";
import { Chart } from "@/components/Chart";
import { getLastMonthHabits } from "@/lib/actions";
import { HabitWithEntries } from "@/lib/prisma";
import { getHabitEntryForToday, getLastWeekHabits } from "@/lib/utils";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";
import { HabitCard } from "@/components/HabitCard";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { Heading } from "@/components/ui/typography";

function getWeeklyPercentage(habits: HabitWithEntries[]) {
  const total = (habits.length || 1) * 7;
  const lastWeekHabits = getLastWeekHabits(habits);
  const habitCompletedCount = lastWeekHabits.reduce(
    (acc, val) => acc + val.count,
    0,
  );

  return Math.round((habitCompletedCount * 100) / total);
}

export default async function Page() {
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
      stat: habits.filter((h) => !!getHabitEntryForToday(h)).length,
    },
    {
      label: "Weekly completion",
      icon: <CalendarDays />,
      stat: `${getWeeklyPercentage(habits)}%`,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-8 m-auto">
      <Heading className="text-center">My dashboard</Heading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, id) => (
          <StatCard key={id} {...stat} />
        ))}
      </div>
      <Chart habits={habits} />
      <CreateHabitForm />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
