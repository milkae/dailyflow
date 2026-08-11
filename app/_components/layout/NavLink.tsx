import Link from "next/link";
import { cn } from "@/utils/cn";

type NavigationItem = {
  title: string;
  href: string;
};

export const NavLink = ({
  item,
  pathname,
  onNavigate,
  className,
}: {
  item: NavigationItem;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) => {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onNavigate={onNavigate}
      onClick={onNavigate}
      className={cn(
        "font-medium hover:text-primary transition-colors",
        {
          "underline text-primary": isActive,
        },
        className,
      )}
    >
      {item.title}
    </Link>
  );
};
