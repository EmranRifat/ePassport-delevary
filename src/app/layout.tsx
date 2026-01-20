// app/layout.tsx
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
