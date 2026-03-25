import { Chart } from "@/components/Chart";
import { getLastMonthHabits } from "@/lib/actions";
import { TypedHabitWithEntries } from "@/lib/types";
import { getHabitEntryForToday, getLastWeekHabits } from "@/lib/habits";
import { CalendarCheck, CalendarDays, WalletCards } from "lucide-react";
import { Heading } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { HabitsList } from "@/components/HabitsList";

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
      <Heading className="text-center">Habits dashboard</Heading>
      <Tabs defaultValue="charts" className="md:w-4xl space-y-2">
        <TabsList variant="line">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="list">Habits list</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-2 md:gap-4 grid-cols-3 auto-rows-fr">
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
          <Chart habits={habits} />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <HabitsList habits={habits} />
        </TabsContent>
      </Tabs>
    </>
  );
}
