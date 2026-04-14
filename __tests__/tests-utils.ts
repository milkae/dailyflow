import { Frequency, MealType } from "@/generated/prisma/enums";
import type { TypedHabitWithEntries } from "@/features/habits/types";
import { Entry } from "@/generated/prisma/browser";

export const getByNestedText =
  (string: string) => (content: string, element: Element | null) =>
    content !== "" && element?.textContent === string;

export const MOCK_USER_ID = "user-1";
export const MOCK_RECIPE_ID = "recipe-1";
export const MOCK_HABIT_ID = "habit-1";
export const MOCK_MEAL_ID = "meal-1";

export const createMockRecipe = (overrides = {}) => ({
  id: MOCK_RECIPE_ID,
  name: "Pesto Pasta",
  description: "Classic Italian pasta",
  prepTime: 10,
  cookTime: 20,
  imageUrl: null,
  sourceUrl: "https://example.com/recipe",
  category: null,
  ingredients: "pasta, pesto, cream, parmesan",
  instructions: "Boil pasta, mix with pesto and cream",
  servings: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: MOCK_USER_ID,
  ...overrides,
});

export const createMockEntry = (date: Date, overrides = {}) => ({
  id: "entry-1",
  habitId: MOCK_HABIT_ID,
  date: new Date(date),
  note: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTypedHabitWithEntries = (
  frequency: Frequency = Frequency.DAILY,
  frequencyConfig: unknown = null,
  entries: Entry[] = [],
  overrides = {},
) =>
  ({
    id: MOCK_HABIT_ID,
    name: "Morning Run",
    description: "5km run",
    frequency,
    frequencyConfig,
    userId: MOCK_USER_ID,
    startDate: new Date("2024-01-01"),
    createdAt: new Date(),
    entries,
    ...overrides,
  }) as TypedHabitWithEntries;

export const createMockHabit = (overrides = {}) => ({
  id: MOCK_HABIT_ID,
  name: "Morning Run",
  description: "5km run",
  frequency: Frequency.DAILY,
  frequencyConfig: null,
  userId: MOCK_USER_ID,
  startDate: new Date("2024-01-01"),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  return formData;
};

export const createMockMeal = (overrides = {}) => ({
  id: MOCK_MEAL_ID,
  name: "Pasta Carbonara",
  type: MealType.lunch,
  date: new Date("2024-04-15"),
  recipeId: null,
  notes: null,
  userId: MOCK_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
