import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type Props = {
  params: Promise<{ locale: string }>;
};

const stepIcons = [
  // User/Register icon
  <svg key="1" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>,
  // Cog/Processing icon
  <svg key="2" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  // Document/Dashboard icon
  <svg key="3" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
  </svg>,
];

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("howItWorks");

  const steps = [
    { title: t("step1.title"), description: t("step1.description"), detail: t("step1.detail") },
    { title: t("step2.title"), description: t("step2.description"), detail: t("step2.detail") },
    { title: t("step3.title"), description: t("step3.description"), detail: t("step3.detail") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background-alt to-background">
        <Container>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Container>
      </section>

      {/* Steps */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12 lg:space-y-16">
            {steps.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Step number and icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {stepIcons[idx]}
                    </div>
                  </div>

                  {/* Content */}
                  <Card hover={false} className="flex-1">
                    <h3 className="text-2xl font-bold text-secondary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-primary font-medium mb-3">
                      {step.description}
                    </p>
                    <p className="text-text-muted leading-relaxed">
                      {step.detail}
                    </p>
                  </Card>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-background-alt">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-6">
                {t("cta.title")}
              </h2>
              <Button href="/pricing" size="lg">
                {t("cta.button")}
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
