"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    {
      label: t("services"),
      href: "/services/cleaning-lady",
      children: [
        { label: t("cleaningLady"), href: "/services/cleaning-lady" },
        { label: t("nanny"), href: "/services/nanny" },
        { label: t("auPair"), href: "/services/au-pair" },
        { label: t("elderlyCare"), href: "/services/elderly-care" },
        { label: t("gardener"), href: "/services/gardener" },
      ],
    },
    { label: t("pricing"), href: "/pricing" },
    { label: t("howItWorks"), href: "/how-it-works" },
    { label: t("about"), href: "/about" },
    { label: t("faq"), href: "/faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="HappySalary"
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            <span className="text-base sm:text-lg lg:text-xl font-bold text-secondary group-hover:text-primary transition-colors">
              Happy<span className="text-primary">Salary</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    scrolled ? "text-text hover:text-primary" : "text-secondary hover:text-primary"
                  )}
                >
                  {link.label}
                  {link.children && (
                    <svg className="inline ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-xl shadow-xl border border-border p-2 min-w-[220px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Locale switcher - always visible as compact dropdown */}
            <LocaleSwitcher />
            {/* CTA - desktop only */}
            <div className="hidden lg:block">
              <Button href="/pricing" size="sm">
                {tc("getStarted")}
              </Button>
            </div>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-secondary cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </header>
  );
}
