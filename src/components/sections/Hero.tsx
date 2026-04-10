import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-28 lg:pt-36 pb-14 sm:pb-20 lg:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />

      <Container className="relative">
        {/* Mobile: stacked, compact. Desktop: side by side */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

          {/* Text content */}
          <ScrollReveal>
            <div className="max-w-xl pt-2 sm:pt-0">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-secondary">
                {t("title").includes("simplement") ? (
                  <>
                    {t("title").split("simplement")[0]}
                    <span className="text-primary">simplement.</span>
                  </>
                ) : t("title").includes("simply") ? (
                  <>
                    {t("title").split("simply")[0]}
                    <span className="text-primary">simply.</span>
                  </>
                ) : t("title").includes("einfach") ? (
                  <>
                    {t("title").split("einfach")[0]}
                    <span className="text-primary">einfach.</span>
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
