"use client";

import { NavLink } from "./NavLink";
import { AuthButton } from "@/components/shared/AuthButton";

type NavigationItem = {
  title: string;
  href: string;
};

export const DesktopNav = ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  return (
    <>
      <nav className="hidden md:flex items-center gap-6">
        {navigationData.map((item, index) => (
          <NavLink
            key={index}
            item={item}
            className="text-sm text-muted-foreground"
          />
        ))}
      </nav>
      <div className="max-md:hidden">
        <AuthButton />
      </div>
    </>
  );
};
