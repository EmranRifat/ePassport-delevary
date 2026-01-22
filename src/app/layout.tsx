import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {HeroUIProvider} from '@heroui/react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bangladesh Post Office - ePassport Portal",
  description: "Bangladesh Post Office ePassport Issuing Portal",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <HeroUIProvider>
          
          {children} 
        </HeroUIProvider>
      </body>
    </html>
  );
}