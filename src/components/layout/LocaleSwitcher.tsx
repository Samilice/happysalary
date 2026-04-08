"use client";

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

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5 bg-border-light rounded-lg p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
            locale === loc
              ? "bg-white text-primary shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
