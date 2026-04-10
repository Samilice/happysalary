"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      // Fire gtag conversion event
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "contact",
          event_label: data.subject,
        });
      }

      setSubmitted(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-success/10 border border-success/20 p-8 text-center">
        <svg
          className="w-12 h-12 text-success mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-secondary font-semibold text-lg">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {t("name")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {t("email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {t("phone")}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {t("subject")}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "..." : t("submit")}
      </Button>
    </form>
  );
}
