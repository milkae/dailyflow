import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MealSlot } from "@/app/(meals)/_components/MealSlot";
import { MealType } from "@/generated/prisma/enums";
import { MealWithRecipeName } from "@/app/(meals)/types";

describe("MealSlot", () => {
  it("should render meal type label and icon", () => {
    render(<MealSlot type={MealType.BREAKFAST} />);

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    // Icon should be present (Croissant for breakfast)
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("should render different icons for different meal types", () => {
    const { rerender } = render(<MealSlot type={MealType.BREAKFAST} />);
    expect(document.querySelector("svg")).toBeInTheDocument();

    rerender(<MealSlot type={MealType.LUNCH} />);
    expect(document.querySelector("svg")).toBeInTheDocument();

    rerender(<MealSlot type={MealType.DINNER} />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("should render meal details when meal is provided", () => {
    const meal = {
      id: "1",
      type: MealType.BREAKFAST,
      date: new Date(),
      recipeId: "recipe-1",
      userId: "user-1",
      name: "Oatmeal Bowl",
      notes: "With berries",
      recipe: { id: "recipe-1", name: "Oatmeal Recipe" },
    } as MealWithRecipeName;

    render(<MealSlot type={MealType.BREAKFAST} meal={meal} />);

    expect(screen.getByText("Oatmeal Bowl")).toBeInTheDocument();
    expect(screen.getByText("With berries")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /oatmeal recipe/i }),
    ).toBeInTheDocument();
  });

  it("should render 'Not planned' when no meal", () => {
    render(<MealSlot type={MealType.BREAKFAST} />);

    expect(screen.getByText("Not planned")).toBeInTheDocument();
  });

  it("should call onClick when clicked and meal exists", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const meal = {
      id: "1",
      type: MealType.BREAKFAST,
      date: new Date(),
      recipeId: "recipe-1",
      userId: "user-1",
      name: "Oatmeal",
    } as MealWithRecipeName;

    render(
      <MealSlot type={MealType.BREAKFAST} meal={meal} onClick={onClick} />,
    );

    const slot = screen.getByText("Oatmeal").parentElement?.parentElement;
    await user.click(slot!);

    expect(onClick).toHaveBeenCalled();
  });

  it("should have different styling when meal exists", () => {
    const meal = {
      id: "1",
      type: MealType.BREAKFAST,
      date: new Date(),
      recipeId: "recipe-1",
      userId: "user-1",
      name: "Oatmeal",
    } as MealWithRecipeName;

    const { container } = render(
      <MealSlot type={MealType.BREAKFAST} meal={meal} />,
    );

    const slot = container.firstChild as HTMLElement;
    expect(slot).toHaveClass("bg-tertiary/5", "border-tertiary/30");
  });

  it("should have dashed border when no meal", () => {
    const { container } = render(<MealSlot type={MealType.BREAKFAST} />);

    const slot = container.firstChild as HTMLElement;
    expect(slot).toHaveClass("border-dashed", "border-border/50");
  });
});
