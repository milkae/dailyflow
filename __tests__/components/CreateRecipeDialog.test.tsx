import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateRecipeDialog } from "@/app/(recipes)/_components/CreateRecipeDialog";

const mockToastError = vi.fn();
const mockLogError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock("@/lib/logger", () => ({
  logError: (...args: unknown[]) => mockLogError(...args),
}));

vi.mock("@/app/(recipes)/_components/RecipeForm", () => ({
  RecipeForm: ({ parsedRecipe }: { parsedRecipe?: { name?: string } }) => (
    <div data-testid="recipe-form">{parsedRecipe?.name ?? "none"}</div>
  ),
}));

vi.mock("@/app/_components/ui/dialog", () => ({
  Dialog: ({
    children,
    onOpenChange,
  }: {
    children: React.ReactNode;
    onOpenChange?: (value: boolean) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onOpenChange?.(false)}>
        Close dialog
      </button>
      {children}
    </div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogTrigger: ({ render }: { render: React.ReactNode }) => <>{render}</>,
}));

vi.mock("@/app/_components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TabsTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  TabsContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("CreateRecipeDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows toast feedback when URL parsing fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    render(<CreateRecipeDialog open={true} onOpenChange={vi.fn()} />);

    await user.type(screen.getByLabelText("Recipe URL"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Could not parse this recipe URL. Please enter details manually.",
      );
    });
  });

  it("logs and toasts when parser request throws", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network down")),
    );

    render(<CreateRecipeDialog open={true} onOpenChange={vi.fn()} />);

    await user.type(screen.getByLabelText("Recipe URL"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() => {
      expect(mockLogError).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(
        "Failed to import recipe. Please try again or enter manually.",
      );
    });
  });

  it("resets URL input and parsed recipe when dialog closes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ name: "Imported Pasta" }),
      }),
    );

    render(<CreateRecipeDialog open={true} onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText("Recipe URL"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() => {
      expect(screen.getByTestId("recipe-form")).toHaveTextContent(
        "Imported Pasta",
      );
    });

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Recipe URL")).toHaveValue("");
    expect(screen.getByTestId("recipe-form")).toHaveTextContent("none");
  });
});
