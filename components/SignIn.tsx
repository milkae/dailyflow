import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button variant="outline">
        <LogIn />
        <span className="flex flex-1 justify-center">Signin with Google</span>
      </Button>
    </form>
  );
}
