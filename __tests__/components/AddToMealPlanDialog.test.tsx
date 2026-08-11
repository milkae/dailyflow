import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToMealPlanDialog } from "@/app/(meals)/_components/AddToMealPlanDialog";
import { createMockRecipe } from "@/__tests__/tests-utils";

const mockAddRecipeToMealPlan = vi.fn();

vi.mock("@/app/(meals)/actions", () => ({
  addRecipeToMealPlan: (...args: unknown[]) => mockAddRecipeToMealPlan(...args),
}));

vi.mock("@/app/_components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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
});
