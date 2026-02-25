import { Chart } from "@/components/Chart";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { getLastMonthHabits } from "@/lib/actions";

export default async function Home() {
  const habits = await getLastMonthHabits();

  return (
    <div className="  m-auto flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800 p-4">
      <CreateHabitForm />
      <div className=" p-4 m-auto mt-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
      <Chart habits={habits} />
    </div>
  );
}
