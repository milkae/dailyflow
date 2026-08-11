import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitTimeline } from "@/app/(habits)/_components/HabitTimeline";
import {
  createMockEntry,
  createMockTypedHabitWithEntries,
} from "@/__tests__/tests-utils";

describe("HabitTimeline", () => {
  it("renders an empty state when there are no entries", () => {
    render(<HabitTimeline habit={createMockTypedHabitWithEntries()} />);

    expect(
      screen.getByText("No entries yet. Start tracking this habit!"),
    ).toBeInTheDocument();
  });

  it("renders entries in reverse chronological order within the timeline", () => {
    const habit = createMockTypedHabitWithEntries("DAILY", null, [
      createMockEntry(new Date("2024-04-01T00:00:00.000Z"), {
        id: "entry-1",
      }),
      createMockEntry(new Date("2024-05-10T00:00:00.000Z"), {
        id: "entry-2",
        note: "Recent note",
      }),
      createMockEntry(new Date("2024-04-15T00:00:00.000Z"), {
        id: "entry-3",
      }),
    ]);

    render(<HabitTimeline habit={habit} />);

    const headings = screen.getAllByRole("heading", { level: 4 });
    expect(headings[0]).toHaveTextContent("May 2024");
    expect(headings[1]).toHaveTextContent("April 2024");

    const dateLabels = screen.getAllByText(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),/i,
    );
    expect(dateLabels[0]).toHaveTextContent("Friday, May 10");
    expect(dateLabels[1]).toHaveTextContent("Monday, Apr 15");
    expect(dateLabels[2]).toHaveTextContent("Monday, Apr 1");
  });
});
