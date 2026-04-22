import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { Frequency } from "@/generated/prisma/enums";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

// Mock the server action
const mockCreateOrUpdateHabit = vi.fn();
vi.mock("@/features/habits/actions", () => ({
  createOrUpdateHabit: () => mockCreateOrUpdateHabit(),
}));

describe("HabitForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateOrUpdateHabit.mockResolvedValue({
      status: "success",
      formErrors: [],
      fieldErrors: {},
    });
  });

  it("should render create form with default values", () => {
    render(<HabitForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create habit/i }),
    ).toBeInTheDocument();
  });

  it("should render edit form with existing habit data", () => {
    const existingHabit = createMockTypedHabitWithEntries(Frequency.DAILY);
    existingHabit.name = "Test Habit";
    existingHabit.description = "Test Description";

    render(<HabitForm habit={existingHabit} />);

    expect(screen.getByDisplayValue("Test Habit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update habit/i }),
    ).toBeInTheDocument();
  });

  it("should submit form with valid daily habit data", async () => {
    render(<HabitForm />);

    await user.type(screen.getByLabelText(/name/i), "Morning Run");
    await user.type(screen.getByLabelText(/description/i), "5km run");
    await user.click(screen.getByRole("button", { name: /create habit/i }));

    await waitFor(() => {
      expect(mockCreateOrUpdateHabit).toHaveBeenCalledWith(
        null,
        expect.any(FormData),
      );
    });

    const formData = mockCreateOrUpdateHabit.mock.calls[0][1];
    expect(formData.get("name")).toBe("Morning Run");
    expect(formData.get("description")).toBe("5km run");
    expect(formData.get("frequency")).toBe("DAILY");
  });

  it("should show frequency-specific fields for weekly habits", async () => {
    render(<HabitForm />);

    const frequencySelect = screen.getByLabelText(/frequency/i);
    await user.click(frequencySelect);
    await user.click(screen.getByText("Weekly"));

    expect(screen.getByText("Select day of week")).toBeInTheDocument();
  });

  it("should show frequency-specific fields for monthly habits", async () => {
    render(<HabitForm />);

    const frequencySelect = screen.getByLabelText(/frequency/i);
    await user.click(frequencySelect);
    await user.click(screen.getByText("Monthly"));

    expect(screen.getByText("Select day of month")).toBeInTheDocument();
  });

  it("should show frequency-specific fields for specific days", async () => {
    render(<HabitForm />);

    const frequencySelect = screen.getByLabelText(/frequency/i);
    await user.click(frequencySelect);
    await user.click(screen.getByText("Specific Days"));

    expect(screen.getByText("Select days of week")).toBeInTheDocument();
    expect(screen.getByLabelText("Monday")).toBeInTheDocument();
    expect(screen.getByLabelText("Friday")).toBeInTheDocument();
  });

  it("should show frequency-specific fields for interval habits", async () => {
    render(<HabitForm />);

    const frequencySelect = screen.getByLabelText(/frequency/i);
    await user.click(frequencySelect);
    await user.click(screen.getByText("Interval"));

    expect(screen.getByText("Every X days")).toBeInTheDocument();
  });

  it("should display validation errors", async () => {
    mockCreateOrUpdateHabit.mockResolvedValue({
      status: "error",
      formErrors: ["Validation failed"],
      fieldErrors: { name: ["Name is required"] },
    });

    render(<HabitForm />);

    await user.click(screen.getByRole("button", { name: /create habit/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });
});
