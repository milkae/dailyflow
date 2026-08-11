import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitForm } from "@/app/(habits)/_components/HabitForm";
import { Frequency } from "@/generated/prisma/enums";
import { createMockTypedHabitWithEntries } from "@/__tests__/tests-utils";

// Mock the server action
const mockCreateOrUpdateHabit = vi.fn();
vi.mock("@/app/(habits)/actions", () => ({
  createOrUpdateHabit: (...args: unknown[]) => mockCreateOrUpdateHabit(...args),
}));

describe("HabitForm", () => {
  const user = userEvent.setup();

  const openHabitForm = async () => {
    render(<HabitForm />);

    await user.click(screen.getByRole("button", { name: /create new habit/i }));

    await screen.findByPlaceholderText("Habit name");
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateOrUpdateHabit.mockResolvedValue({
      status: "success",
      formErrors: [],
      fieldErrors: {},
    });
  });

  // TODO: Fix dialog testing - content is rendered in portal
  it.skip("should render create form with default values", async () => {
    render(<HabitForm />);

    // Open the dialog
    const triggerButton = screen.getByRole("button", {
      name: /create new habit/i,
    });
    fireEvent.click(triggerButton);

    // Wait for dialog content to appear
    await waitFor(() => {
      expect(screen.getByText("Create a new Habit")).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create habit/i }),
    ).toBeInTheDocument();
  });

  it.skip("should render edit form with existing habit data", async () => {
    const existingHabit = createMockTypedHabitWithEntries(Frequency.DAILY);
    existingHabit.name = "Test Habit";
    existingHabit.description = "Test Description";

    render(<HabitForm habit={existingHabit} />);

    // For edit forms without custom trigger, it still shows "Create new Habit" button
    const triggerButton = screen.getByRole("button", {
      name: /create new habit/i,
    });
    fireEvent.click(triggerButton);

    // Wait for dialog content to appear
    await waitFor(() => {
      expect(screen.getByText("Edit habit")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Test Habit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update habit/i }),
    ).toBeInTheDocument();
  });

  it("should submit form with valid daily habit data", async () => {
    await openHabitForm();

    await user.type(screen.getByPlaceholderText("Habit name"), "Morning Run");
    await user.type(
      screen.getByPlaceholderText("Habit description"),
      "5km run",
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));

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
    await openHabitForm();

    const frequencySelect = screen.getByRole("combobox");
    await user.click(frequencySelect);
    await user.click(screen.getByText("Weekly"));

    expect(screen.getByText("Day of week")).toBeInTheDocument();
  });

  it("should show frequency-specific fields for monthly habits", async () => {
    await openHabitForm();

    const frequencySelect = screen.getByRole("combobox");
    await user.click(frequencySelect);
    await user.click(screen.getByText("Monthly"));

    expect(screen.getByText("Day of the month")).toBeInTheDocument();
  });

  it("should show frequency-specific fields for specific days", async () => {
    await openHabitForm();

    const frequencySelect = screen.getByRole("combobox");
    await user.click(frequencySelect);
    await user.click(screen.getByText(/specific/i));

    expect(screen.getByText("Select days")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Mon" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Fri" })).toBeInTheDocument();
  });

  it("should show frequency-specific fields for interval habits", async () => {
    await openHabitForm();

    const frequencySelect = screen.getByRole("combobox");
    await user.click(frequencySelect);
    await user.click(screen.getByText("Interval"));

    expect(screen.getByText("Repeat every (days)")).toBeInTheDocument();
  });

  it("should display validation errors", async () => {
    mockCreateOrUpdateHabit.mockResolvedValue({
      status: "error",
      formErrors: ["Validation failed"],
      fieldErrors: { name: ["Name is required"] },
    });

    await openHabitForm();

    await user.type(screen.getByPlaceholderText("Habit name"), "Morning Run");

    await user.click(screen.getByRole("button", { name: /^add$/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });
});
