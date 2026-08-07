import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitCheckInCard } from "@/app/(habits)/_components/HabitCheckInCard";
import {
  createMockTypedHabitWithEntries,
  createMockEntry,
} from "@/__tests__/tests-utils";
import { Frequency } from "@/generated/prisma/enums";

// Mock server actions
const mockToggleCompletion = vi.fn();
const mockSubmitForm = vi.fn();

vi.mock("@/features/habits/actions", () => ({
  toggleHabitCompletion: mockToggleCompletion,
  submitHabitEntryForm: mockSubmitForm,
}));

describe("HabitCheckInCard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToggleCompletion.mockResolvedValue({ success: true });
    mockSubmitForm.mockResolvedValue({ success: true });
  });

  it("should display habit name and completion status", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.name = "Morning Run";

    render(<HabitCheckInCard habit={habit} />);

    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark as complete/i }),
    ).toBeInTheDocument();
  });

  it("should show completed state when habit is done today", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.entries = [createMockEntry(new Date())]; // Completed today

    render(<HabitCheckInCard habit={habit} />);

    // Check for line-through styling indicating completion
    const habitLink = screen.getByRole("link", { name: /morning run/i });
    expect(habitLink).toHaveClass("line-through", "text-muted-foreground");
    expect(
      screen.getByRole("button", { name: /mark as incomplete/i }),
    ).toBeInTheDocument();
  });

  it("should show streak counter", () => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.entries = [
      createMockEntry(today),
      createMockEntry(yesterday),
      createMockEntry(twoDaysAgo),
    ];

    render(<HabitCheckInCard habit={habit} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should toggle completion when button clicked", async () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);

    render(<HabitCheckInCard habit={habit} />);

    const completeButton = screen.getByRole("button", {
      name: /mark as complete/i,
    });
    await user.click(completeButton);

    await waitFor(() => {
      expect(mockToggleCompletion).toHaveBeenCalledWith({
        id: habit.id,
        completion: true,
      });
    });
  });

  it("should open note dialog when note button clicked", async () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.entries = [createMockEntry(new Date())]; // Completed today

    render(<HabitCheckInCard habit={habit} />);

    const noteButton = screen.getByRole("button", { name: /add note/i });
    await user.click(noteButton);

    expect(screen.getByText(`Add note to ${habit.name}`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/how did it go/i)).toBeInTheDocument();
  });

  it("should submit note form", async () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.entries = [createMockEntry(new Date())];

    render(<HabitCheckInCard habit={habit} />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /add note/i }));

    // Fill and submit form
    await user.type(
      screen.getByPlaceholderText(/how did it go/i),
      "Great workout!",
    );
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
    });
  });

  it("should show note indicator when entry has note", () => {
    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);
    habit.entries = [createMockEntry(new Date(), { note: "Good run!" })];

    render(<HabitCheckInCard habit={habit} />);

    // The message square icon should have fill when there's a note
    const noteButton = screen.getByRole("button", { name: /add note/i });
    const messageIcon = noteButton.querySelector("svg");
    expect(messageIcon).toHaveClass("fill-current");
  });

  it("should handle toggle completion errors gracefully", async () => {
    mockToggleCompletion.mockRejectedValue(new Error("Network error"));

    const habit = createMockTypedHabitWithEntries(Frequency.DAILY);

    render(<HabitCheckInCard habit={habit} />);

    const completeButton = screen.getByRole("button", {
      name: /mark as complete/i,
    });
    await user.click(completeButton);

    // Should not crash, button should still be clickable
    await waitFor(() => {
      expect(completeButton).toBeInTheDocument();
    });
  });
});
