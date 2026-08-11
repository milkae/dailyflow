import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuickStats } from "@/app/_components/QuickStats";

describe("QuickStats", () => {
  it("should render all stat cards", () => {
    const stats = {
      total: 5,
      completed: 3,
      rate: 60,
      mealsCount: 2,
    };

    render(<QuickStats stats={stats} />);

    expect(screen.getByText("Active Today")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Completion")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("should render progress bar for completion rate", () => {
    const stats = {
      total: 5,
      completed: 3,
      rate: 60,
      mealsCount: 2,
    };

    render(<QuickStats stats={stats} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.firstChild).toHaveStyle({ width: "60%" });
  });

  it("should not render progress bar when no habits", () => {
    const stats = {
      total: 0,
      completed: 0,
      rate: 0,
      mealsCount: 2,
    };

    render(<QuickStats stats={stats} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
