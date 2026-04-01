import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import { verifySession } from "@/lib/dal";

type NavigationItem = {
  title: string;
  href: string;
};

export const Navbar = async ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  const session = await verifySession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <DesktopNav
          navigationData={navigationData}
          isLoggedIn={session.isAuth}
        />
        <MobileNav
          navigationData={navigationData}
          isLoggedIn={session.isAuth}
        />
      </div>
    </header>
  );
};
