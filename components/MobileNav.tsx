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
import { NavLink } from "./NavLink";
import { useState } from "react";
import { authClient } from "@/lib/auth.client";
import { redirect } from "next/navigation";

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
          {navigationData.map((item, index) => (
            <NavLink
              key={index}
              item={item}
              onNavigate={() => setOpen(false)}
              className="text-lg"
            />
          ))}
        </nav>
        <div className="mt-auto mb-6 flex justify-center">
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={async () =>
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      redirect("/");
                    },
                  },
                })
              }
            >
              <LogOutIcon />
              <span className="flex flex-1 justify-center">Log out</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={async () =>
                await authClient.signIn.social({ provider: "google" })
              }
            >
              <LogIn />
              <span className="flex flex-1 justify-center">Sign In</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
