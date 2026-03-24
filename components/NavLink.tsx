"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavigationItem = {
  title: string;
  href: string;
};

export const NavLink = ({
  item,
  mdHidden,
}: {
  item: NavigationItem;
  mdHidden?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      className={cn("hover:text-primary hover:underline", {
        "underline text-primary": pathname === item.href,
        "max-md:hidden": mdHidden,
      })}
    >
      {item.title}
    </Link>
  );
};
