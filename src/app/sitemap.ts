import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://happysalary.ch";

const pages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/cleaning-lady", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/nanny", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/au-pair", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/elderly-care", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/gardener", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/features/payroll", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/features/social-contributions", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/features/accident-insurance", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/features/employment-contracts", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/features/payslips", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/legal/impressum", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of routing.locales) {
      const alternates: Record<string, string> = {};
      for (const loc of routing.locales) {
        alternates[loc] = `${BASE_URL}/${loc}${page.path}`;
      }

      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
