import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakLeaderboard } from "@/app/(habits)/_components/StreakLeaderBoard";
import {
  createMockEntry,
  createMockTypedHabitWithEntries,
} from "@/__tests__/tests-utils";

vi.mock("@/utils/habits", async () => {
  const actual =
    await vi.importActual<typeof import("@/utils/habits")>("@/utils/habits");

  return {
    ...actual,
    calculateStreak: (habit: { entries: { id: string }[] }) =>
      habit.entries.length,
  };
});

describe("StreakLeaderboard", () => {
  it("renders an empty state when there are no habits", () => {
    render(<StreakLeaderboard habits={[]} />);

    expect(screen.getByText("No habits yet")).toBeInTheDocument();
  });

  it("renders singular day copy for a one-day streak", () => {
    const habit = createMockTypedHabitWithEntries("DAILY", null, [
      createMockEntry(new Date("2024-04-15"), { id: "entry-1" }),
    ]);

    render(<StreakLeaderboard habits={[habit]} />);

    const link = screen.getByRole("link", { name: /morning run/i });

    expect(link).toHaveTextContent("day");
    expect(link).not.toHaveTextContent("days");
  });

  it("renders top streak links ordered by streak length", () => {
    const habits = [
      createMockTypedHabitWithEntries(
        "DAILY",
        null,
        [createMockEntry(new Date("2024-04-15"), { id: "entry-1" })],
        { id: "habit-1", name: "Read" },
      ),
      createMockTypedHabitWithEntries(
        "DAILY",
        null,
        [
          createMockEntry(new Date("2024-04-15"), { id: "entry-2" }),
          createMockEntry(new Date("2024-04-14"), { id: "entry-3" }),
          createMockEntry(new Date("2024-04-13"), { id: "entry-4" }),
        ],
        { id: "habit-2", name: "Run" },
      ),
    ];

    render(<StreakLeaderboard habits={habits} />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/habits/habit-2");
    expect(links[1]).toHaveAttribute("href", "/habits/habit-1");
  });
});
