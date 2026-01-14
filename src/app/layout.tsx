import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext } from "react";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bangladesh Post Office - ePassport Portal",
  description: "Bangladesh Post Office ePassport Issuing Portal",
};

export const ThemeContext = createContext({})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
    </html>
  );
}
