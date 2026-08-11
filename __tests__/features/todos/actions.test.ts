import { beforeEach, describe, expect, it, vi } from "vitest";

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
import { getAllTodos, createTodo, toggleTodoStatus } from "@/app/(todos)/actions";
import { revalidatePath, updateTag } from "next/cache";
import type { Todo } from "@/generated/prisma/client";
import { createFormData, MOCK_USER_ID } from "@/__tests__/tests-utils";
import { Status } from "@/utils/action-state";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  name: "Write weekly recap",
  description: "Summarize the week highlights",
  isDone: false,
  urgent: false,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  userId: MOCK_USER_ID,
  ...overrides,
});

describe("Todo Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("returns todos for the current user", async () => {
      const todos = [createMockTodo(), createMockTodo({ id: "todo-2" })];
      prismaMock.todo.findMany.mockResolvedValue(todos);

      const result = await getAllTodos();

      expect(result).toEqual(todos);
      expect(prismaMock.todo.findMany).toHaveBeenCalledWith({
        where: { userId: MOCK_USER_ID },
      });
    });
  });

  describe("createTodo", () => {
    it("creates a todo with valid data", async () => {
      prismaMock.todo.create.mockResolvedValue(createMockTodo());
      const formData = createFormData({
        name: "Reply to client",
        description: "About the roadmap",
        urgent: true,
      });

      const result = await createTodo(null, formData);

      expect(result).toEqual({
        formErrors: [],
        fieldErrors: {},
        status: Status.SUCCESS,
      });
      expect(prismaMock.todo.create).toHaveBeenCalledWith({
        data: {
          name: "Reply to client",
          description: "About the roadmap",
          urgent: true,
          userId: MOCK_USER_ID,
        },
      });
      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });

    it("returns validation errors for invalid data", async () => {
      const formData = createFormData({
        name: "",
      });

      const result = await createTodo(null, formData);

      expect(result?.status).toBe(Status.ERROR);
      expect(result?.fieldErrors?.name).toBeDefined();
      expect(prismaMock.todo.create).not.toHaveBeenCalled();
      expect(updateTag).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("toggleTodoStatus", () => {
    it("updates completion status and invalidates dashboard and todos routes", async () => {
      prismaMock.todo.update.mockResolvedValue(
        createMockTodo({ id: "todo-1", isDone: true }),
      );

      const result = await toggleTodoStatus(null, {
        id: "todo-1",
        completion: true,
      });

      expect(result).toEqual({ status: Status.SUCCESS });
      expect(prismaMock.todo.update).toHaveBeenCalledWith({
        where: { id: "todo-1", userId: MOCK_USER_ID },
        data: { isDone: true },
      });
      expect(updateTag).toHaveBeenCalledWith("dashboard");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });
  });
});
