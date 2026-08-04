import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import { ModeToggle } from "./mode-toggle";

type NavigationItem = {
  title: string;
  href: string;
};

export const Navbar = ({
  navigationData,
}: {
  navigationData: NavigationItem[];
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container flex h-16 items-center justify-between mx-auto px-2 gap-2">
        <DesktopNav navigationData={navigationData} />
        <MobileNav navigationData={navigationData} />
        <ModeToggle />
      </div>
    </header>
  );
};
