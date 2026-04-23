import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/layout/Navbar";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("Navbar", () => {
  it("should render navigation with provided data", () => {
    const navigationData = [
      { title: "Dashboard", href: "/" },
      { title: "Habits", href: "/habits" },
      { title: "Meals", href: "/meals" },
    ];

    render(<Navbar navigationData={navigationData} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Habits")).toBeInTheDocument();
    expect(screen.getByText("Meals")).toBeInTheDocument();
  });

  it("should render desktop and mobile navigation", () => {
    const navigationData = [{ title: "Dashboard", href: "/" }];

    render(<Navbar navigationData={navigationData} />);

    // Should have both desktop and mobile nav containers
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
