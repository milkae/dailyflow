import { notFound } from "next/navigation";
import { HabitDetailHeader } from "@/app/(habits)/_components/HabitDetailHeader";
import { HabitTimeline } from "@/app/(habits)/_components/HabitTimeline";
import { Metadata } from "next";
import { getHabit } from "@/app/(habits)/actions";

export async function generateMetadata(
  params: Promise<{ id: string }>,
): Promise<Metadata> {
  const { id } = await params;
  const habit = await getHabit(id);

  return {
    title: habit?.name,
    description: habit?.description,
  };
}

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const habit = await getHabit(id);

  if (!habit) return notFound();

  return (
    <div className="space-y-6">
      <HabitDetailHeader habit={habit} />
      <HabitTimeline habit={habit} />
    </div>
  );
}
