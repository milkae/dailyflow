import { CardsList } from "@/components/CardsList";
import { HabitCard } from "@/components/HabitCard";
import { Heading } from "@/components/ui/typography";
import { getLastMonthHabits } from "@/lib/actions";

export default async function Home() {
  const habits = await getLastMonthHabits();

  return (
    <section className="space-y-4">
      <Heading className="text-center">Today</Heading>
      <div className="flex items-center justify-between">
        <Heading as="h2">General</Heading>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {habits.length} {habits.length === 1 ? "habit" : "habits"}
        </span>
      </div>
      <CardsList>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </CardsList>
    </section>
  );
}
