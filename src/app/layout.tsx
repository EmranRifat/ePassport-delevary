// app/layout.tsx
"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import Providers from "./providers";

  

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
         <Providers> {children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
