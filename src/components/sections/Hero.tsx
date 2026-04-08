import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-28 lg:pt-36">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />

      <Container className="relative">
        {/* Mobile: stacked, compact. Desktop: side by side */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

          {/* Text content */}
          <ScrollReveal>
            <div className="max-w-xl pt-2 sm:pt-0">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-3 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-primary">Swiss Made</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-secondary">
                {t("title").includes("simplifiée") ? (
                  <>
                    {t("title").split("simplifiée")[0]}
                    <span className="text-primary">simplifiée.</span>
                  </>
                ) : t("title").includes("simplified") ? (
                  <>
                    Household payroll, <span className="text-primary">simplified.</span>
                  </>
                ) : t("title").includes("einfach") ? (
                  <>
                    {t("title").split("einfach")[0]}
                    <span className="text-primary">einfach gemacht.</span>
                  </>
                ) : (
                  t("title")
                )}
              </h1>
              <p className="mt-3 sm:mt-6 text-sm sm:text-lg text-text-muted leading-relaxed">
                {t("subtitle")}
              </p>
              <div className="mt-4 sm:mt-8 flex flex-row gap-3">
                <Button href="/pricing" size="lg" className="flex-1 sm:flex-none text-sm sm:text-base">
                  {t("ctaPrimary")}
                </Button>
                <Button href="/how-it-works" variant="outline" size="lg" className="flex-1 sm:flex-none text-sm sm:text-base">
                  {t("ctaSecondary")}
                </Button>
              </div>

              {/* Trust indicators - desktop only */}
              <div className="mt-8 hidden sm:flex items-center gap-3 flex-wrap">
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
              </div>
            </div>
          </ScrollReveal>

          {/* Hero GIF - visible on ALL screens */}
          <ScrollReveal delay={100}>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-xs sm:max-w-md xl:max-w-lg mx-auto">
                <div className="relative aspect-[16/9] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-video.gif"
                    alt="Happy Swiss family at home"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
