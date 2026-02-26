import { Chart } from "@/components/Chart";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { getLastMonthHabits } from "@/lib/actions";

export default async function Home() {
  const habits = await getLastMonthHabits();

  return (
    <div className="py-6 md:py-8 max-w-7xl space-y-8 m-auto">
      <div className="flex items-center justify-between md:flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">My Habits</h1>
        <CreateHabitForm />
      </div>
      <Chart habits={habits} />
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
