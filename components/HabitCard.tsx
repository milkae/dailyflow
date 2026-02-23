"use client";

import { Habit, Entry } from "@/generated/prisma/client";
import { setHabitCompleted } from "@/lib/actions";

export const HabitCard = ({
  habit,
}: {
  habit: Habit & { entries: Entry[] };
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCompletedToday = habit.entries.some((entry) => {
    return entry.date.getTime() === today.getTime();
  });

  return (
    <div
      className="flex justify-between border border-teal-400 rounded-sm px-4 py-2 mb-4 cursor-pointer"
      onClick={() => setHabitCompleted(habit.id, !isCompletedToday)}
    >
      <div className="w-full">
        <h4 className="text-lg underline decoration-rose-300 w-full">
          {habit.name}
        </h4>
        <p className="text-sm">{habit.description}</p>
      </div>

      <label className="flex items-center relative">
        <input
          type="checkbox"
          className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-rose-300"
          checked={isCompletedToday}
          readOnly
        />
        <span className="absolute text-rose-300 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </label>
    </div>
  );
};
