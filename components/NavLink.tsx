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
  onNavigate,
}: {
  item: NavigationItem;
  mdHidden?: boolean;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      onNavigate={onNavigate}
      className={cn("hover:text-primary hover:underline", {
        "underline text-primary": pathname === item.href,
        "max-md:hidden": mdHidden,
      })}
    >
      {item.title}
    </Link>
  );
};
