import { Card } from "@/app/_components/ui/card";
import { TypedHabitWithEntries } from "@/app/(habits)/types";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";
import { getHabitEntryForToday, getLastWeekHabits } from "@/utils/habits";
import { WeeklyActivityChart } from "./WeeklyActivityChart";
import { CompletionRateChart } from "./CompletionRateChart";
import { StreakLeaderboard } from "./StreakLeaderBoard";
import { Heading } from "@/app/_components/ui/typography";

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
      <div className="grid grid-cols-1 gap-3 auto-rows-fr sm:grid-cols-3 sm:gap-4">
        {stats.map((stat, id) => (
          <Card className="gap-2 p-3 text-center sm:gap-4 sm:p-6" key={id}>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-muted-foreground">{stat.icon}</span>
              <h4 className="text-sm font-medium">{stat.label}</h4>
            </div>
            <div className="text-center text-3xl font-semibold text-primary sm:text-5xl">
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
