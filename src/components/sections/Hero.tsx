import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <ScrollReveal>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Swiss Made</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-secondary">
                {t("title")}
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-text-muted leading-relaxed">
                {t("subtitle")}
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button href="/pricing" size="lg">
                  {t("ctaPrimary")}
                </Button>
                <Button href="/how-it-works" variant="outline" size="lg">
                  {t("ctaSecondary")}
                </Button>
              </div>

              {/* Mini trust indicators - hidden on small mobile */}
              <div className="mt-6 sm:mt-10 hidden sm:flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-border">
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-medium text-text">26 cantons</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-border">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                  </svg>
                  <span className="text-xs font-medium text-text">Sans commission</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-border">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-medium text-text">Inscription en 2 min</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Hero visual - VISIBLE on all screens */}
          <ScrollReveal delay={200}>
            <div className="relative flex items-center justify-center mt-4 lg:mt-0">
              <div className="relative w-full max-w-sm sm:max-w-md xl:max-w-lg mx-auto">
                <div className="relative aspect-[16/9] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                  {/* Animated GIF hero */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-video.gif"
                    alt="Happy Swiss family at home"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>

                {/* Floating cards - hidden on small mobile */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 z-10 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium">AVS &#10003;</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 z-10 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-[9px] sm:text-xs font-bold text-primary">CHF</span>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold">CHF 9.90/mois</p>
                      <p className="text-[8px] sm:text-[10px] text-text-muted">Prix fixe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
