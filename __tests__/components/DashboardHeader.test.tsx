import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { getByNestedText } from "@/__tests__/tests-utils";

describe("DashboardHeader", () => {
  it("should render stats correctly", () => {
    const today = new Date();
    const title = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const stats = {
      total: 5,
      completed: 4,
      rate: 80,
      mealsCount: 3,
    };

    render(<DashboardHeader stats={stats} />);
    expect(screen.getByRole("heading")).toHaveTextContent(title);
    expect(
      screen.getByText(
        getByNestedText(
          `${stats.completed} of ${stats.total} habits completed`,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getByNestedText(`${stats.mealsCount} meals scheduled for today`),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Start your day by creating habits and planning meals",
      ),
    ).not.toBeInTheDocument();
  });

  it("should render meals stats only if no habits", () => {
    const stats = {
      total: 0,
      completed: 0,
      rate: 0,
      mealsCount: 3,
    };

    render(<DashboardHeader stats={stats} />);
    expect(screen.queryByText(`habits completed`, { exact: false })).toBeNull();
    expect(
      screen.getByText(
        getByNestedText(`${stats.mealsCount} meals scheduled for today`),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Start your day by creating habits and planning meals",
      ),
    ).not.toBeInTheDocument();
  });

  it("should render habits stats only if no meals", () => {
    const stats = {
      total: 4,
      completed: 5,
      rate: 80,
      mealsCount: 0,
    };

    render(<DashboardHeader stats={stats} />);
    expect(
      screen.getByText(
        getByNestedText(
          `${stats.completed} of ${stats.total} habits completed`,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`meals scheduled for today`, { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Start your day by creating habits and planning meals",
      ),
    ).not.toBeInTheDocument();
  });

  it("should render habits stats only if no meals", () => {
    const stats = {
      total: 0,
      completed: 0,
      rate: 0,
      mealsCount: 0,
    };

    render(<DashboardHeader stats={stats} />);
    expect(
      screen.getByText("Start your day by creating habits and planning meals"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`habits completed`, { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`meals scheduled for today`, { exact: false }),
    ).not.toBeInTheDocument();
  });
});
