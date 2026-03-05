import { HabitCalendar } from "@/components/HabitCalendar";
import { StatCard } from "@/components/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { calculateStreaks } from "@/lib/utils";
import { CalendarIcon, Flame, PieChart } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    return;
  }

  const { streak } = calculateStreaks(habit);

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
    <div className="p-6 md:p-8 max-w-7xl space-y-8 m-auto">
      <Link
        href="/"
        className={buttonVariants({ variant: "secondary", size: "sm" })}
      >
        Back
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        {habit?.name}
      </h1>
      <p>{habit?.description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      <HabitCalendar habit={habit} />
      <ul className="list-disc marker:text-emerald-600">
        {habit.entries.map((entry) => (
          <li key={entry.id}>
            <div className="flex gap-4">
              <span>{entry.date.toLocaleDateString()}</span>
              <span>{entry.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
