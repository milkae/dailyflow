import { CreateHabitForm } from "@/components/CreateHabitForm";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const habits = await prisma.habit.findMany();
  return (
    <div>
      <h1 className="text-5xl text-center underline decoration-teal-400 py-4 mb-4">
        My habits
      </h1>
      <CreateHabitForm />
      <div className="w-1/2 p-4 m-auto mt-4">
        {habits.map((habit) => (
          <div key={habit.id} className="text-lg">
            {habit.name}
          </div>
        ))}
      </div>
    </div>
  );
}
