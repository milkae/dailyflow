import { CreateHabitForm } from "@/components/CreateHabitForm";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const habits = await prisma.habit.findMany();
  return (
    <main>
      <h1>My habits</h1>
      <CreateHabitForm />
      <div>
        {habits.map((habit) => (
          <div key={habit.id}>{habit.name}</div>
        ))}
      </div>
    </main>
  );
}
