import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCard } from "@/components/ui/PricingCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { plans } from "@/lib/plans";

export function PricingSection() {
  const t = useTranslations("pricing");

  return (
    <section className="py-20 lg:py-28 bg-background">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <ScrollReveal key={plan.id} delay={idx * 100}>
              <PricingCard plan={plan} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
