import "./globals.css";

import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "../components/providers/AppProviders";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const navigationData = [
  { title: "Dashboard", href: "/" },
  { title: "Habits", href: "/habits" },
  { title: "Meals", href: "/meals" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} font-sans antialiased`}
    >
      <body>
        <Providers>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar navigationData={navigationData} />
              <main className="flex-1 w-full">
                <div className="container py-6 md:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer className="border-t border-border bg-card mt-auto">
                <div className="container py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-muted-foreground">
                    Built with Next.js, Prisma, and Tailwind CSS
                  </p>
                </div>
              </footer>
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
