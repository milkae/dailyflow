import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Target } from "lucide-react";
import { StatCard } from "@/features/dashboard/components/StatCard";

describe("StatCard", () => {
  it("should render label, value, and icon", () => {
    render(<StatCard label="Active Today" value={5} icon={Target} />);

    expect(screen.getByText("Active Today")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // Icon
  });

  it("should render custom icon color", () => {
    const customColor = "bg-red-500 text-white";

    render(
      <StatCard
        label="Test"
        value={10}
        icon={Target}
        iconColor={customColor}
      />,
    );

    const iconContainer = screen.getByRole("img", {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass(...customColor.split(" "));
  });

  it("should render footer when provided", () => {
    const footer = <div data-testid="footer">Footer content</div>;

    render(<StatCard label="Test" value={10} icon={Target} footer={footer} />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should not render footer when not provided", () => {
    render(<StatCard label="Test" value={10} icon={Target} />);

    expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
  });
});
