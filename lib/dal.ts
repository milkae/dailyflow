import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return { isAuth: true, userId: session.user.id };
});
