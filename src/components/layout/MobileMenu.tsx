"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

export function MobileMenu({ open, onClose, links }: Props) {
  const tc = useTranslations("common");

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold text-secondary">
            Happy<span className="text-primary">Salary</span>
          </span>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block px-4 py-3 text-base font-medium text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="ml-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-primary rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4">
          <Button href="/pricing" className="w-full" onClick={onClose}>
            {tc("getStarted")}
          </Button>
        </div>
      </div>
    </>
  );
}
