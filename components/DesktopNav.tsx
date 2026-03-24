"use client";

import { signIn, signOut } from "next-auth/react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { LogIn, LogOutIcon } from "lucide-react";

type NavigationItem = {
  title: string;
  href: string;
};

export const DesktopNav = ({
  navigationData,
  isLoggedIn,
}: {
  navigationData: NavigationItem[];
  isLoggedIn: boolean;
}) => {
  return (
    <>
      <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
        {navigationData.map((item, index) => (
          <NavLink key={index} item={item} mdHidden />
        ))}
      </div>
      <div className="max-md:hidden">
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
    </>
  );
};
