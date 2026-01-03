import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Providers from "./providers";
import NavbarFooterWrapper from "@/components/layout/navbarfooterwrapper";


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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavbarFooterWrapper>{children}</NavbarFooterWrapper>
          {/* <main>{children}</main> */}
        </Providers>
      </body>
    </html>
  );
}