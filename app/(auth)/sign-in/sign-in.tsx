"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth.client";
import { useState } from "react";

export const SignIn = () => {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        setIsPending(true);
        authClient.signIn.social({
          provider: "google",
          fetchOptions: {
            onError: () => {
              setIsPending(false);
            },
          },
        });
      }}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : "Continue with Google"}
    </Button>
  );
};
