// app/layout.tsx

import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google"; // <-- Google Font import

// Define the font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bangladesh Post Office - ePassport Portal",
  description: "Bangladesh Post Office ePassport Issuing Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
