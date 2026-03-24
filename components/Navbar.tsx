import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SignIn from "./SignIn";
import { auth } from "@/auth";
import LogOut from "./LogOut";
import { NavLink } from "./NavLink";

type NavigationItem = {
  title: string;
  href: string;
}[];

const Navbar = async ({
  navigationData,
}: {
  navigationData: NavigationItem;
}) => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 p-4 sm:py-7 sm:px-6">
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          {navigationData.map((item, index) => (
            <NavLink key={index} item={item} mdHidden />
          ))}
        </div>
        <div className="max-md:hidden">
          {session?.user ? <LogOut /> : <SignIn />}
        </div>
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="outline" size="icon">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
            />
            <SheetContent className="w-56">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 p-4">
                {navigationData.map((item, index) => (
                  <NavLink key={index} item={item} />
                ))}
              </nav>
              <div className="mt-auto mb-6 flex justify-center">
                {session?.user ? <LogOut /> : <SignIn />}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
