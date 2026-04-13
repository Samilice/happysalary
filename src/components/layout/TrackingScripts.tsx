"use client";

import { useEffect, useState } from "react";

/**
 * Loads GA4 + Clarity by default.
 * Only blocks tracking if user explicitly clicked "Decline" (cookie-consent === "declined").
 */
export function TrackingScripts() {
  const [blocked, setBlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cookie-consent") === "declined") {
      setBlocked(true);
      return;
    }

    // Not declined → load tracking
    if (!loaded) {
      loadTracking();
      setLoaded(true);
    }

    // Watch in case user declines later (shouldn't happen but just in case)
    const interval = setInterval(() => {
      if (localStorage.getItem("cookie-consent") === "declined") {
        setBlocked(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (blocked || loaded) return null;
  return null;
}

function loadTracking() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  // GA4
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XD4PY2DCDL";
  document.head.appendChild(gtagScript);

  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) { w.dataLayer.push(args); }
  gtag("js", new Date());
  gtag("config", "G-XD4PY2DCDL");

  // Clarity
  (function (c: any, l: any, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "w9dcyak2z6");
}
