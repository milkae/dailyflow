import { auth } from "@/auth";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

type NavigationItem = {
  title: string;
  href: string;
};

export const Navbar = async ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 p-4 sm:py-7 sm:px-6">
        <DesktopNav
          navigationData={navigationData}
          isLoggedIn={!!session?.user}
        />
        <MobileNav
          navigationData={navigationData}
          isLoggedIn={!!session?.user}
        />
      </div>
    </header>
  );
};
