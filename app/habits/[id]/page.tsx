import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { HabitDetailHeader } from "@/components/habits/HabitDetailHeader";
import { HabitStats } from "@/components/habits/HabitStats";
import { HabitTimeline } from "@/components/habits/HabitTimeline";
import { parseHabit } from "@/lib/habits";
import prisma from "@/lib/prisma";

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const habit = await prisma.habit.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!habit) return notFound();

  const parsedHabit = parseHabit(habit);

  return (
    <div className="space-y-6">
      <HabitDetailHeader habit={parsedHabit} />
      <HabitTimeline habit={parsedHabit} />
    </div>
  );
}
