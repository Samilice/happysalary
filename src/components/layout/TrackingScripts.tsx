"use client";

import { useEffect, useState } from "react";

/**
 * Loads GA4 + Clarity only after cookie consent is given.
 * Checks localStorage for "cookie-consent" === "accepted".
 * Re-checks on storage events (when CookieBanner sets the value).
 */
export function TrackingScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Check immediately
    if (localStorage.getItem("cookie-consent") === "accepted") {
      setConsented(true);
      return;
    }

    // Listen for consent changes (CookieBanner sets localStorage)
    function onStorage() {
      if (localStorage.getItem("cookie-consent") === "accepted") {
        setConsented(true);
      }
    }

    // Poll every 500ms since localStorage events don't fire in same tab
    const interval = setInterval(onStorage, 500);
    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!consented) return;

    // Load GA4
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XD4PY2DCDL";
    document.head.appendChild(gtagScript);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    function gtag(...args: unknown[]) { w.dataLayer.push(args); }
    gtag("js", new Date());
    gtag("config", "G-XD4PY2DCDL");

    // Load Clarity
    (function (c: any, l: any, a: string, r: string, i: string) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "w9dcyak2z6");
  }, [consented]);

  return null;
}
