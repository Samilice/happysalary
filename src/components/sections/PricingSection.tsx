import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCard } from "@/components/ui/PricingCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { plans } from "@/lib/plans";

export function PricingSection() {
  const t = useTranslations("pricing");

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-background">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {plans.map((plan) => (
            <div key={plan.id} className="min-w-[280px] max-w-[300px] snap-center flex-shrink-0">
              <PricingCard plan={plan} />
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
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
