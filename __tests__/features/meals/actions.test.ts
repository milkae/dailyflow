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
import { addOrUpdateMeal, deleteMeal } from "@/app/(meals)/actions";
import { revalidatePath, updateTag } from "next/cache";
import { MealType } from "@/generated/prisma/browser";
import {
  createFormData,
  createMockMeal,
  MOCK_MEAL_ID,
  MOCK_USER_ID,
} from "@/__tests__/tests-utils";

describe("Meal Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addOrUpdateMeal", () => {
    describe("Create new meal", () => {
      it("should create breakfast meal with valid data", async () => {
        const meal = createMockMeal({ type: MealType.breakfast });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
          type: MealType.breakfast,
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.breakfast },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(result.fieldErrors).toEqual({});
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: { id: "", userId: MOCK_USER_ID },
          update: expect.any(Object),
          create: expect.objectContaining({
            name: meal.name,
            type: MealType.breakfast,
            userId: MOCK_USER_ID,
          }),
        });
      });

      it("should create lunch meal", async () => {
        const meal = createMockMeal({ type: MealType.lunch });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.lunch },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({ type: MealType.lunch }),
        });
      });

      it("should create dinner meal", async () => {
        const meal = createMockMeal({ type: MealType.dinner });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.dinner },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({ type: MealType.dinner }),
        });
      });

      it("should create snack meal", async () => {
        const meal = createMockMeal({ type: MealType.snack });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.snack },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({ type: MealType.snack }),
        });
      });

      it("should create meal with recipe", async () => {
        const meal = createMockMeal({
          recipeId: "recipe-123",
        });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
          recipeId: "recipe-123",
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.lunch },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({ recipeId: "recipe-123" }),
        });
      });

      it("should create meal with notes", async () => {
        const meal = createMockMeal({ notes: "Added extra cheese" });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
          notes: "Added extra cheese",
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.lunch },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: expect.any(Object),
          update: expect.any(Object),
          create: expect.objectContaining({ notes: "Added extra cheese" }),
        });
      });

      it("should normalize date to start of day", async () => {
        const dateWithTime = new Date("2024-04-15T14:30:45.123Z");
        const meal = createMockMeal();
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({ name: meal.name });

        await addOrUpdateMeal(
          { date: dateWithTime, type: MealType.lunch },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        const callArgs = prismaMock.meal.upsert.mock.calls[0][0];
        const mealDate = callArgs.create?.date as Date | undefined;
        expect(mealDate?.getHours()).toBe(0);
        expect(mealDate?.getMinutes()).toBe(0);
      });

      it("should revalidate cache and paths after creation", async () => {
        const meal = createMockMeal();
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({ name: meal.name });

        await addOrUpdateMeal(
          { date: new Date(), type: MealType.lunch },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(updateTag).toHaveBeenCalledWith("dashboard");
        expect(revalidatePath).toHaveBeenCalledWith("/");
        expect(revalidatePath).toHaveBeenCalledWith("/meals");
      });
    });

    describe("Update existing meal", () => {
      it("should update meal with existing ID", async () => {
        const meal = createMockMeal({
          name: "Updated Meal",
          notes: "Updated notes",
        });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
          notes: meal.notes,
        });

        const result = await addOrUpdateMeal(
          { date, type: MealType.lunch, id: MOCK_MEAL_ID },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(result.formErrors).toEqual([]);
        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: { id: MOCK_MEAL_ID, userId: MOCK_USER_ID },
          update: expect.objectContaining({
            name: meal.name,
            notes: meal.notes,
          }),
          create: expect.any(Object),
        });
      });

      it("should update meal recipe", async () => {
        const meal = createMockMeal({ recipeId: "recipe-456" });
        const date = new Date("2024-04-15");
        prismaMock.meal.upsert.mockResolvedValue(meal);

        const formData = createFormData({
          name: meal.name,
          recipeId: "recipe-456",
        });

        await addOrUpdateMeal(
          { date, type: MealType.lunch, id: MOCK_MEAL_ID },
          { formErrors: [], fieldErrors: {} },
          formData,
        );

        expect(prismaMock.meal.upsert).toHaveBeenCalledWith({
          where: { id: MOCK_MEAL_ID, userId: MOCK_USER_ID },
          update: expect.objectContaining({ recipeId: "recipe-456" }),
          create: expect.any(Object),
        });
      });
    });
  });

  describe("deleteMeal", () => {
    it("should delete meal with specified ID", async () => {
      const meal = createMockMeal();
      prismaMock.meal.delete.mockResolvedValue(meal);

      await deleteMeal(MOCK_MEAL_ID);

      expect(prismaMock.meal.delete).toHaveBeenCalledWith({
        where: { id: MOCK_MEAL_ID, userId: MOCK_USER_ID },
      });
    });

    it("should verify user owns the meal", async () => {
      const meal = createMockMeal();
      prismaMock.meal.delete.mockResolvedValue(meal);

      await deleteMeal(MOCK_MEAL_ID);

      const callArgs = prismaMock.meal.delete.mock.calls[0][0];
      expect(callArgs.where.userId).toBe(MOCK_USER_ID);
    });

    it("should revalidate cache and paths after deletion", async () => {
      const meal = createMockMeal();
      prismaMock.meal.delete.mockResolvedValue(meal);

      await deleteMeal(MOCK_MEAL_ID);

      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/meals");
    });

    it("should prevent deletion of other user's meals", async () => {
      prismaMock.meal.delete.mockRejectedValue(new Error("Meal not found"));

      await expect(() => deleteMeal(MOCK_MEAL_ID)).rejects.toThrow();
    });

    it("should handle deletion of non-existent meal gracefully", async () => {
      prismaMock.meal.delete.mockRejectedValue(new Error("Record not found"));

      await expect(() => deleteMeal("non-existent-id")).rejects.toThrow();
    });
  });
});
