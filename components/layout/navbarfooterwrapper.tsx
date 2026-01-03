'use client';

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NavbarFooterWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname?.startsWith("/auth");

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
