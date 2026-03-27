import { Card } from "@/components/ui/card";
import { TypedHabitWithEntries } from "@/lib/types";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";
import { getHabitEntryForToday, getLastWeekHabits } from "@/lib/habits";
import { WeeklyActivityChart } from "../charts/WeeklyActivityChart";
import { CompletionRateChart } from "../charts/CompletionRateChart";
import { StreakLeaderboard } from "./StreakLeaderBoard";
import { Heading } from "../ui/typography";

function getWeeklyPercentage(habits: TypedHabitWithEntries[]) {
  const total = (habits.length || 1) * 7;
  const lastWeekHabits = getLastWeekHabits(habits);
  const habitCompletedCount = lastWeekHabits.reduce(
    (acc, val) => acc + val.completed,
    0,
  );

  return Math.round((habitCompletedCount * 100) / total);
}

export function HabitsStats({ habits }: { habits: TypedHabitWithEntries[] }) {
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
    <div className="space-y-6">
      <div className="grid gap-3 md:gap-4 grid-cols-3 auto-rows-fr">
        {stats.map((stat, id) => (
          <Card className="p-2 gap-2 md:gap-4 text-center md:p-6" key={id}>
            <div className="flex items-center md:gap-3">
              <span className="max-md:hidden">{stat.icon}</span>
              <h4>{stat.label}</h4>
            </div>
            <div className="text-2xl md:text-5xl text-center text-primary">
              {stat.stat}
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <Heading as="h3">Weekly Activity</Heading>
          <WeeklyActivityChart habits={habits} />
        </Card>
        <Card className="p-6 space-y-4">
          <Heading as="h3">Completion Rate</Heading>
          <CompletionRateChart habits={habits} />
        </Card>
      </div>
      <Card className="p-6 space-y-4">
        <Heading as="h3">Longest Streaks</Heading>
        <StreakLeaderboard habits={habits} />
      </Card>
    </div>
  );
}
