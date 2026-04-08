import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pricing");

  const faqItems = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
  ];

  return (
    <>
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-background-alt">
        <Container>
          <ScrollReveal>
            <SectionHeading title={t("faq.title")} />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={faqItems} />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
