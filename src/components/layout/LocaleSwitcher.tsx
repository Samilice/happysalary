"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
  fr: "FR",
  de: "DE",
  en: "EN",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-border-light hover:bg-border text-text transition-colors cursor-pointer"
      >
        {localeLabels[locale]}
        <svg className={cn("w-3 h-3 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-border py-1 min-w-[60px] z-50">
          {routing.locales
            .filter((loc) => loc !== locale)
            .map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className="block w-full px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-primary hover:bg-primary/5 transition-colors text-left cursor-pointer"
              >
                {localeLabels[loc]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
