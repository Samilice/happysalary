"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-border p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-text-muted flex-1">{t("message")}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            {t("decline")}
          </button>
          <Button onClick={handleAccept} size="sm">
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
