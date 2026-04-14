// @vitest-environment node

import { describe, it, expect } from "vitest";
import {
  isHabitActiveOnDate,
  isHabitCompletedOnDate,
  getHabitEntryForToday,
} from "@/utils/habits";
import { Frequency } from "@/generated/prisma/browser";
import {
  createMockTypedHabitWithEntries,
  createMockEntry,
} from "@/__tests__/tests-utils";

describe("Habit Utilities", () => {
  describe("isHabitActiveOnDate - DAILY", () => {
    it("should return true for any date when frequency is DAILY", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY);

      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-15"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-12-31"))).toBe(true);
    });
  });

  describe("isHabitActiveOnDate - WEEKLY", () => {
    it("should return true when date matches configured day of week", () => {
      // Monday = 1
      const habit = createMockTypedHabitWithEntries(Frequency.WEEKLY, {
        day: 1,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(true); // Monday
      expect(isHabitActiveOnDate(habit, new Date("2024-04-02"))).toBe(false); // Tuesday
    });

    it("should return false when config day is missing", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.WEEKLY, {
        day: undefined,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });

    it("should return false when config is null", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.WEEKLY, null);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });

    it("should handle all days of week correctly (0-6)", () => {
      for (let day = 0; day < 7; day++) {
        const habit = createMockTypedHabitWithEntries(Frequency.WEEKLY, {
          day,
        });
        // April 7, 2024 = Sunday (0)
        const testDate = new Date("2024-04-07");
        const expectedActive = testDate.getDay() === day;
        expect(isHabitActiveOnDate(habit, testDate)).toBe(expectedActive);
      }
    });
  });

  describe("isHabitActiveOnDate - MONTHLY", () => {
    it("should return true when date matches configured day of month", () => {
      // 15th of each month
      const habit = createMockTypedHabitWithEntries(Frequency.MONTHLY, {
        day: 15,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-15"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-16"))).toBe(false);
    });

    it("should return false when config day is missing", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.MONTHLY, {
        day: undefined,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-15"))).toBe(false);
    });

    it("should handle edge case: last day of month (31st)", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.MONTHLY, {
        day: 31,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-01-31"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-02-29"))).toBe(false); // Feb only has 29 in 2024
    });

    it("should handle all valid month days (1-31)", () => {
      for (let day = 1; day <= 31; day++) {
        const habit = createMockTypedHabitWithEntries(Frequency.MONTHLY, {
          day,
        });
        // Use May 2024 (has 31 days)
        const testDate = new Date(2024, 4, day); // May = month 4 (0-indexed)
        expect(isHabitActiveOnDate(habit, testDate)).toBe(true);
      }
    });
  });

  describe("isHabitActiveOnDate - SPECIFIC_DAYS", () => {
    it("should return true only for specified days of week", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.SPECIFIC_DAYS, {
        days: [1, 3, 5],
      }); // Mon, Wed, Fri
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(true); // Monday
      expect(isHabitActiveOnDate(habit, new Date("2024-04-02"))).toBe(false); // Tuesday
      expect(isHabitActiveOnDate(habit, new Date("2024-04-03"))).toBe(true); // Wednesday
    });

    it("should return false when days array is empty", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.SPECIFIC_DAYS, {
        days: [],
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });

    it("should return false when days config is missing", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.SPECIFIC_DAYS, {
        days: undefined,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });

    it("should handle weekend-only habits", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.SPECIFIC_DAYS, {
        days: [0, 6],
      }); // Sun, Sat
      expect(isHabitActiveOnDate(habit, new Date("2024-04-06"))).toBe(true); // Saturday
      expect(isHabitActiveOnDate(habit, new Date("2024-04-07"))).toBe(true); // Sunday
      expect(isHabitActiveOnDate(habit, new Date("2024-04-08"))).toBe(false); // Monday
    });

    it("should handle non-array days config gracefully", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.SPECIFIC_DAYS, {
        days: "not an array",
      } as unknown as { days: number[] });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });
  });

  describe("isHabitActiveOnDate - INTERVAL", () => {
    it("should return true on start date", () => {
      const startDate = new Date("2024-04-01");
      const habit = createMockTypedHabitWithEntries(
        Frequency.INTERVAL,
        { interval: 3 },
        [],
      );
      habit.startDate = startDate;

      expect(isHabitActiveOnDate(habit, startDate)).toBe(true);
    });

    it("should return true at interval boundaries", () => {
      const startDate = new Date("2024-04-01");
      const habit = createMockTypedHabitWithEntries(Frequency.INTERVAL, {
        interval: 3,
      });
      habit.startDate = startDate;

      // 0 days = active
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(true);
      // 3 days = active
      expect(isHabitActiveOnDate(habit, new Date("2024-04-04"))).toBe(true);
      // 6 days = active
      expect(isHabitActiveOnDate(habit, new Date("2024-04-07"))).toBe(true);
    });

    it("should return false between interval boundaries", () => {
      const startDate = new Date("2024-04-01");
      const habit = createMockTypedHabitWithEntries(Frequency.INTERVAL, {
        interval: 3,
      });
      habit.startDate = startDate;

      expect(isHabitActiveOnDate(habit, new Date("2024-04-02"))).toBe(false);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-03"))).toBe(false);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-05"))).toBe(false);
    });

    it("should return false for dates before start date", () => {
      const startDate = new Date("2024-04-01");
      const habit = createMockTypedHabitWithEntries(Frequency.INTERVAL, {
        interval: 3,
      });
      habit.startDate = startDate;

      expect(isHabitActiveOnDate(habit, new Date("2024-03-31"))).toBe(false);
      expect(isHabitActiveOnDate(habit, new Date("2024-01-01"))).toBe(false);
    });

    it("should handle 1-day interval (every day similar to DAILY)", () => {
      const startDate = new Date("2024-04-01");
      const habit = createMockTypedHabitWithEntries(Frequency.INTERVAL, {
        interval: 1,
      });
      habit.startDate = startDate;

      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-02"))).toBe(true);
      expect(isHabitActiveOnDate(habit, new Date("2024-04-15"))).toBe(true);
    });

    it("should return false when interval config is missing", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.INTERVAL, {
        interval: undefined,
      });
      expect(isHabitActiveOnDate(habit, new Date("2024-04-01"))).toBe(false);
    });
  });

  describe("isHabitCompletedOnDate", () => {
    it("should return true if entry exists for the date", () => {
      const date = new Date("2024-04-15T10:30:00");
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        createMockEntry(date),
      ]);

      expect(isHabitCompletedOnDate(habit, date)).toBe(true);
    });

    it("should return false if no entry exists for the date", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        createMockEntry(new Date("2024-04-15")),
      ]);

      expect(isHabitCompletedOnDate(habit, new Date("2024-04-16"))).toBe(false);
    });

    it("should ignore time portion when comparing dates", () => {
      const date = new Date("2024-04-15T10:30:45.123Z");
      const entryDate = new Date("2024-04-15T23:59:59.999Z");
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        createMockEntry(entryDate),
      ]);

      expect(isHabitCompletedOnDate(habit, date)).toBe(true);
    });

    it("should return false with empty entries array", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, []);
      expect(isHabitCompletedOnDate(habit, new Date("2024-04-15"))).toBe(false);
    });

    it("should handle multiple entries", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        createMockEntry(new Date("2024-04-14")),
        createMockEntry(new Date("2024-04-15")),
        createMockEntry(new Date("2024-04-16")),
      ]);

      expect(isHabitCompletedOnDate(habit, new Date("2024-04-15"))).toBe(true);
    });
  });

  describe("getHabitEntryForToday", () => {
    it("should return entry for today", () => {
      const today = new Date();
      const entry = createMockEntry(today);
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        entry,
      ]);

      const result = getHabitEntryForToday(habit);
      expect(result).toBeDefined();
      expect(result?.id).toBe("entry-1");
    });

    it("should return undefined if no entry for today", () => {
      const yesterday = new Date(new Date().getTime() - 86400000);
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        createMockEntry(yesterday),
      ]);

      expect(getHabitEntryForToday(habit)).toBeUndefined();
    });

    it("should ignore time portion when matching today", () => {
      const today = new Date();
      const todayWithDifferentTime = new Date(today);
      todayWithDifferentTime.setHours(23, 59, 59, 999);

      const entry = createMockEntry(todayWithDifferentTime);
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [
        entry,
      ]);

      expect(getHabitEntryForToday(habit)).toBeDefined();
    });

    it("should return undefined with no entries", () => {
      const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, []);
      expect(getHabitEntryForToday(habit)).toBeUndefined();
    });
  });
});
