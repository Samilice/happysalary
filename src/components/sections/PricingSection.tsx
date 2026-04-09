"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PLAN } from "@/lib/plans";

export function PricingSection() {
  const t = useTranslations("pricing");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const price = billing === "monthly" ? PLAN.monthlyPrice : PLAN.yearlyPrice;
  const label = billing === "monthly" ? t("plan.perMonth") : t("plan.perYear");
  const link = billing === "monthly" ? PLAN.monthlyPaymentLink : PLAN.yearlyPaymentLink;

  return (
    <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 lg:pt-32 lg:pb-28 bg-background">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <ScrollReveal>
          <div className="max-w-lg mx-auto">
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  billing === "monthly"
                    ? "bg-primary text-white shadow-md"
                    : "bg-border-light text-text-muted hover:bg-border"
                }`}
              >
                {t("plan.monthly")}
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  billing === "yearly"
                    ? "bg-primary text-white shadow-md"
                    : "bg-border-light text-text-muted hover:bg-border"
                }`}
              >
                {t("plan.yearly")}
              </button>
            </div>

            {/* Plan card */}
            <div className="bg-white rounded-2xl border-2 border-primary p-6 sm:p-8 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-secondary mb-2">{t("plan.name")}</h3>
                <p className="text-sm text-text-muted">{t("plan.description")}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-2">
                <span className="text-sm text-text-muted">CHF</span>
                <span className="text-5xl sm:text-6xl font-bold text-secondary mx-1">
                  {price.toString().replace(".", ",")}
                </span>
                <span className="text-sm text-text-muted">{label}</span>
              </div>

              {billing === "monthly" && (
                <p className="text-center text-xs text-text-muted mb-6">{t("plan.noCommitment")}</p>
              )}
              {billing === "yearly" && (
                <p className="text-center text-xs text-success font-medium mb-6">{t("plan.yearlyEquiv")}</p>
              )}

              {/* Features */}
              <div className="space-y-3 mb-8">
                {PLAN.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-text">{t(`features.${feature}`)}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={link}
                className="block w-full text-center rounded-xl font-semibold px-8 py-4 text-lg bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-200"
              >
                {t("cta")}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
