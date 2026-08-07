"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { AuthButton } from "@/app/_components/shared/AuthButton";

type NavigationItem = {
  title: string;
  href: string;
};

export const DesktopNav = ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:flex items-center gap-6">
        {navigationData.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            className="text-sm text-muted-foreground"
          />
        ))}
      </nav>
      <div className="max-md:hidden flex gap-2 items-center ml-auto">
        <AuthButton />
      </div>
    </>
  );
};
