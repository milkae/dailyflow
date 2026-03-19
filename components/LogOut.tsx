import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="outline">
        <LogOutIcon />
        <span className="flex flex-1 justify-center">Log out</span>
      </Button>
    </form>
  );
}
