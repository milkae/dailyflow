import { HabitCard } from "@/components/HabitCard";
import { getLastMonthHabits } from "@/lib/actions";

export default async function Home() {
  const habits = await getLastMonthHabits();

  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-8 m-auto">
      <h1 className="text-center text-3xl md:text-4xl font-bold">Today</h1>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">General</h2>
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
