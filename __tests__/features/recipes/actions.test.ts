import { vi, it, expect, describe, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/dal", () => ({
  verifySession: async () => ({
    isAuth: true,
    userId: "user-1",
  }),
}));

import { prismaMock } from "@/singleton";
import {
  createOrUpdateRecipe,
  deleteRecipe,
  getAllRecipes,
} from "@/features/recipes/actions";
import { revalidatePath } from "next/cache";

const MOCK_USER_ID = "user-1";
const MOCK_RECIPE_ID = "recipe-1";

const createMockRecipe = (overrides = {}) => ({
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

const createFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  return formData;
};

describe("createOrUpdateRecipe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create new recipe", () => {
    it("should create recipe with valid required fields", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result).toEqual({ formErrors: [], fieldErrors: {} });
      expect(prismaMock.recipe.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          userId: MOCK_USER_ID,
        }),
      });
      expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
    });

    it("should create recipe with optional fields", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result).toEqual({ formErrors: [], fieldErrors: {} });
      expect(prismaMock.recipe.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: recipe.description,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
        }),
      });
    });

    it("should apply default servings value if not provided", async () => {
      const recipe = createMockRecipe({ servings: 4 });
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(prismaMock.recipe.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ servings: 4 }),
      });
    });

    it("should return validation error for missing required name", async () => {
      const formData = createFormData({
        ingredients: "pasta",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("name");
      expect(prismaMock.recipe.create).not.toHaveBeenCalled();
    });

    it("should return validation error for missing required ingredients", async () => {
      const formData = createFormData({
        name: "Recipe",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("ingredients");
      expect(prismaMock.recipe.create).not.toHaveBeenCalled();
    });

    it("should return validation error for missing required instructions", async () => {
      const formData = createFormData({
        name: "Recipe",
        ingredients: "pasta",
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("instructions");
      expect(prismaMock.recipe.create).not.toHaveBeenCalled();
    });

    it("should enforce max length constraints on fields", async () => {
      const formData = createFormData({
        name: "x".repeat(101), // exceeds max 100
        ingredients: "pasta",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("name");
    });

    it("should return error for invalid servings (less than 1)", async () => {
      const formData = createFormData({
        name: "Recipe",
        ingredients: "pasta",
        instructions: "boil",
        servings: 0,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("servings");
    });

    it("should return error for invalid prepTime (negative)", async () => {
      const formData = createFormData({
        name: "Recipe",
        ingredients: "pasta",
        instructions: "boil",
        prepTime: -5,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("prepTime");
    });

    it("should return error for invalid cookTime (negative)", async () => {
      const formData = createFormData({
        name: "Recipe",
        ingredients: "pasta",
        instructions: "boil",
        cookTime: -10,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("cookTime");
    });

    it("should handle database errors gracefully during create", async () => {
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const formData = createFormData({
        name: "Recipe",
        ingredients: "pasta",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.formErrors).toContain(
        "Failed to save recipe. Please try again.",
      );
    });
  });

  describe("create recipe with sourceUrl", () => {
    it("should update existing recipe if sourceUrl matches", async () => {
      const recipe = createMockRecipe();
      const existingRecipe = createMockRecipe({ id: "recipe-2" });
      prismaMock.recipe.findFirst.mockResolvedValue(existingRecipe);
      prismaMock.recipe.update.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        sourceUrl: recipe.sourceUrl,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result).toEqual({ formErrors: [], fieldErrors: {} });
      expect(prismaMock.recipe.findFirst).toHaveBeenCalledWith({
        where: {
          sourceUrl: recipe.sourceUrl,
          userId: MOCK_USER_ID,
        },
      });
      expect(prismaMock.recipe.update).toHaveBeenCalledWith({
        where: { id: "recipe-2", userId: MOCK_USER_ID },
        data: expect.any(Object),
      });
      expect(prismaMock.recipe.create).not.toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
    });

    it("should create new recipe if sourceUrl is unique", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        sourceUrl: recipe.sourceUrl,
      });

      const result = await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result).toEqual({ formErrors: [], fieldErrors: {} });
      expect(prismaMock.recipe.findFirst).toHaveBeenCalled();
      expect(prismaMock.recipe.create).toHaveBeenCalled();
    });

    it("should not check for duplicates if sourceUrl is missing", async () => {
      const recipe = createMockRecipe({ sourceUrl: undefined });
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(prismaMock.recipe.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.recipe.create).toHaveBeenCalled();
    });
  });

  describe("update existing recipe", () => {
    it("should update recipe if user has permission", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findUnique.mockResolvedValue(recipe);
      prismaMock.recipe.update.mockResolvedValue(recipe);

      const formData = createFormData({
        name: "Updated Recipe",
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      const result = await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result).toEqual({ formErrors: [], fieldErrors: {} });
      expect(prismaMock.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: MOCK_RECIPE_ID, userId: MOCK_USER_ID },
      });
      expect(prismaMock.recipe.update).toHaveBeenCalledWith({
        where: { id: MOCK_RECIPE_ID, userId: MOCK_USER_ID },
        data: expect.objectContaining({ name: "Updated Recipe" }),
      });
      expect(revalidatePath).toHaveBeenCalledWith(
        `/meals/recipes/${MOCK_RECIPE_ID}`,
      );
    });

    it("should update all fields including optional ones", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findUnique.mockResolvedValue(recipe);
      prismaMock.recipe.update.mockResolvedValue(recipe);

      const newDescription = "New description";
      const formData = createFormData({
        name: recipe.name,
        description: newDescription,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: 15,
        cookTime: 25,
        servings: 6,
      });

      await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(prismaMock.recipe.update).toHaveBeenCalledWith({
        where: { id: MOCK_RECIPE_ID, userId: MOCK_USER_ID },
        data: expect.objectContaining({
          description: newDescription,
          prepTime: 15,
          cookTime: 25,
          servings: 6,
        }),
      });
    });

    it("should return error if recipe not found during update", async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);

      const formData = createFormData({
        name: "Updated Recipe",
        ingredients: "pasta",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.formErrors).toContain("Recipe not found");
      expect(prismaMock.recipe.update).not.toHaveBeenCalled();
    });

    it("should not allow unauthorized update (recipe owned by different user)", async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);

      const formData = createFormData({
        name: "Hijacked Recipe",
        ingredients: "pasta",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.formErrors).toContain("Recipe not found");
    });

    it("should handle validation errors during update", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findUnique.mockResolvedValue(recipe);

      const formData = createFormData({
        name: "Recipe",
        instructions: "boil",
      });

      const result = await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.fieldErrors).toHaveProperty("ingredients");
      expect(prismaMock.recipe.update).not.toHaveBeenCalled();
    });

    it("should handle database errors during update", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findUnique.mockResolvedValue(recipe);
      prismaMock.recipe.update.mockRejectedValue(new Error("Database error"));

      const formData = createFormData({
        name: "Updated Recipe",
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      const result = await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(result.formErrors).toContain(
        "Failed to save recipe. Please try again.",
      );
    });
  });

  describe("revalidation", () => {
    it("should revalidate /meals/recipes on successful create", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
    });

    it("should revalidate /meals/recipes on sourceUrl update", async () => {
      const recipe = createMockRecipe();
      const existingRecipe = createMockRecipe({ id: "recipe-2" });
      prismaMock.recipe.findFirst.mockResolvedValue(existingRecipe);
      prismaMock.recipe.update.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        sourceUrl: recipe.sourceUrl,
      });

      await createOrUpdateRecipe(
        {},
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
    });

    it("should revalidate specific recipe path on update", async () => {
      const recipe = createMockRecipe();
      prismaMock.recipe.findUnique.mockResolvedValue(recipe);
      prismaMock.recipe.update.mockResolvedValue(recipe);

      const formData = createFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });

      await createOrUpdateRecipe(
        { id: MOCK_RECIPE_ID },
        { formErrors: [], fieldErrors: {} },
        formData,
      );

      expect(revalidatePath).toHaveBeenCalledWith(
        `/meals/recipes/${MOCK_RECIPE_ID}`,
      );
    });
  });
});

