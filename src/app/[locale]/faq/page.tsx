import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");

  const categories = [
    {
      name: t("categories.general"),
      items: [
        { question: t("general.q1"), answer: t("general.a1") },
        { question: t("general.q2"), answer: t("general.a2") },
        { question: t("general.q3"), answer: t("general.a3") },
        { question: t("general.q4"), answer: t("general.a4") },
      ],
    },
    {
      name: t("categories.pricing"),
      items: [
        { question: t("pricingFaq.q1"), answer: t("pricingFaq.a1") },
        { question: t("pricingFaq.q2"), answer: t("pricingFaq.a2") },
        { question: t("pricingFaq.q3"), answer: t("pricingFaq.a3") },
      ],
    },
    {
      name: t("categories.services"),
      items: [
        { question: t("servicesFaq.q1"), answer: t("servicesFaq.a1") },
        { question: t("servicesFaq.q2"), answer: t("servicesFaq.a2") },
        { question: t("servicesFaq.q3"), answer: t("servicesFaq.a3") },
      ],
    },
    {
      name: t("categories.legal"),
      items: [
        { question: t("legalFaq.q1"), answer: t("legalFaq.a1") },
        { question: t("legalFaq.q2"), answer: t("legalFaq.a2") },
        { question: t("legalFaq.q3"), answer: t("legalFaq.a3") },
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background-alt to-background">
        <Container>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Container>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            {categories.map((category, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div>
                  <h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {idx + 1}
                    </span>
                    {category.name}
                  </h3>
                  <FAQAccordion items={category.items} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
