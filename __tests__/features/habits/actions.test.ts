import { vi, it, expect, describe, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

vi.mock("@/lib/dal", () => ({
  verifySession: async () => ({
    isAuth: true,
    userId: "user-1",
  }),
}));

import { prismaMock } from "@/singleton";
import {
  createOrUpdateHabit,
  createHabitEntry,
  deleteHabitEntry,
  toggleHabitCompletion,
  deleteHabit,
} from "@/features/habits/actions";
import { revalidatePath, updateTag } from "next/cache";
import { Frequency } from "@/generated/prisma/browser";
import {
  createFormData,
  createMockHabit,
  MOCK_HABIT_ID,
  MOCK_USER_ID,
} from "@/__tests__/tests-utils";

describe("Habit Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrUpdateHabit", () => {
    describe("Create new habit", () => {
      it("should create DAILY habit with valid data", async () => {
        const habit = createMockHabit();
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          description: habit.description,
          frequency: "DAILY",
          frequencyConfig: null,
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(result.formErrors).toEqual([]);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: { id: "", userId: MOCK_USER_ID },
          update: expect.any(Object),
          create: expect.objectContaining({
            name: habit.name,
            frequency: "DAILY",
            userId: MOCK_USER_ID,
          }),
        });
      });

      it("should create WEEKLY habit with day config", async () => {
        const habit = createMockHabit({ frequency: Frequency.WEEKLY });
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          frequency: "WEEKLY",
          frequencyConfig: JSON.stringify({ day: 1 }),
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({
            frequency: "WEEKLY",
            frequencyConfig: { day: 1 },
          }),
        });
      });

      it("should create MONTHLY habit with day config", async () => {
        const habit = createMockHabit({ frequency: Frequency.MONTHLY });
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          frequency: "MONTHLY",
          frequencyConfig: JSON.stringify({ day: 15 }),
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({
            frequency: "MONTHLY",
            frequencyConfig: { day: 15 },
          }),
        });
      });

      it("should create SPECIFIC_DAYS habit with days array", async () => {
        const habit = createMockHabit({
          frequency: Frequency.SPECIFIC_DAYS,
        });
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          frequency: "SPECIFIC_DAYS",
          frequencyConfig: JSON.stringify({ days: [1, 3, 5] }),
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({
            frequency: "SPECIFIC_DAYS",
            frequencyConfig: { days: [1, 3, 5] },
          }),
        });
      });

      it("should create INTERVAL habit with interval config", async () => {
        const habit = createMockHabit({ frequency: Frequency.INTERVAL });
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          frequency: "INTERVAL",
          frequencyConfig: JSON.stringify({ interval: 3 }),
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({
            frequency: "INTERVAL",
            frequencyConfig: { interval: 3 },
          }),
        });
      });

      it("should revalidate cache and paths after creation", async () => {
        const habit = createMockHabit();
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          name: habit.name,
          frequency: "DAILY",
        });

        await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(updateTag).toHaveBeenCalledWith("dashboard");
        expect(revalidatePath).toHaveBeenCalledWith("/");
        expect(revalidatePath).toHaveBeenCalledWith("/habits");
      });
    });

    describe("Update existing habit", () => {
      it("should update habit with existing ID", async () => {
        const habit = createMockHabit({
          name: "Updated Habit",
          description: "Updated description",
        });
        prismaMock.habit.upsert.mockResolvedValue(habit);

        const formData = createFormData({
          id: MOCK_HABIT_ID,
          name: habit.name,
          description: habit.description,
          frequency: "DAILY",
        });

        const result = await createOrUpdateHabit(
          { formErrors: [], fieldErrors: {}, success: false },
          formData,
        );

        expect(result.success).toBe(true);
        expect(prismaMock.habit.upsert).toHaveBeenCalledWith({
          where: { id: MOCK_HABIT_ID, userId: MOCK_USER_ID },
          update: expect.objectContaining({
            name: habit.name,
            description: habit.description,
          }),
          create: expect.any(Object),
        });
      });
    });
  });

  describe("createHabitEntry", () => {
    const mockEntry = {
      id: "entry-1",
      habitId: MOCK_HABIT_ID,
      date: new Date(),
      note: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should create new habit entry for today", async () => {
      const today = new Date();
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue(mockEntry);

      await createHabitEntry(MOCK_HABIT_ID, today);

      expect(prismaMock.entry.upsert).toHaveBeenCalledWith({
        where: expect.objectContaining({ habitId_date: expect.any(Object) }),
        update: { note: undefined },
        create: expect.objectContaining({ habitId: MOCK_HABIT_ID }),
      });
    });

    it("should create entry with note", async () => {
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue(mockEntry);

      await createHabitEntry(MOCK_HABIT_ID, new Date(), "Great session!");

      expect(prismaMock.entry.upsert).toHaveBeenCalledWith({
        where: expect.any(Object),
        update: { note: "Great session!" },
        create: expect.objectContaining({ note: "Great session!" }),
      });
    });

    it("should skip update if entry exists with same note", async () => {
      prismaMock.entry.findUnique.mockResolvedValue({
        ...mockEntry,
        note: "Same note",
      });

      await createHabitEntry(MOCK_HABIT_ID, new Date(), "Same note");

      expect(prismaMock.entry.upsert).not.toHaveBeenCalled();
    });

    it("should normalize date to start of day", async () => {
      const dateWithTime = new Date("2024-04-15T14:30:45.123Z");
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue(mockEntry);

      await createHabitEntry(MOCK_HABIT_ID, dateWithTime);

      const callArgs = prismaMock.entry.upsert.mock.calls[0][0];
      const entryDate = callArgs.create?.date as Date | undefined;
      expect(entryDate?.getHours()).toBe(0);
      expect(entryDate?.getMinutes()).toBe(0);
    });

    it("should revalidate cache after creation", async () => {
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue(mockEntry);

      await createHabitEntry(MOCK_HABIT_ID);

      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should use default date (today) if not provided", async () => {
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue(mockEntry);

      await createHabitEntry(MOCK_HABIT_ID);

      expect(prismaMock.entry.upsert).toHaveBeenCalled();
    });
  });

  describe("deleteHabitEntry", () => {
    it("should delete entry for specific date", async () => {
      const date = new Date("2024-04-15");
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      await deleteHabitEntry(MOCK_HABIT_ID, date);

      expect(prismaMock.entry.deleteMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ habitId: MOCK_HABIT_ID }),
      });
    });

    it("should normalize date to start of day", async () => {
      const dateWithTime = new Date("2024-04-15T14:30:45.123Z");
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      await deleteHabitEntry(MOCK_HABIT_ID, dateWithTime);

      const callArgs = prismaMock.entry.deleteMany.mock.calls[0][0];
      const whereDate = callArgs?.where?.date as Date | undefined;
      expect(whereDate?.getHours()).toBe(0);
    });

    it("should revalidate cache after deletion", async () => {
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      await deleteHabitEntry(MOCK_HABIT_ID);

      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should use today's date if not provided", async () => {
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 0 });

      await deleteHabitEntry(MOCK_HABIT_ID);

      expect(prismaMock.entry.deleteMany).toHaveBeenCalled();
    });

    it("should verify user owns the habit", async () => {
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      await deleteHabitEntry(MOCK_HABIT_ID);

      const callArgs = prismaMock.entry.deleteMany.mock.calls[0][0];
      expect(callArgs?.where?.habit?.userId).toBe(MOCK_USER_ID);
    });
  });

  describe("toggleHabitCompletion", () => {
    it("should create entry when completion is true", async () => {
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue({
        id: "entry-1",
        habitId: MOCK_HABIT_ID,
        date: new Date(),
        note: null,
      });

      await toggleHabitCompletion(MOCK_HABIT_ID, true);

      expect(prismaMock.entry.upsert).toHaveBeenCalled();
    });

    it("should delete entry when completion is false", async () => {
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      await toggleHabitCompletion(MOCK_HABIT_ID, false);

      expect(prismaMock.entry.deleteMany).toHaveBeenCalled();
    });

    it("should toggle completion status correctly", async () => {
      prismaMock.entry.findUnique.mockResolvedValue(null);
      prismaMock.entry.upsert.mockResolvedValue({
        id: "entry-1",
        habitId: MOCK_HABIT_ID,
        date: new Date(),
        note: null,
      });

      // Toggle to true
      await toggleHabitCompletion(MOCK_HABIT_ID, true);
      expect(prismaMock.entry.upsert).toHaveBeenCalled();

      vi.clearAllMocks();
      prismaMock.entry.deleteMany.mockResolvedValue({ count: 1 });

      // Toggle to false
      await toggleHabitCompletion(MOCK_HABIT_ID, false);
      expect(prismaMock.entry.deleteMany).toHaveBeenCalled();
    });
  });

  describe("deleteHabit", () => {
    it("should delete habit with specified ID", async () => {
      prismaMock.habit.delete.mockResolvedValue(createMockHabit());

      await deleteHabit(MOCK_HABIT_ID);

      expect(prismaMock.habit.delete).toHaveBeenCalledWith({
        where: { id: MOCK_HABIT_ID, userId: MOCK_USER_ID },
      });
    });

    it("should verify user owns the habit", async () => {
      prismaMock.habit.delete.mockResolvedValue(createMockHabit());

      await deleteHabit(MOCK_HABIT_ID);

      const callArgs = prismaMock.habit.delete.mock.calls[0][0];
      expect(callArgs.where.userId).toBe(MOCK_USER_ID);
    });

    it("should revalidate cache and paths after deletion", async () => {
      prismaMock.habit.delete.mockResolvedValue(createMockHabit());

      await deleteHabit(MOCK_HABIT_ID);

      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/habits");
    });

    it("should prevent deletion of other user's habits", async () => {
      prismaMock.habit.delete.mockRejectedValue(new Error("Habit not found"));

      await expect(() => deleteHabit(MOCK_HABIT_ID)).rejects.toThrow();
    });
  });
});
