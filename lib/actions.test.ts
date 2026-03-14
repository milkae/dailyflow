import { vi, beforeEach, test, expect } from "vitest";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import { Frequency, PrismaClient } from "../generated/prisma/client";

// Mock revalidatePath BEFORE importing actions
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock prisma
vi.mock("./prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import {
  createHabit,
  submitHabitEntryForm,
  createHabitEntry,
  deleteHabit,
  deleteHabitEntry,
  setDailyHabitStatus,
  getLastMonthHabits,
} from "./actions";

let mock: DeepMockProxy<PrismaClient>;

beforeEach(async () => {
  const { prisma } = await import("./prisma");
  mock = prisma as DeepMockProxy<PrismaClient>;
  mockReset(mock);
});

test("createHabit - returns validation errors when name is missing", async () => {
  const formData = new FormData();
  formData.append("description", "Some description");

  const result = await createHabit(
    { formErrors: [], fieldErrors: {} },
    formData,
  );

  expect(result.fieldErrors).toHaveProperty("name");
});

test("createHabit - returns form error when database fails", async () => {
  mock.habit.create.mockRejectedValue(new Error("DB Error"));
  const formData = new FormData();
  formData.append("name", "Test Habit");

  const result = await createHabit(
    { formErrors: [], fieldErrors: {} },
    formData,
  );

  expect(result.formErrors).toContain("Failed to create habit");
});

test("createHabitEntry - creates new entry when none exists", async () => {
  const testDate = new Date("2024-01-15");
  mock.entry.findFirst.mockResolvedValue(null);
  mock.entry.create.mockResolvedValue({
    id: "e-1",
    habitId: "h-1",
    date: testDate,
    note: "Test note",
  });

  await createHabitEntry("h-1", testDate, "Test note");

  expect(mock.entry.create).toHaveBeenCalledWith({
    data: {
      habitId: "h-1",
      date: expect.any(Date),
      note: "Test note",
    },
  });
});

test("createHabitEntry - updates existing entry", async () => {
  const testDate = new Date("2024-01-15");
  const existingEntry = {
    id: "e-1",
    habitId: "h-1",
    date: testDate,
    note: "Old note",
  };

  mock.entry.findFirst.mockResolvedValue(existingEntry);
  mock.entry.update.mockResolvedValue({
    ...existingEntry,
    note: "New note",
  });

  await createHabitEntry("h-1", testDate, "New note");

  expect(mock.entry.update).toHaveBeenCalledWith({
    where: { id: "e-1" },
    data: { note: "New note" },
  });
});

test("deleteHabitEntry - removes entry by habitId and date", async () => {
  const testDate = new Date("2024-01-15");
  mock.entry.deleteMany.mockResolvedValue({ count: 1 });

  await deleteHabitEntry("h-1", testDate);

  expect(mock.entry.deleteMany).toHaveBeenCalledWith({
    where: {
      habitId: "h-1",
      date: expect.any(Date),
    },
  });
});

test("setDailyHabitStatus - calls deleteHabitEntry when completion is false", async () => {
  mock.entry.deleteMany.mockResolvedValue({ count: 1 });

  await setDailyHabitStatus("h-1", false);

  expect(mock.entry.deleteMany).toHaveBeenCalled();
});

test("setDailyHabitStatus - calls createHabitEntry when completion is true", async () => {
  mock.entry.findFirst.mockResolvedValue(null);
  mock.entry.create.mockResolvedValue({
    id: "e-1",
    habitId: "h-1",
    date: expect.any(Date),
    note: null,
  });

  await setDailyHabitStatus("h-1", true);

  expect(mock.entry.create).toHaveBeenCalled();
});

test("getLastMonthHabits - fetches habits from last month", async () => {
  const mockHabits = [
    {
      id: "h-1",
      name: "Exercise",
      description: "Daily exercise",
      createdAt: new Date(),
      entries: [],
      frequency: Frequency.DAILY,
    },
  ];

  mock.habit.findMany.mockResolvedValue(mockHabits);

  await getLastMonthHabits();

  expect(mock.habit.findMany).toHaveBeenCalledWith({
    include: {
      entries: {
        where: {
          date: { gte: expect.any(Date) },
        },
      },
    },
  });
});

test("deleteHabit - removes habit by id", async () => {
  mock.habit.delete.mockResolvedValue({
    id: "h-1",
    name: "Exercise",
    description: "Daily exercise",
    createdAt: new Date(),
    frequency: Frequency.DAILY,
  });

  await deleteHabit("h-1");

  expect(mock.habit.delete).toHaveBeenCalledWith({
    where: { id: "h-1" },
  });
});

test("submitHabitEntryForm - extracts note and creates entry", async () => {
  mock.entry.findFirst.mockResolvedValue(null);
  mock.entry.create.mockResolvedValue({
    id: "e-1",
    habitId: "h-1",
    date: expect.any(Date),
    note: "Felt great today",
  });

  const formData = new FormData();
  formData.append("note", "Felt great today");

  await submitHabitEntryForm("h-1", formData);

  expect(mock.entry.create).toHaveBeenCalled();
});
