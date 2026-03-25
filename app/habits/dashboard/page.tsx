import { StatCard } from "@/components/StatCard";
import { Chart } from "@/components/Chart";
import { getLastMonthHabits } from "@/lib/actions";
import { TypedHabitWithEntries } from "@/lib/types";
import { getHabitEntryForToday, getLastWeekHabits } from "@/lib/habits";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";
import { HabitCard } from "@/components/HabitCard";
import { Heading } from "@/components/ui/typography";
import { CardsList } from "@/components/CardsList";
import { HabitForm } from "@/components/HabitForm";

function getWeeklyPercentage(habits: TypedHabitWithEntries[]) {
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
    <>
      <Heading className="text-center">My dashboard</Heading>
      <CardsList>
        {stats.map((stat, id) => (
          <StatCard key={id} {...stat} />
        ))}
      </CardsList>
      <Chart habits={habits} />
      <HabitForm />
      <CardsList>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </CardsList>
    </>
  );
}
