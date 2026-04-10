import type { MetadataRoute } from "next";

const BASE_URL = "https://happysalary.ch";
const locales = ["fr", "de", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/pricing",
    "/how-it-works",
    "/about",
    "/faq",
    "/contact",
    "/salary-calculator",
    "/signup",
    "/login",
    "/legal/impressum",
    "/legal/privacy",
    "/legal/terms",
    "/services/cleaning-lady",
    "/services/nanny",
    "/services/au-pair",
    "/services/elderly-care",
    "/services/gardener",
    "/features/payroll",
    "/features/social-contributions",
    "/features/accident-insurance",
    "/features/employment-contracts",
    "/features/payslips",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" || page === "/pricing" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : page === "/pricing" ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
