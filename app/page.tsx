import { CreateHabitForm } from "@/components/CreateHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const habits = await prisma.habit.findMany({ include: { entries: true } });
  return (
    <div>
      <h1 className="text-5xl text-center underline decoration-teal-400 py-4 mb-4">
        My habits
      </h1>
      <CreateHabitForm />
      <div className="w-1/3 p-4 m-auto mt-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
