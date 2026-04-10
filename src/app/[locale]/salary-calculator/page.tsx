import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FreemiumCalculator } from "@/components/sections/FreemiumCalculator";
import { CTABanner } from "@/components/sections/CTABanner";
import { TrustBar } from "@/components/sections/TrustBar";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculatorLanding" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function SalaryCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calculatorLanding");

  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-8 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-b from-secondary via-secondary to-secondary-light text-white">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                {t("hero.badge")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {t("hero.title")}
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Calculator */}
      <section className="bg-gradient-to-b from-secondary-light to-secondary py-8 sm:py-12">
        <FreemiumCalculator variant="landing" />
      </section>

      {/* Trust */}
      <TrustBar />

      {/* How it works teaser */}
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3">
                {t("steps.title")}
              </h2>
              <p className="text-sm sm:text-base text-text-muted">
                {t("steps.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[1, 2, 3].map((step) => (
              <ScrollReveal key={step} delay={step * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-secondary mb-2">
                    {t(`steps.step${step}.title`)}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {t(`steps.step${step}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What you get (premium teaser) */}
      <section className="py-12 sm:py-20 bg-background-alt">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3">
                {t("premium.title")}
              </h2>
              <p className="text-sm sm:text-base text-text-muted">
                {t("premium.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-lg mx-auto">
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                <ul className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-text">{t(`premium.feature${i}`)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-border text-center">
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-3xl font-bold text-secondary">12.99</span>
                    <span className="text-sm text-text-muted">CHF / {t("premium.month")}</span>
                  </div>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
                  >
                    {t("premium.cta")}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <p className="text-xs text-text-muted mt-3">{t("premium.guarantee")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20">
        <Container>
          <ScrollReveal>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-8 text-center">
                {t("faq.title")}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm text-secondary mb-2">{t(`faq.q${i}`)}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{t(`faq.a${i}`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
