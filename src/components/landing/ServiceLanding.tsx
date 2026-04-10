import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TrustBar } from "@/components/sections/TrustBar";
import { PricingSection } from "@/components/sections/PricingSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stepColors = ["bg-primary", "bg-accent", "bg-success"];

const benefitIcons = [
  // Checkmark badge
  <svg key="i1" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>,
  // Document
  <svg key="i2" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
  // Shield
  <svg key="i3" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  // Money
  <svg key="i4" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>,
];

type Props = {
  namespace: string;
  badge: string;
  image?: string;
  imageAlt?: string;
};

export async function ServiceLanding({ namespace, badge, image, imageAlt }: Props) {
  const t = await getTranslations(namespace);

  const benefits = ["b1", "b2", "b3", "b4"] as const;

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden pt-16 sm:pt-28 lg:pt-36 pb-14 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <Container className="relative">
          <div className={`flex flex-col ${image ? "lg:flex-row lg:items-center lg:gap-12" : ""}`}>
            <ScrollReveal className={image ? "lg:flex-1" : ""}>
              <div className={image ? "max-w-xl" : "max-w-3xl mx-auto text-center"}>
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-4 sm:mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-primary">{badge}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-secondary">
                  {t("title")}
                </h1>
                <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-text-muted leading-relaxed">
                  {t("subtitle")}
                </p>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">
                  {t("description")}
                </p>
                <div className="mt-6 sm:mt-8 flex flex-row gap-3">
                  <Button href="/pricing" size="lg" className="text-sm sm:text-base">
                    {t("cta")}
                  </Button>
                  <Button href="/how-it-works" variant="outline" size="lg" className="text-sm sm:text-base">
                    {t("ctaSecondary")}
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {image && (
              <ScrollReveal delay={200} className="lg:flex-1 mt-10 lg:mt-0">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-secondary/10">
                  <Image
                    src={image}
                    alt={imageAlt || ""}
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </ScrollReveal>
            )}
          </div>
        </Container>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <TrustBar />

      {/* ═══════════════ BENEFITS ═══════════════ */}
      <section className="py-12 sm:py-20 lg:py-28">
        <Container>
          <SectionHeading title={t("benefitsTitle")} subtitle={t("benefitsSubtitle")} />
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {benefits.map((key, idx) => (
              <ScrollReveal key={key} delay={idx * 100}>
                <Card className="h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {benefitIcons[idx]}
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">
                    {t(`benefits.${key}.title`)}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {t(`benefits.${key}.description`)}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white">
        <Container>
          <SectionHeading title={t("howItWorks.title")} subtitle={t("howItWorks.subtitle")} />
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-accent to-success" />

            {(["step1", "step2", "step3"] as const).map((step, idx) => (
              <ScrollReveal key={step} delay={idx * 150}>
                <div className="text-center relative">
                  <div className={`w-16 h-16 ${stepColors[idx]} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-lg relative z-10`}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-3">
                    {t(`howItWorks.${step}.title`)}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {t(`howItWorks.${step}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <PricingSection />

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <Testimonials />

      {/* ═══════════════ CTA ═══════════════ */}
      <CTABanner />
    </>
  );
}
