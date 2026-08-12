import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToMealPlanDialog } from "@/app/(meals)/_components/AddToMealPlanDialog";
import { createMockRecipe } from "@/__tests__/tests-utils";

const mockAddRecipeToMealPlan = vi.fn();
const mockToastSuccess = vi.fn();

vi.mock("@/app/(meals)/actions", () => ({
  addRecipeToMealPlan: (...args: unknown[]) => mockAddRecipeToMealPlan(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

vi.mock("@/app/_components/ui/dialog", () => ({
  Dialog: ({
    children,
    onOpenChange,
  }: {
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onOpenChange?.(true)}>
        Mock Open Dialog
      </button>
      <button type="button" onClick={() => onOpenChange?.(false)}>
        Mock Close Dialog
      </button>
      {children}
    </div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

vi.mock("@/app/_components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectTrigger: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id?: string;
  }) => (
    <button type="button" id={id}>
      {children}
    </button>
  ),
  SelectValue: () => <span>Dinner</span>,
}));

describe("AddToMealPlanDialog", () => {
  const recipe = createMockRecipe({
    id: "recipe-1",
    name: "Pesto Pasta",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  it("associates the Meal label with its control", () => {
    render(
      <AddToMealPlanDialog
        recipe={recipe}
        open={true}
        onOpenChangeAction={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Meal")).toBeInTheDocument();
  });

  it("renders server errors as an accessible alert", async () => {
    const user = userEvent.setup();
    mockAddRecipeToMealPlan.mockResolvedValue({
      success: false,
      error: "Recipe not found.",
    });

    render(
      <AddToMealPlanDialog
        recipe={recipe}
        open={true}
        onOpenChangeAction={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add to plan/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Recipe not found.",
    );
  });

  it("calls close callback after successful submit", async () => {
    const user = userEvent.setup();
    const onOpenChangeAction = vi.fn();
    mockAddRecipeToMealPlan.mockResolvedValue({
      success: true,
    });

    render(
      <AddToMealPlanDialog
        recipe={recipe}
        open={true}
        onOpenChangeAction={onOpenChangeAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add to plan/i }));

    await waitFor(() => {
      expect(onOpenChangeAction).toHaveBeenCalledWith(false);
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Added Pesto Pasta to your meal plan.",
    );
  });

  it("clears visible errors when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChangeAction = vi.fn();
    mockAddRecipeToMealPlan.mockResolvedValue({
      success: false,
      error: "Recipe not found.",
    });

    render(
      <AddToMealPlanDialog
        recipe={recipe}
        open={true}
        onOpenChangeAction={onOpenChangeAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add to plan/i }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onOpenChangeAction).toHaveBeenCalledWith(false);
  });

  it("resets date and notes when dialog is opened", async () => {
    const user = userEvent.setup();

    render(
      <AddToMealPlanDialog
        recipe={recipe}
        open={true}
        onOpenChangeAction={vi.fn()}
      />,
    );

    const dateInput = screen.getByLabelText("Date") as HTMLInputElement;
    const notesInput = screen.getByLabelText("Notes (optional)");

    await user.clear(dateInput);
    await user.type(dateInput, "2024-01-15");
    await user.type(notesInput, "Prep ingredients tonight");

    expect(dateInput).toHaveValue("2024-01-15");
    expect(notesInput).toHaveValue("Prep ingredients tonight");

    await user.click(screen.getByRole("button", { name: "Mock Open Dialog" }));

    expect(dateInput).toHaveValue(getToday());
    expect(notesInput).toHaveValue("");
  });
});
