import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/onboarding/", "/checkout/"],
      },
    ],
    sitemap: "https://happysalary.ch/sitemap.xml",
  };
}
