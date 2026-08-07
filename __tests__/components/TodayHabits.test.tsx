import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayHabits } from "@/app/_components/TodayHabits";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

describe("TodayHabits", () => {
  it("should render habits when provided", () => {
    const habits = [createMockTypedHabitWithEntries()];

    render(<TodayHabits habits={habits} />);

    expect(
      screen.getByRole("heading", { name: /habits/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all/i })).toBeInTheDocument();
  });

  it("should render empty state when no habits", () => {
    render(<TodayHabits habits={[]} />);

    expect(screen.getByText("No habits for today")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create your first habit to start tracking your progress",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create habit/i }),
    ).toBeInTheDocument();
  });

  it("should render new habit button in header", () => {
    const habits = [createMockTypedHabitWithEntries()];

    render(<TodayHabits habits={habits} />);

    expect(screen.getByRole("button", { name: /new/i })).toBeInTheDocument();
  });

  it("should render multiple habits", () => {
    const habits = [
      createMockTypedHabitWithEntries("DAILY", null, [], { name: "Habit 1" }),
      createMockTypedHabitWithEntries("DAILY", null, [], { name: "Habit 2" }),
    ];

    render(<TodayHabits habits={habits} />);

    expect(screen.getByText("Habit 1")).toBeInTheDocument();
    expect(screen.getByText("Habit 2")).toBeInTheDocument();
  });
});
