import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodosList } from "@/app/(todos)/todos/_components/TodosList";
import type { Todo } from "@/generated/prisma/client";

vi.mock("@/app/(todos)/actions", () => ({
  toggleTodoStatus: vi.fn(),
}));

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  name: "Write weekly recap",
  description: "Summarize the week’s highlights",
  isDone: false,
  urgent: true,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  userId: "user-1",
  ...overrides,
});

describe("TodosList", () => {
  it("shows an empty state when there are no todos", () => {
    render(<TodosList todos={[]} />);

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first task to get started."),
    ).toBeInTheDocument();
  });

  it("renders urgent todos with a priority badge", () => {
    render(<TodosList todos={[createTodo()]} />);

    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Write weekly recap")).toBeInTheDocument();
  });

  it("shows completed terminology for completed todos", () => {
    render(<TodosList todos={[createTodo({ id: "todo-2", isDone: true })]} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark as open/i }),
    ).toHaveTextContent("Reopen");
  });

  it("shows pending terminology for open todos", () => {
    render(<TodosList todos={[createTodo({ id: "todo-3", isDone: false })]} />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark as complete/i }),
    ).toHaveTextContent("Complete");
  });
});