describe("deleteRecipe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete recipe if user has permission", async () => {
    const recipe = createMockRecipe();
    prismaMock.recipe.findUnique.mockResolvedValue(recipe);
    prismaMock.recipe.delete.mockResolvedValue(recipe);

    await deleteRecipe(MOCK_RECIPE_ID);

    expect(prismaMock.recipe.findUnique).toHaveBeenCalledWith({
      where: { id: MOCK_RECIPE_ID, userId: MOCK_USER_ID },
    });
    expect(prismaMock.recipe.delete).toHaveBeenCalledWith({
      where: { id: MOCK_RECIPE_ID, userId: MOCK_USER_ID },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
  });

  it("should throw Unauthorized error if recipe not found", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(null);

    await expect(deleteRecipe(MOCK_RECIPE_ID)).rejects.toThrow("Unauthorized");
    expect(prismaMock.recipe.delete).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should not allow deletion if recipe owned by different user (implicitly via findUnique)", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(null);

    await expect(deleteRecipe(MOCK_RECIPE_ID)).rejects.toThrow("Unauthorized");
    expect(prismaMock.recipe.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors during deletion", async () => {
    const recipe = createMockRecipe();
    prismaMock.recipe.findUnique.mockResolvedValue(recipe);
    prismaMock.recipe.delete.mockRejectedValue(new Error("Database error"));

    await expect(deleteRecipe(MOCK_RECIPE_ID)).rejects.toThrow(
      "Database error",
    );
  });

  it("should revalidate cache after successful deletion", async () => {
    const recipe = createMockRecipe();
    prismaMock.recipe.findUnique.mockResolvedValue(recipe);
    prismaMock.recipe.delete.mockResolvedValue(recipe);

    await deleteRecipe(MOCK_RECIPE_ID);

    expect(revalidatePath).toHaveBeenCalledWith("/meals/recipes");
  });
});

