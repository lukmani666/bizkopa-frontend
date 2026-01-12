import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Providers from "./providers";
import { ThemeSync } from "@/components/theme-sync";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Bizkopa',
  description: 'Smart business and staff management'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              try {
                const storedTheme = localStorage.getItem('bizkopa-theme');
                const theme = storedTheme ? JSON.parse(storedTheme)?.state?.theme : 'system';

                const root = document.documentElement;
                root.classList.remove('light', 'dark');

                if (theme === 'system') {
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  root.classList.add(isDark ? 'dark' : 'light');
                } else {
                  root.classList.add(theme);
                }
              } catch (_) {}
            })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* <NavbarFooterWrapper>{children}</NavbarFooterWrapper> */}
          <main>
            <ThemeSync />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}