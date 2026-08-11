import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { prismaMock } from "@/singleton";
import { createMockRecipe } from "@/__tests__/tests-utils";

const getSessionMock = vi.fn();
const headersMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: (...args: unknown[]) => headersMock(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock("@/app/(recipes)/_components/CreateRecipeDialog", () => ({
  CreateRecipeDialog: () => <div data-testid="create-recipe-dialog" />,
}));

vi.mock("@/app/(recipes)/_components/RecipeGrid", () => ({
  RecipeGrid: ({
    recipes,
    selectedCategory,
  }: {
    recipes: Array<{ id: string }>;
    selectedCategory?: string;
  }) => (
    <div
      data-testid="recipe-grid"
      data-recipe-count={recipes.length}
      data-selected-category={selectedCategory ?? ""}
    />
  ),
}));

vi.mock("@/app/(recipes)/_components/CategoryFilter", () => ({
  CategoryFilter: ({
    selectedCategory,
  }: {
    selectedCategory?: string;
  }) => (
    <div
      data-testid="category-filter"
      data-selected-category={selectedCategory ?? ""}
    />
  ),
}));

import RecipesPage from "@/app/(recipes)/recipes/page";

describe("RecipesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it("redirects unauthenticated users to sign-in", async () => {
    getSessionMock.mockResolvedValue(null);
    redirectMock.mockImplementation(() => {
      throw new Error("REDIRECT");
    });

    await expect(
      RecipesPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow("REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/sign-in");
    expect(prismaMock.recipe.findMany).not.toHaveBeenCalled();
  });

  it("renders the unfiltered recipe count", async () => {
    getSessionMock.mockResolvedValue({ user: { id: "user-1" } });

    const recipes = [
      createMockRecipe({ id: "recipe-1" }),
      createMockRecipe({ id: "recipe-2" }),
    ];
    const totalRecipes = 2;
    prismaMock.recipe.findMany.mockResolvedValue(recipes);
    prismaMock.recipe.count.mockResolvedValue(totalRecipes);
    prismaMock.recipeCategory.findMany.mockResolvedValue([
      { id: "cat-1", slug: "breakfast", name: "Breakfast", userId: "user-1" },
    ]);
    prismaMock.$transaction.mockResolvedValue([recipes, totalRecipes] as never);

    render(await RecipesPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("2 recipes in your collection")).toBeInTheDocument();
    expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
      where: undefined,
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });
    expect(prismaMock.recipe.count).toHaveBeenCalledWith({ where: undefined });
    expect(screen.getByTestId("category-filter")).toHaveAttribute(
      "data-selected-category",
      "",
    );
  });

  it("applies selected category filter to query and count", async () => {
    getSessionMock.mockResolvedValue({ user: { id: "user-1" } });

    const recipes = [
      createMockRecipe({ id: "recipe-3", name: "Granola" }),
    ];
    const totalRecipes = 1;
    prismaMock.recipe.findMany.mockResolvedValue(recipes);
    prismaMock.recipe.count.mockResolvedValue(totalRecipes);
    prismaMock.recipeCategory.findMany.mockResolvedValue([
      { id: "cat-1", slug: "breakfast", name: "Breakfast", userId: "user-1" },
      { id: "cat-2", slug: "dinner", name: "Dinner", userId: "user-1" },
    ]);
    prismaMock.$transaction.mockResolvedValue([recipes, totalRecipes] as never);

    render(
      await RecipesPage({
        searchParams: Promise.resolve({ category: "breakfast" }),
      }),
    );

    expect(screen.getByText("1 recipe in your collection")).toBeInTheDocument();
    expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
      where: {
        categories: {
          some: {
            slug: "breakfast",
          },
        },
      },
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });
    expect(prismaMock.recipe.count).toHaveBeenCalledWith({
      where: {
        categories: {
          some: {
            slug: "breakfast",
          },
        },
      },
    });
    expect(screen.getByTestId("category-filter")).toHaveAttribute(
      "data-selected-category",
      "breakfast",
    );
    expect(screen.getByTestId("recipe-grid")).toHaveAttribute(
      "data-selected-category",
      "Breakfast",
    );
  });
});
