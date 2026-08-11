import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "@/generated/prisma/client";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

const mockGetHabitsForUser = vi.fn();

vi.mock("@/app/(habits)/actions", () => ({
  getHabitsForUser: (...args: unknown[]) => mockGetHabitsForUser(...args),
}));

import { prismaMock } from "@/singleton";
import { getDashboardData } from "@/app/actions";
import { MOCK_USER_ID } from "@/__tests__/tests-utils";

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  name: "Write weekly recap",
  description: "Summarize the week highlights",
  isDone: false,
  urgent: false,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  userId: MOCK_USER_ID,
  ...overrides,
});

describe("Dashboard actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetHabitsForUser.mockResolvedValue([]);
    prismaMock.meal.findMany.mockResolvedValue([]);
  });

  it("queries todo preview with urgency-first ordering and a 3-item limit", async () => {
    const todos = [
      createTodo({ id: "todo-1", urgent: true }),
      createTodo({ id: "todo-2", urgent: true }),
      createTodo({ id: "todo-3", urgent: false }),
    ];

    prismaMock.todo.findMany.mockResolvedValue(todos);
    prismaMock.todo.count.mockResolvedValue(3);

    const result = await getDashboardData(MOCK_USER_ID);

    expect(prismaMock.todo.findMany).toHaveBeenCalledWith({
      where: {
        userId: MOCK_USER_ID,
        isDone: false,
      },
      orderBy: [{ urgent: "desc" }, { createdAt: "asc" }],
      take: 3,
    });
    expect(result.todos).toEqual(todos);
  });

  it("uses total pending count independently of preview list length", async () => {
    prismaMock.todo.findMany.mockResolvedValue([
      createTodo({ id: "todo-1", urgent: true }),
      createTodo({ id: "todo-2", urgent: false }),
      createTodo({ id: "todo-3", urgent: false }),
    ]);
    prismaMock.todo.count.mockResolvedValue(9);

    const result = await getDashboardData(MOCK_USER_ID);

    expect(result.todos).toHaveLength(3);
    expect(result.stats.pendingTodos).toBe(9);
    expect(prismaMock.todo.count).toHaveBeenCalledWith({
      where: {
        userId: MOCK_USER_ID,
        isDone: false,
      },
    });
  });
});
