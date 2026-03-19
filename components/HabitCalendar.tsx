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
        selected: `rounded-none hover:rounded-none bg-primary hover:bg-primary/90 text-primary-foreground`,
        today: "rounded-full hover:rounded-full bg-muted-foreground",
        day_button:
          "rounded-full data-[selected-single=true]:rounded-none data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:group-data-[focused=true]/day:ring-ring hover:bg-primary/90",
      }}
    />
  );
};
