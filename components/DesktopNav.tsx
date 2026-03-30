"use client";

import { authClient } from "@/lib/auth.client";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { LogIn, LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

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
      <nav className="hidden md:flex items-center gap-6">
        {navigationData.map((item, index) => (
          <NavLink
            key={index}
            item={item}
            className="text-sm text-muted-foreground"
          />
        ))}
      </nav>
      <div className="max-md:hidden">
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
    </>
  );
};
