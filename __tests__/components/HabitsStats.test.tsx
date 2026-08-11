import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitsStats } from "@/app/(habits)/_components/HabitsStats";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

vi.mock("@/app/(habits)/_components/WeeklyActivityChart", () => ({
  WeeklyActivityChart: () => <div>Weekly Activity Chart</div>,
}));

vi.mock("@/app/(habits)/_components/CompletionRateChart", () => ({
  CompletionRateChart: () => <div>Completion Rate Chart</div>,
}));

vi.mock("@/app/(habits)/_components/StreakLeaderBoard", () => ({
  StreakLeaderboard: () => <div>Streak Leaderboard</div>,
}));

describe("HabitsStats", () => {
  it("renders top-level stats labels", () => {
    const habits = [
      createMockTypedHabitWithEntries("DAILY", null, [], { id: "habit-1" }),
      createMockTypedHabitWithEntries("DAILY", null, [], { id: "habit-2" }),
    ];

    render(<HabitsStats habits={habits} />);

    expect(screen.getByText("Total active habits")).toBeInTheDocument();
    expect(screen.getByText("Completed today")).toBeInTheDocument();
    expect(screen.getByText("Weekly completion")).toBeInTheDocument();
  });

  it("renders the total active habits count", () => {
    const habits = [
      createMockTypedHabitWithEntries("DAILY", null, [], { id: "habit-1" }),
      createMockTypedHabitWithEntries("DAILY", null, [], { id: "habit-2" }),
      createMockTypedHabitWithEntries("DAILY", null, [], { id: "habit-3" }),
    ];

    render(<HabitsStats habits={habits} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders the analytics section headings", () => {
    render(<HabitsStats habits={[]} />);

    expect(screen.getByText("Weekly Activity")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("Longest Streaks")).toBeInTheDocument();
  });
});
