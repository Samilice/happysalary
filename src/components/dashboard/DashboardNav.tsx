"use client";

import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

type Props = {
  userName: string;
  userRole: string;
};

export function DashboardNav({ userName, userRole }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Aperçu", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/dashboard/employees", label: "Employés", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { href: "/dashboard/documents", label: "Documents", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
    { href: "/dashboard/settings", label: "Paramètres", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/fr";
  }

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-secondary">Happy</span>
            <span className="font-bold text-primary">Salary</span>
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

          {/* User */}
          <div className="flex items-center gap-3">
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
