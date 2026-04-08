import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const features = [
  { key: "payroll", image: "/images/icons/payroll.webp" },
  { key: "socialContributions", image: "/images/icons/social.webp" },
  { key: "insurance", image: "/images/icons/insurance.webp" },
  { key: "contracts", image: "/images/icons/contract.webp" },
  { key: "payslips", image: "/images/icons/payslip.webp" },
  { key: "taxWithholding", image: "/images/icons/tax.webp" },
];

export function FeatureGrid() {
  const t = useTranslations("home.features");

  return (
    <section className="py-20 lg:py-28 bg-background">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <ScrollReveal key={feature.key} delay={idx * 100}>
              <Card>
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={feature.image}
                    alt={t(`${feature.key}.title`)}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {t(`${feature.key}.description`)}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
