import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section className="py-12 sm:py-20 lg:py-28 bg-background">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {features.map((feature, idx) => (
            <ScrollReveal key={feature.key} delay={idx * 80}>
              <div className={`rounded-2xl bg-surface border border-border p-4 sm:p-6 lg:p-8 h-full ${idx >= 4 ? "hidden sm:block" : ""}`}>
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5">
                  <Image
                    src={feature.image}
                    alt={t(`${feature.key}.title`)}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-secondary mb-1 sm:mb-2">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
