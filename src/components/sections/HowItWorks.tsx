import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  { key: "step1", number: "01", color: "bg-primary" },
  { key: "step2", number: "02", color: "bg-accent" },
  { key: "step3", number: "03", color: "bg-success" },
];

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-accent to-success" />

          {steps.map((step, idx) => (
            <ScrollReveal key={step.key} delay={idx * 150}>
              <div className="text-center relative">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {t(`${step.key}.title`)}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {t(`${step.key}.description`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
