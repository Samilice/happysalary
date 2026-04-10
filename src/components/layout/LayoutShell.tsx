"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

const DASHBOARD_PATHS = ["/dashboard", "/admin", "/onboarding"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Strip locale prefix (e.g. /fr/dashboard → /dashboard)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  const isDashboardArea = DASHBOARD_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isDashboardArea) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
