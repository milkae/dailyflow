"use client";

import { Habit, Entry } from "@/generated/prisma/client";
import { setHabitCompleted } from "@/lib/actions";

export const HabitCard = ({
  habit,
}: {
  habit: Habit & { entries: Entry[]; streak: number };
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCompletedToday = habit.entries.some((entry) => {
    return entry.date.getTime() === today.getTime();
  });

  return (
    <div
      className="flex justify-between items-center border border-teal-400 rounded-sm px-4 py-2 mb-4 cursor-pointer"
      onClick={() => setHabitCompleted(habit.id, !isCompletedToday)}
    >
      <div className="w-full">
        <h4 className="text-lg underline decoration-rose-300 w-full">
          {habit.name}
        </h4>
        <p className="text-sm">{habit.description}</p>
      </div>
      <div className="flex items-center gap-0.5 mx-3 text-red-400">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="currentColor"
          stroke="currentColor"
        >
          <path d="M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C10.1113 21.8742 8 21.064 8 18.4442C8 16.3949 9.49507 15.0085 10.631 14.3346C10.9365 14.1533 11.2941 14.3887 11.2941 14.7439V15.3331C11.2941 15.784 11.4685 16.4889 11.8836 16.9714C12.3534 17.5174 13.0429 16.9454 13.0985 16.2273C13.1161 16.0008 13.3439 15.8564 13.5401 15.9711C14.1814 16.3459 15 17.1465 15 18.4442C15 20.4922 13.871 21.4343 12.8324 21.8013Z"></path>
        </svg>
        <span className="inline-block">{habit.streak}</span>
      </div>
      <label className="flex items-center relative">
        <input
          type="checkbox"
          className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-teal-400"
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
