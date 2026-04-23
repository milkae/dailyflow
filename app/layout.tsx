import "./globals.css";

import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "../components/providers/AppProviders";
import { Metadata } from "next";
import { Suspense } from "react";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const navigationData = [
  { title: "Dashboard", href: "/" },
  { title: "Habits", href: "/habits" },
  { title: "Meals", href: "/meals" },
];

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: {
    default: "DailyFlow",
    template: "%s | DailyFlow",
  },
  description:
    "DailyFlow helps you track habits, plan meals, and manage recipes in one clean productivity app.",
  keywords: [
    "DailyFlow",
    "habit tracker",
    "meal planner",
    "recipe manager",
    "productivity",
    "health",
  ],
  openGraph: {
    title: "DailyFlow",
    description:
      "DailyFlow helps you track habits, plan meals, and manage recipes in one clean productivity app.",
    type: "website",
    siteName: "DailyFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyFlow",
    description:
      "DailyFlow helps you track habits, plan meals, and manage recipes in one clean productivity app.",
  },
};

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
              <Suspense fallback={null}>
                <Navbar navigationData={navigationData} />
              </Suspense>
              <main className="flex flex-col flex-1 container py-6 md:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
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
