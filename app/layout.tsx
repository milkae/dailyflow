import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const navigationData = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Habit Dashboard",
    href: "/habits/dashboard",
  },
  {
    title: "Meal plan",
    href: "/meal/week-plan",
  },
  {
    title: "Recipes",
    href: "/meal/recipes",
  },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar navigationData={navigationData} />
            <main className="flex-1 p-6 md:p-8 max-w-7xl space-y-8 m-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
