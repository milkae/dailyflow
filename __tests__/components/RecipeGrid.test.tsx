import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeGrid } from "@/app/(recipes)/_components/RecipeGrid";
import { createMockRecipe } from "../tests-utils";

vi.mock("@/app/(recipes)/_components/CreateRecipeDialog", () => ({
  CreateRecipeDialog: () => null,
}));

vi.mock("@/app/(recipes)/_components/EditRecipeDialog", () => ({
  EditRecipeDialog: () => null,
}));

vi.mock("@/app/(recipes)/_components/DeleteRecipeDialog", () => ({
  DeleteRecipeDialog: () => null,
}));

vi.mock("@/app/(meals)/_components/AddToMealPlanDialog", () => ({
  AddToMealPlanDialog: () => null,
}));

describe("RecipeGrid", () => {
  it("should render default empty state when no recipes", () => {
    render(<RecipeGrid recipes={[]} />);

    expect(screen.getByText("No recipes yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Start building your recipe collection to simplify meal planning.",
      ),
    ).toBeInTheDocument();
  });

  it("should render category-specific empty state when a filter is active", () => {
    render(<RecipeGrid recipes={[]} selectedCategory="Breakfast" />);

    expect(screen.getByText("No Breakfast recipes")).toBeInTheDocument();
    expect(
      screen.getByText("Add a recipe in this category to plan meals faster."),
    ).toBeInTheDocument();
  });

  it("should render recipe cards", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Pasta Carbonara",
        description: "Classic Italian pasta dish",
        prepTime: 10,
        cookTime: 15,
      }),
      createMockRecipe({
        id: "2",
        name: "Chicken Stir Fry",
        description: "Quick and healthy meal",
        prepTime: 15,
        cookTime: 20,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
  });

  it("should render total time", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: 10,
        cookTime: 15,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("25 min")).toBeInTheDocument();
    expect(screen.getByText("4 servings")).toBeInTheDocument();
  });

  it("should render total prep time when cook time is null", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: 10,
        cookTime: null,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("should render total cook time when prep time is null", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: 15,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("15 min")).toBeInTheDocument();
  });

  it("should not render a time label when both times are null", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: null,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.queryByText(/\bmin\b/)).not.toBeInTheDocument();
  });

  it("should render links to recipe pages", () => {
    const recipes = [
      createMockRecipe({
        id: "recipe-1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: null,
      }),
    ];

    render(<RecipeGrid recipes={recipes} />);

    const links = screen.getAllByRole("link", { name: /test recipe/i });
    expect(links[0]).toHaveAttribute("href", "/recipes/recipe-1");
  });

  it("should render grid layout", () => {
    const recipes = [
      createMockRecipe({
        id: "1",
        name: "Recipe 1",
        description: null,
        prepTime: null,
        cookTime: null,
      }),
    ];

    const { container } = render(<RecipeGrid recipes={recipes} />);

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid");
  });
});
