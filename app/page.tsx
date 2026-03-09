import { HabitCard } from "@/components/HabitCard";
import { Heading } from "@/components/ui/typography";
import { getLastMonthHabits } from "@/lib/actions";

export default async function Home() {
  const habits = await getLastMonthHabits();

  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-8 m-auto">
      <Heading className="text-center">Today</Heading>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading as="h2">General</Heading>
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
