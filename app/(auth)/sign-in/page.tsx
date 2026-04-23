import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { SignIn } from "./sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your DailyFlow account to access habits, meals, and recipes.",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md p-8 space-y-6 m-auto">
      <Heading className="text-center">Log In</Heading>
      <SignIn />
    </Card>
  );
}
