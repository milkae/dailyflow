import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayMeals } from "@/app/_components/TodayMeals";
import { MealType } from "@/generated/prisma/enums";
import { MealWithRecipeName } from "@/app/(meals)/types";

describe("TodayMeals", () => {
  it("should render meals section header", () => {
    render(<TodayMeals meals={[]} />);

    expect(screen.getByRole("heading", { name: /meals/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /plan week/i }),
    ).toBeInTheDocument();
  });

  it("should render meal slots for each meal type except snack", () => {
    render(<TodayMeals meals={[]} />);

    // Should render breakfast, lunch, dinner slots
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Dinner")).toBeInTheDocument();

    // Should not render snack
    expect(screen.queryByText("Snack")).not.toBeInTheDocument();
  });

  it("should render plan meals button when no meals", () => {
    render(<TodayMeals meals={[]} />);

    expect(screen.getByText("No meals planned today")).toBeInTheDocument();
    expect(
      screen.getByText("Plan your meals to keep today simple and intentional."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /plan meals/i }),
    ).toBeInTheDocument();
  });

  it("should pass meals to correct slots", () => {
    const meals = [
      {
        id: "1",
        type: MealType.BREAKFAST,
        date: new Date(),
        recipeId: "recipe-1",
        userId: "user-1",
        recipe: { name: "Oatmeal" },
      },
      {
        id: "2",
        type: MealType.LUNCH,
        date: new Date(),
        recipeId: "recipe-2",
        userId: "user-1",
        recipe: { name: "Salad" },
      },
    ] as MealWithRecipeName[];

    render(<TodayMeals meals={meals} />);

    // The MealSlot components should receive the correct meals
    // This test assumes MealSlot displays the recipe name
    expect(screen.getByText("Oatmeal")).toBeInTheDocument();
    expect(screen.getByText("Salad")).toBeInTheDocument();
  });

  it("should handle empty meals array", () => {
    render(<TodayMeals meals={[]} />);

    // Should still render all meal slots
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Dinner")).toBeInTheDocument();
  });
});
