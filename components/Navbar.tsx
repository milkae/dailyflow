import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitForm } from "./HabitForm";

type NavigationItem = {
  title: string;
  href: string;
}[];

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          {navigationData.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="hover:text-primary max-md:hidden"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <HabitForm />
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
