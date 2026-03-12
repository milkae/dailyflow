"use client";

import { Calendar } from "@/components/ui/calendar";
import { createHabitEntry } from "@/lib/actions";
import { HabitWithEntries } from "@/lib/prisma";

export const HabitCalendar = ({ habit }: { habit: HabitWithEntries }) => {
  const selectDate = (_selected?: Date[], triggerDate?: Date) => {
    createHabitEntry(habit.id, triggerDate);
  };
  //TODO limit calendar display to the period selected for the entries
  return (
    <Calendar
      mode="multiple"
      selected={habit.entries.map((e) => e.date)}
      onSelect={selectDate}
      classNames={{
        selected: `rounded-none hover:rounded-none bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white`,
        today: "rounded-full hover:rounded-full bg-slate-600 dark:bg-slate-400",
        day_button:
          "rounded-full data-[selected-single=true]:rounded-none data-[selected-single=true]:bg-emerald-600 data-[selected-single=true]:text-white data-[selected-single=true]:bg-emerald-500 data-[selected-single=true]:group-data-[focused=true]/day:ring-emerald-600/20 data-[selected-single=true]:dark:group-data-[focused=true]/day:ring-emerald-400/40 hover:bg-emerald-700 dark:hover:bg-emerald-600",
      }}
    />
  );
};