describe("getAllRecipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all recipes for the authenticated user", async () => {
    const recipes = [
      createMockRecipe({ id: "recipe-1" }),
      createMockRecipe({ id: "recipe-2" }),
      createMockRecipe({ id: "recipe-3" }),
    ];
    prismaMock.recipe.findMany.mockResolvedValue(recipes);

    const result = await getAllRecipes();

    expect(result).toEqual(recipes);
    expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
      where: { userId: MOCK_USER_ID },
    });
  });

  it("should return empty array if user has no recipes", async () => {
    prismaMock.recipe.findMany.mockResolvedValue([]);

    const result = await getAllRecipes();

    expect(result).toEqual([]);
    expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
      where: { userId: MOCK_USER_ID },
    });
  });

  it("should only fetch recipes for the authenticated user", async () => {
    const recipes = [createMockRecipe({ userId: MOCK_USER_ID })];
    prismaMock.recipe.findMany.mockResolvedValue(recipes);

    await getAllRecipes();

    expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
      where: { userId: MOCK_USER_ID },
    });

    const callArgs = prismaMock.recipe.findMany.mock.calls[0][0];
    expect(callArgs?.where).toEqual({ userId: MOCK_USER_ID });
  });

  it("should return recipes with all properties intact", async () => {
    const recipe = createMockRecipe();
    prismaMock.recipe.findMany.mockResolvedValue([recipe]);

    const result = await getAllRecipes();

    expect(result[0]).toMatchObject({
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      userId: recipe.userId,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    });
  });

  it("should handle database errors gracefully", async () => {
    prismaMock.recipe.findMany.mockRejectedValue(
      new Error("Database connection failed"),
    );

    await expect(getAllRecipes()).rejects.toThrow("Database connection failed");
  });

  it("should return recipes in the order they exist in the database", async () => {
    const recipe1 = createMockRecipe({
      id: "recipe-1",
      name: "Alpha",
    });
    const recipe2 = createMockRecipe({
      id: "recipe-2",
      name: "Beta",
    });
    const recipes = [recipe1, recipe2];
    prismaMock.recipe.findMany.mockResolvedValue(recipes);

    const result = await getAllRecipes();

    expect(result[0].name).toBe("Alpha");
    expect(result[1].name).toBe("Beta");
  });
});
