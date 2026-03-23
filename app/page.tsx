import { CardsList } from "@/components/CardsList";
import { HabitCard } from "@/components/HabitCard";
import { HabitForm } from "@/components/HabitForm";
import { Heading } from "@/components/ui/typography";
import { isHabitActiveOnDate } from "@/lib/habits";
import { prisma } from "@/lib/prisma";
import { CalendarFold } from "lucide-react";

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

      {!!todayHabits.length ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {todayHabits.length}{" "}
              {todayHabits.length === 1 ? "habit" : "habits"}
            </span>
          </div>
          <CardsList>
            {todayHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </CardsList>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="rounded-full bg-primary/20 w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CalendarFold className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No habits for today</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start creating new habits to improve your day.
          </p>
          <HabitForm />
        </div>
      )}
    </section>
  );
}
