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
    />
  );
};
