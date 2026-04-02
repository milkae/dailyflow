"use client";

import { authClient } from "@/lib/auth.client";
import { Button } from "./ui/button";
import { LogIn, LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

export const AuthButton = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="w-20 h-10 animate-pulse bg-muted rounded" />;
  }

  return (
    <>
      {session?.user.id ? (
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
    </>
  );
};
