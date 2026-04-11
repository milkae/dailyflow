import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { SignIn } from "./sign-in";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <Heading className="text-center">Log In</Heading>
      <SignIn />
    </Card>
  );
}
