import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CardsList } from "@/components/CardsList";
import { HabitCard } from "@/components/HabitCard";
import { HabitForm } from "@/components/HabitForm";
import { getHabitEntryForToday, isHabitActiveOnDate } from "@/lib/habits";
import prisma from "@/lib/prisma";
import { CalendarFold } from "lucide-react";
import { Heading } from "@/components/ui/typography";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  const today = new Date();
  const todayHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, today),
  );

  const completedToday = todayHabits.filter(getHabitEntryForToday).length;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Heading className="mb-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",

              month: "long",
              day: "numeric",
            })}
          </Heading>
          <p className="text-muted-foreground">
            {todayHabits.length > 0
              ? `${completedToday} of ${todayHabits.length} habits completed`
              : "Start your day"}
          </p>
        </div>
        <HabitForm />
      </div>
      <section className="space-y-4">
        <Heading as="h2">Habits</Heading>
        {todayHabits.length > 0 ? (
          <CardsList>
            {todayHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </CardsList>
        ) : (
          <EmptyHabits />
        )}
      </section>
    </>
  );
}

function EmptyHabits() {
  return (
    <div className="rounded-lg border-2 border-dashed bg-muted/20 p-12 text-center">
      <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <CalendarFold className="h-8 w-8 text-primary" />
      </div>
      <Heading as="h3" className="mb-2">
        No habits for today
      </Heading>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Create your first habit to start tracking your progress
      </p>
    </div>
  );
}
