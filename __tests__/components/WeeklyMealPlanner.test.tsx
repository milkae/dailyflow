import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeeklyMealPlanner } from "@/app/(meals)/_components/WeeklyMealPlanner";
import { MealType } from "@/generated/prisma/enums";
import { MealWithRecipeName } from "@/app/(meals)/types";
import { createMockMeal } from "@/__tests__/tests-utils";

vi.mock("react", async () => {
  const react = await vi.importActual<typeof import("react")>("react");

  return {
    ...react,
    use: (value: unknown) => value,
  };
});

vi.mock("@/app/_hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/app/(meals)/actions", () => ({
  deleteMeal: vi.fn(),
}));

vi.mock("@/app/(meals)/_components/AddMealDialog", () => ({
  AddMealDialog: () => <div data-testid="add-meal-dialog">Add Meal Dialog</div>,
}));

describe("WeeklyMealPlanner", () => {
  const createMeal = (): MealWithRecipeName =>
    ({
      ...createMockMeal({
        id: "meal-1",
        name: "Oatmeal",
        type: MealType.BREAKFAST,
      }),
      recipe: { id: "recipe-1", name: "Overnight Oats" },
    }) as MealWithRecipeName;

  const createMealsForDay = () => {
    const breakfastMeal = createMeal();

    return {
      [MealType.BREAKFAST]: breakfastMeal,
      [MealType.LUNCH]: null,
      [MealType.DINNER]: null,
      [MealType.SNACK]: null,
    } satisfies Record<MealType, MealWithRecipeName | null>;
  };

  const renderPlanner = () => {
    const mealsData = [
      {
        date: new Date("2024-04-15T00:00:00.000Z"),
        meals: createMealsForDay(),
      },
    ];

    const recipesData = [];

    render(
      <WeeklyMealPlanner
        mealsPromise={
          mealsData as unknown as Promise<
            { date: Date; meals: Record<MealType, MealWithRecipeName | null> }[]
          >
        }
        recipesPromise={recipesData as unknown as Promise<[]>}
      />,
    );
  };

  it("adds an accessible label for the icon-only delete action", async () => {
    renderPlanner();

    expect(
      await screen.findByRole("button", { name: /delete breakfast meal/i }),
    ).toBeInTheDocument();
  });

  it("opens meal dialog when the meal card is activated with Enter", async () => {
    const user = userEvent.setup();
    renderPlanner();

    const mealCard = await screen.findByRole("button", { name: /oatmeal/i });
    mealCard.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByTestId("add-meal-dialog")).toBeInTheDocument();
    });
  });

  it("opens meal dialog when the meal card is activated with Space", async () => {
    const user = userEvent.setup();
    renderPlanner();

    const mealCard = await screen.findByRole("button", { name: /oatmeal/i });
    mealCard.focus();
    await user.keyboard(" ");

    await waitFor(() => {
      expect(screen.getByTestId("add-meal-dialog")).toBeInTheDocument();
    });
  });

  it("does not open meal dialog when clicking the recipe link", async () => {
    const user = userEvent.setup();
    renderPlanner();

    expect(screen.queryByTestId("add-meal-dialog")).not.toBeInTheDocument();
    await user.click(
      await screen.findByRole("link", { name: /overnight oats/i }),
    );

    expect(screen.queryByTestId("add-meal-dialog")).not.toBeInTheDocument();
  });
});
