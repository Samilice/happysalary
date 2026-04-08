import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";

type Props = {
  params: Promise<{ locale: string }>;
};

const benefitIcons = [
  <svg key="1" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>,
  <svg key="2" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="3" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  <svg key="4" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
];

export default async function ElderlyCare({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services.elderlyCare");
  const benefits = ["b1", "b2", "b3", "b4"] as const;

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background-alt to-background">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="primary" className="mb-4">Service</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-secondary tracking-tight mb-6">
                {t("title")}
              </h1>
              <p className="text-xl text-text-muted mb-4">
                {t("subtitle")}
              </p>
              <p className="text-text-muted leading-relaxed">
                {t("description")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/pricing" size="lg">
                  {t("benefits.b4.title")}
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Contact
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 lg:py-28">
        <Container>
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
                  <p className="text-sm text-text-muted">
                    {t(`benefits.${key}.description`)}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <PricingSection />
      <CTABanner />
    </>
  );
}
