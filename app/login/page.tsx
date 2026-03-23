import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <Heading className="text-center">Log In</Heading>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </form>
    </Card>
  );
}
