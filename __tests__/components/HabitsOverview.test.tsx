import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitsOverview } from "@/app/(habits)/_components/HabitsOverview";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

vi.mock("@/app/(habits)/_components/DeleteHabitButton", () => ({
  DeleteHabitButton: () => <button aria-label="Delete">Delete</button>,
}));

describe("HabitsOverview", () => {
  it("should render habit cards when habits exist", () => {
    const habits = [
      createMockTypedHabitWithEntries("DAILY", null, [], {
        id: "habit-1",
        name: "Habit 1",
      }),
      createMockTypedHabitWithEntries("DAILY", null, [], {
        id: "habit-2",
        name: "Habit 2",
      }),
    ];

    render(<HabitsOverview habits={habits} />);

    expect(screen.getByText("Habit 1")).toBeInTheDocument();
    expect(screen.getByText("Habit 2")).toBeInTheDocument();
  });

  it("should render empty state when no habits", () => {
    render(<HabitsOverview habits={[]} />);

    expect(
      screen.getByText("No habits yet. Create your first one to get started!"),
    ).toBeInTheDocument();
  });

  it("should render grid layout", () => {
    const habits = [createMockTypedHabitWithEntries()];

    const { container } = render(<HabitsOverview habits={habits} />);
    const grid = container.querySelector(".grid");

    expect(grid).toHaveClass("grid");
  });
});
