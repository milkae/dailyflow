import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeGrid } from "@/features/recipes/components/RecipeGrid";

describe("RecipeGrid", () => {
  it("should render recipe cards", () => {
    const recipes = [
      {
        id: "1",
        name: "Pasta Carbonara",
        description: "Classic Italian pasta dish",
        prepTime: 10,
        cookTime: 15,
      },
      {
        id: "2",
        name: "Chicken Stir Fry",
        description: "Quick and healthy meal",
        prepTime: 15,
        cookTime: 20,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Classic Italian pasta dish")).toBeInTheDocument();
    expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
    expect(screen.getByText("Quick and healthy meal")).toBeInTheDocument();
  });

  it("should render prep and cook times", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: 10,
        cookTime: 15,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("Prep: 10min")).toBeInTheDocument();
    expect(screen.getByText("Cook: 15min")).toBeInTheDocument();
  });

  it("should render only prep time when cook time is null", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: 10,
        cookTime: null,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("Prep: 10min")).toBeInTheDocument();
    expect(screen.queryByText("Cook:")).not.toBeInTheDocument();
  });

  it("should render only cook time when prep time is null", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: 15,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("Cook: 15min")).toBeInTheDocument();
    expect(screen.queryByText("Prep:")).not.toBeInTheDocument();
  });

  it("should not render time section when both times are null", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: null,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.queryByText("Prep:")).not.toBeInTheDocument();
    expect(screen.queryByText("Cook:")).not.toBeInTheDocument();
  });

  it("should render description when provided", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: "This is a test description",
        prepTime: null,
        cookTime: null,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("should not render description when null", () => {
    const recipes = [
      {
        id: "1",
        name: "Test Recipe",
        description: null,
        prepTime: null,
        cookTime: null,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    expect(
      screen.queryByText("This is a test description"),
    ).not.toBeInTheDocument();
  });

  it("should render links to recipe pages", () => {
    const recipes = [
      {
        id: "recipe-1",
        name: "Test Recipe",
        description: "Test description",
        prepTime: null,
        cookTime: null,
      },
    ];

    render(<RecipeGrid recipes={recipes} />);

    const link = screen.getByRole("link", { name: /test recipe/i });
    expect(link).toHaveAttribute("href", "/meals/recipes/recipe-1");
  });

  it("should render grid layout", () => {
    const recipes = [
      {
        id: "1",
        name: "Recipe 1",
        description: null,
        prepTime: null,
        cookTime: null,
      },
    ];

    const { container } = render(<RecipeGrid recipes={recipes} />);

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid");
  });
});
