import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavLink } from "@/app/_components/layout/NavLink";

describe("NavLink", () => {
  it("should render link with correct href and text", async () => {
    const item = { title: "Dashboard", href: "/" };

    render(<NavLink item={item} pathname="" />);

    // Initially renders as basic link
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /dashboard/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/");
    });
  });

  it("should apply active styling when on current page", async () => {
    const item = { title: "Dashboard", href: "/" };

    render(<NavLink item={item} pathname="/" />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /dashboard/i });
      expect(link).toHaveClass("underline", "text-primary");
    });
  });

  it("should not apply active styling when not on current page", async () => {
    const item = { title: "Dashboard", href: "/" };

    render(<NavLink item={item} pathname="/habits" />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /dashboard/i });
      expect(link).not.toHaveClass("underline", "text-primary");
    });
  });

  it("should call onNavigate when provided", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const item = { title: "Dashboard", href: "/" };

    render(<NavLink item={item} onNavigate={onNavigate} pathname="/" />);

    const link = screen.getByRole("link", { name: /dashboard/i });
    await user.click(link);

    expect(onNavigate).toHaveBeenCalled();
  });

  it("should apply custom className", async () => {
    const item = { title: "Dashboard", href: "/" };
    const className = "custom-class";

    render(<NavLink item={item} className={className} pathname="" />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /dashboard/i });
      expect(link).toHaveClass("custom-class");
    });
  });
});
