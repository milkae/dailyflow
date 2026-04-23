import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitsOverview } from "@/features/habits/components/HabitsOverview";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

describe("HabitsOverview", () => {
  it("should render habit cards when habits exist", () => {
    const habits = [
      createMockTypedHabitWithEntries("DAILY", null, [], { name: "Habit 1" }),
      createMockTypedHabitWithEntries("DAILY", null, [], { name: "Habit 2" }),
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

    render(<HabitsOverview habits={habits} />);

    const grid = screen.getByRole("generic"); // The div with grid classes
    expect(grid).toHaveClass("grid");
  });
});
