"use client";

import { LogIn, LogOutIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signIn, signOut } from "next-auth/react";
import { NavLink } from "./NavLink";
import { useState } from "react";

type NavigationItem = {
  title: string;
  href: string;
};

export const MobileNav = ({
  navigationData,
  isLoggedIn,
}: {
  navigationData: NavigationItem[];
  isLoggedIn?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden"
        render={
          <Button variant="outline" size="icon">
            <MenuIcon />
            <span className="sr-only">Menu</span>
          </Button>
        }
      />
      <SheetContent className="w-56">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 p-4">
          {navigationData.map((item, index) => (
            <NavLink
              key={index}
              item={item}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto mb-6 flex justify-center">
          {isLoggedIn ? (
            <Button variant="outline" onClick={() => signOut()}>
              <LogOutIcon />
              <span className="flex flex-1 justify-center">Log out</span>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => signIn()}>
              <LogIn />
              <span className="flex flex-1 justify-center">Sign In</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
