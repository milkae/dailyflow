import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

type NavigationItem = {
  title: string;
  href: string;
};

export const NavLink = ({
  item,
  onNavigate,
  className,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  className?: string;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      onNavigate={onNavigate}
      className={cn(
        "font-medium hover:text-primary transition-colors",
        {
          "underline text-primary": pathname === item.href,
        },
        className,
      )}
    >
      {item.title}
    </Link>
  );
};
