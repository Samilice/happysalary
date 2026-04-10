"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface GtagEventProps {
  event: string;
  params?: Record<string, string | number>;
}

export function GtagEvent({ event, params = {} }: GtagEventProps) {
  useEffect(() => {
    window.gtag?.("event", event, params);
  }, [event, params]);

  return null;
}
