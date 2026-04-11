"use client";

import { authClient } from "@/lib/auth.client";
import { Button } from "../ui/button";
import { LogIn, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "../ui/buttonVariants";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const AuthButton = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return <div className="w-20 h-10 animate-pulse bg-muted rounded" />;
  }

  return (
    <>
      {session?.user?.id ? (
        <Button
          variant="outline"
          onClick={async () => {
            setLoading(true);
            await authClient.signOut({
              fetchOptions: {
                onError: () => {
                  setLoading(false);
                },
              },
            });
            router.refresh();
          }}
          disabled={loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <LogOutIcon />
              <span className="flex flex-1 justify-center">Log out</span>
            </>
          )}
        </Button>
      ) : (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          <LogIn />
          <span className="flex flex-1 justify-center">Sign In</span>
        </Link>
      )}
    </>
  );
};
