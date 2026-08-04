"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "./NavLink";
import { useState } from "react";
import { AuthButton } from "@/components/shared/AuthButton";
import { usePathname } from "next/navigation";

type NavigationItem = {
  title: string;
  href: string;
};

export const MobileNav = ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          }
        />
        <SheetContent side="right" className="w-75 sm:w-100">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 pl-4">
            {navigationData.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onNavigate={() => setOpen(false)}
                pathname={pathname}
                className="text-lg"
              />
            ))}
          </nav>
          <div className="mt-auto mb-6 flex justify-center">
            <AuthButton />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
