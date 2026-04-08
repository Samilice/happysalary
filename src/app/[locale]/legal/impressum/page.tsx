import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.impressum");

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-10">
            {/* Operator */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("operator")}
              </h2>
              <div className="space-y-1">
                <p><strong>HappySalary</strong></p>
                <p>Thomas Busquets</p>
                <p>{t("legalForm")}</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("contactTitle")}
              </h2>
              <div className="space-y-1">
                <p>{t("emailLabel")} : <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a></p>
                <p>{t("websiteLabel")} : <a href="https://www.happysalary.ch" className="text-primary hover:underline">www.happysalary.ch</a></p>
              </div>
            </div>

            {/* Legal form */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("legalFormTitle")}
              </h2>
              <p>{t("legalFormDescription")}</p>
            </div>

            {/* Responsible person */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("responsiblePerson")}
              </h2>
              <div className="space-y-1">
                <p><strong>Thomas Busquets</strong></p>
                <p>{t("founderRole")}</p>
              </div>
            </div>

            {/* Hosting */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("hosting")}
              </h2>
              <div className="space-y-1">
                <p><strong>Cloudflare, Inc.</strong></p>
                <p>101 Townsend St</p>
                <p>San Francisco, CA 94107, USA</p>
                <p>{t("websiteLabel")} : <a href="https://www.cloudflare.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.cloudflare.com</a></p>
              </div>
              <p className="mt-2">{t("hostingDescription")}</p>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("disclaimer")}
              </h2>
              <p>{t("disclaimerText")}</p>
            </div>

            {/* Copyright */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("copyright")}
              </h2>
              <p>{t("copyrightText")}</p>
            </div>

            {/* Applicable law */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {t("applicableLaw")}
              </h2>
              <p>{t("applicableLawText")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
