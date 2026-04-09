import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { HabitDetailHeader } from "@/features/habits/components/HabitDetailHeader";
import { HabitTimeline } from "@/features/habits/components/HabitTimeline";
import { parseHabit } from "@/utils/habits";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
