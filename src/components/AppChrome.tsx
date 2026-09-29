"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isTutorialRoute = pathname?.startsWith("/tutorials");
  const isTutorialLanding = pathname === "/tutorials" || pathname === "/tutorials/";
  const isTutorialDetail = isTutorialRoute && (pathname?.split("/").filter(Boolean).length ?? 0) >= 2;
  const hideFooter = isDashboard || isTutorialLanding || isTutorialDetail;
  const hideNavbar = isDashboard || isTutorialRoute;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
