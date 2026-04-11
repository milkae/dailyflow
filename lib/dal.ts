import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

export async function getUserId() {
  const h = await headers();
  return h.get("x-user-id");
}

export async function getSession() {
  const h = await headers();

  const session = await auth.api.getSession({
    headers: h,
  });

  return session;
}

export async function requireUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}

const verifySessionCached = cache(async (cookieString: string) => {
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: cookieString }),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return { isAuth: true, userId: session.user.id };
});

export const verifySession = async () => {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  return verifySessionCached(cookie);
};
