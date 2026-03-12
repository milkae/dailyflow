import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";

import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

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
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <header className="flex gap-4 items-center px-4 sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-900/60">
              <Link href="/" className="text-3xl md:text-4xl font-bold py-4">
                Habit tracker
              </Link>
              <Link href="/dashboard">Dashboard</Link>
            </header>
            <main className="flex-1 p-6 md:p-8 max-w-7xl space-y-8 m-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
