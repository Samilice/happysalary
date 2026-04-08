import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CTABanner } from "@/components/sections/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const relatedFeatures = [
  { href: "/features/payroll", key: "payroll" },
  { href: "/features/accident-insurance", key: "accidentInsurance" },
  { href: "/features/payslips", key: "payslips" },
];

export default async function SocialContributionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("features.socialContributions");
  const tf = await getTranslations("features");

  const details: string[] = t.raw("details");

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background-alt to-background">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="primary" className="mb-4">Feature</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-secondary tracking-tight mb-6">
                {t("title")}
              </h1>
              <p className="text-xl text-text-muted">
                {t("subtitle")}
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Detail Section */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="text-lg text-text-muted leading-relaxed mb-10">
                {t("description")}
              </p>

              <div className="space-y-4">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-text">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button href="/pricing" size="lg">
                  {t("title")}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Related Features */}
      <section className="py-20 lg:py-28 bg-background-alt">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-secondary text-center mb-10">
              Related Features
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedFeatures.map((feature, idx) => (
              <ScrollReveal key={feature.key} delay={idx * 100}>
                <Link href={feature.href}>
                  <Card className="text-center h-full">
                    <h3 className="text-lg font-bold text-secondary mb-2">
                      {tf(`${feature.key}.title`)}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {tf(`${feature.key}.subtitle`)}
                    </p>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
