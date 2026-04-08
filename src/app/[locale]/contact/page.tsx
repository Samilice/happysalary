import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/ui/ContactForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background-alt to-background">
        <Container>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Form */}
            <ScrollReveal className="lg:col-span-3">
              <Card hover={false}>
                <ContactForm />
              </Card>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal delay={200} className="lg:col-span-2">
              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Adresse</h3>
                    <p className="text-text-muted text-sm">{t("info.address")}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Email</h3>
                    <p className="text-text-muted text-sm">{t("info.email")}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Phone</h3>
                    <p className="text-text-muted text-sm">{t("info.phone")}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Horaires</h3>
                    <p className="text-text-muted text-sm">{t("info.hours")}</p>
                  </div>
                </div>

                {/* Swiss Made Badge */}
                <Card hover={false} className="bg-primary/5 border-primary/20 text-center mt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">&#127464;&#127469;</span>
                    <span className="font-bold text-secondary">Swiss Made</span>
                  </div>
                  <p className="text-sm text-text-muted">
                    HappySalary SA - Suisse
                  </p>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
