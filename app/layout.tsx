import "./globals.css";

import { Josefin_Sans } from "next/font/google";

const josefin_sans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-josefin-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefin_sans.variable} font-sans antialiased bg-indigo-950 text-slate-300`}
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
