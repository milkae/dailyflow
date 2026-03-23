import { CardsList } from "@/components/CardsList";
import { EntriesList } from "@/components/EntriesList";
import { HabitCalendar } from "@/components/HabitCalendar";
import { StatCard } from "@/components/StatCard";
import { Heading } from "@/components/ui/typography";
import prisma from "@/lib/prisma";
import { calculateStreaks } from "@/lib/habits";
import { CalendarIcon, Flame, PieChart } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO show by month, default this month and on calendar navigation fetch new entries
  const last30days = new Date();
  last30days.setDate(last30days.getDate() - 29);

  const habit = await prisma.habit.findUnique({
    where: { id },
    include: {
      entries: {
        where: {
          date: { gte: last30days },
        },
      },
    },
  });

  if (!habit) {
    return notFound();
  }

  const streak = calculateStreaks(habit);

  const stats = [
    { label: "Streak", icon: <Flame />, stat: streak },
    {
      label: "Nb jours complétés sur 30",
      icon: <CalendarIcon />,
      stat: habit.entries.length,
    },
    {
      label: "Taux de complétion",
      icon: <PieChart />,
      stat: `${Math.round((habit.entries.length * 100) / 30)}%`,
    },
  ];

  return (
    <>
      <Heading className="text-center">{habit?.name}</Heading>
      <p>{habit?.description}</p>
      <CardsList>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </CardsList>
      <HabitCalendar habit={habit} />

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Journal entries</h2>
        <EntriesList entries={habit.entries} />
      </section>
    </>
  );
}
