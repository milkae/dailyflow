import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "@/generated/prisma/client";
import { TodayTodos } from "@/app/_components/TodayTodos";
import { Status } from "@/utils/action-state";

const mockCreateTodo = vi.fn();
const mockToggleTodoStatus = vi.fn();

vi.mock("@/app/(todos)/actions", () => ({
  createTodo: (...args: unknown[]) => mockCreateTodo(...args),
  toggleTodoStatus: (...args: unknown[]) => mockToggleTodoStatus(...args),
}));

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  name: "Write weekly recap",
  description: "Summarize the week highlights",
  isDone: false,
  urgent: false,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  userId: "user-1",
  ...overrides,
});

describe("TodayTodos", () => {
  it("allows quick add from the dashboard", async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockResolvedValue({
      status: "SUCCESS",
      formErrors: [],
      fieldErrors: {},
    });

    render(<TodayTodos todos={[]} pendingTodosCount={0} />);

    await user.type(
      screen.getByPlaceholderText(/what needs attention\?/i),
      "Reply to client",
    );
    await user.click(screen.getByRole("button", { name: /add todo/i }));

    expect(mockCreateTodo).toHaveBeenCalledWith(null, expect.any(FormData));

    const formData = mockCreateTodo.mock.calls[0][1] as FormData;
    expect(formData.get("name")).toBe("Reply to client");
  });

  it("allows quick completion from the dashboard preview", async () => {
    const user = userEvent.setup();
    mockToggleTodoStatus.mockResolvedValue({ status: Status.SUCCESS });

    render(
      <TodayTodos
        todos={[createTodo({ id: "todo-1", name: "Write weekly recap" })]}
        pendingTodosCount={1}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /mark write weekly recap as complete/i,
      }),
    );

    expect(mockToggleTodoStatus).toHaveBeenCalledWith(null, {
      id: "todo-1",
      completion: true,
    });

    await waitFor(() => {
      expect(screen.queryByText("Write weekly recap")).not.toBeInTheDocument();
    });
  });

  it("renders the todos section header", () => {
    render(<TodayTodos todos={[]} pendingTodosCount={0} />);

    expect(screen.getByRole("heading", { name: /todos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all/i })).toBeInTheDocument();
  });

  it("renders pending todo previews", () => {
    render(
      <TodayTodos
        todos={[
          createTodo({
            id: "todo-1",
            name: "Write weekly recap",
            urgent: true,
          }),
          createTodo({ id: "todo-2", name: "Plan groceries", urgent: false }),
        ]}
        pendingTodosCount={2}
      />,
    );

    expect(screen.getByText("Write weekly recap")).toBeInTheDocument();
    expect(screen.getByText("Plan groceries")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders overflow copy when more todos exist than previewed", () => {
    render(<TodayTodos todos={[createTodo()]} pendingTodosCount={3} />);

    expect(
      screen.getByText("2 more open todos in your list."),
    ).toBeInTheDocument();
  });

  it("renders an empty state when there are no open todos", () => {
    render(<TodayTodos todos={[]} pendingTodosCount={0} />);

    expect(screen.getByText("No pending todos")).toBeInTheDocument();
    expect(
      screen.getByText("Capture your next task to keep today focused."),
    ).toBeInTheDocument();
  });
});
