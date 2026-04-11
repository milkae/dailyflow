"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth.client";

export const SignIn = () => (
  <Button
    variant="outline"
    className="w-full"
    onClick={() => authClient.signIn.social({ provider: "google" })}
  >
    Continue with Google
  </Button>
);
