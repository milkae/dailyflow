import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitOverviewCard } from "@/app/(habits)/_components/HabitOverviewCard";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";
import { Frequency } from "@/generated/prisma/enums";

vi.mock("@/app/(habits)/_components/DeleteHabitButton", () => ({
  DeleteHabitButton: () => <button aria-label="Delete">Delete</button>,
}));

describe("HabitOverviewCard", () => {
  it("should render habit name and link", () => {
    const habit = createMockTypedHabitWithEntries();

    render(<HabitOverviewCard habit={habit} />);

    const link = screen.getByRole("link", { name: /morning run/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/habits/${habit.id}`);
  });

  it("should render habit description when provided", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [], {
      description: "A healthy morning routine",
    });

    render(<HabitOverviewCard habit={habit} />);

    expect(screen.getByText("A healthy morning routine")).toBeInTheDocument();
  });

  it("should not render description when not provided", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, [], {
      description: null,
    });

    render(<HabitOverviewCard habit={habit} />);

    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it("should render streak badge when streak > 0", () => {
    const entries = [
      { id: "1", habitId: "habit-1", date: new Date(), note: null },
      {
        id: "2",
        habitId: "habit-1",
        date: new Date(Date.now() - 86400000),
        note: null,
      }, // Yesterday
    ];
    const habit = createMockTypedHabitWithEntries(
      Frequency.DAILY,
      null,
      entries,
    );

    render(<HabitOverviewCard habit={habit} />);

    expect(screen.getByText("2")).toBeInTheDocument(); // Streak of 2
  });

  it("should not render streak badge when streak is 0", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY, null, []);

    render(<HabitOverviewCard habit={habit} />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("should render frequency and entry count", () => {
    const entries = [
      { id: "1", habitId: "habit-1", date: new Date(), note: null },
    ];
    const habit = createMockTypedHabitWithEntries(
      Frequency.DAILY,
      null,
      entries,
    );

    render(<HabitOverviewCard habit={habit} />);

    expect(screen.getByText("DAILY")).toBeInTheDocument();
    expect(screen.getByText("1 entries")).toBeInTheDocument();
  });

  it("should render action buttons on hover", () => {
    const habit = createMockTypedHabitWithEntries();

    render(<HabitOverviewCard habit={habit} />);

    // Buttons should be present but initially hidden (opacity-0)
    const editButton = screen.getByRole("button", { name: /edit/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
