"use client";

import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";

type Props = {
  userName: string;
  userRole: string;
};

export function DashboardNav({ userName, userRole }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Aperçu" },
    { href: "/dashboard/checklist", label: "Démarches" },
    { href: "/dashboard/employees", label: "Employés" },
    { href: "/dashboard/payslip", label: "Fiche de salaire" },
    { href: "/dashboard/contracts", label: "Contrats" },
    { href: "/dashboard/documents", label: "Documents" },
    { href: "/dashboard/settings", label: "Paramètres" },
  ];

  const locale = pathname.split("/")[1] || "fr";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  }

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="HappySalary"
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-sm sm:text-base font-bold text-secondary">Happy<span className="text-primary">Salary</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname.endsWith(link.href) || (link.href !== "/dashboard" && pathname.includes(link.href));
              return (
                <Link key={link.href} href={link.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text hover:bg-background-alt"}`}>
                  {link.label}
                </Link>
              );
            })}
            {userRole === "admin" && (
              <Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* User + Locale */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <span className="text-sm text-text-muted hidden sm:block">{userName}</span>
            <button onClick={handleLogout} className="text-xs text-text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border hover:bg-background-alt transition-colors">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {links.map((link) => {
            const isActive = pathname.endsWith(link.href) || (link.href !== "/dashboard" && pathname.includes(link.href));
            return (
              <Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-text-muted"}`}>
                {link.label}
              </Link>
            );
          })}
          {userRole === "admin" && (
            <Link href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 whitespace-nowrap">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
