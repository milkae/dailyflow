import { CardsList } from "@/components/CardsList";
import { HabitCard } from "@/components/HabitCard";
import { Heading } from "@/components/ui/typography";
import { isHabitActiveOnDate } from "@/lib/habits";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const habits = await prisma.habit.findMany({
    include: {
      entries: true,
    },
  });

  const today = new Date();
  const todayHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, today),
  );

  return (
    <section className="space-y-4">
      <Heading className="text-center">Today</Heading>
      <div className="flex items-center justify-between">
        <Heading as="h2">General</Heading>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {todayHabits.length} {todayHabits.length === 1 ? "habit" : "habits"}
        </span>
      </div>
      <CardsList>
        {todayHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </CardsList>
    </section>
  );
}
