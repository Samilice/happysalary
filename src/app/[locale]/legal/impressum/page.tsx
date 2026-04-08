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
            {/* Exploitant du site */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Exploitant du site
              </h2>
              <div className="space-y-1">
                <p><strong>HappySalary</strong></p>
                <p>Thomas Busquets</p>
                <p>Raison individuelle (RI)</p>
                <p>Rue du March&eacute; 12</p>
                <p>1003 Lausanne</p>
                <p>Suisse</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Contact
              </h2>
              <div className="space-y-1">
                <p>T&eacute;l&eacute;phone : <a href="tel:+41795268650" className="text-primary hover:underline">+41 79 526 86 50</a></p>
                <p>E-mail g&eacute;n&eacute;ral : <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a></p>
                <p>Support : <a href="mailto:support@happysalary.ch" className="text-primary hover:underline">support@happysalary.ch</a></p>
                <p>Site web : <a href="https://www.happysalary.ch" className="text-primary hover:underline">www.happysalary.ch</a></p>
              </div>
            </div>

            {/* Forme juridique */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Forme juridique
              </h2>
              <p>
                Raison individuelle de droit suisse au sens de l&apos;art. 945 CO, exploit&eacute;e par Thomas Busquets.
              </p>
            </div>

            {/* Identification */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Num&eacute;ro d&apos;identification
              </h2>
              <div className="space-y-1">
                <p>Num&eacute;ro IDE (UID) : CHE-XXX.XXX.XXX</p>
              </div>
            </div>

            {/* Personne responsable */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Personne responsable du contenu
              </h2>
              <div className="space-y-1">
                <p><strong>Thomas Busquets</strong></p>
                <p>Fondateur et exploitant</p>
                <p>Rue du March&eacute; 12, 1003 Lausanne, Suisse</p>
              </div>
            </div>

            {/* Hebergement */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                H&eacute;bergement
              </h2>
              <div className="space-y-1">
                <p><strong>Cloudflare, Inc.</strong></p>
                <p>101 Townsend St</p>
                <p>San Francisco, CA 94107, USA</p>
                <p>Site web : <a href="https://www.cloudflare.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.cloudflare.com</a></p>
              </div>
              <p className="mt-2">
                Le site est h&eacute;berg&eacute; via Cloudflare Pages. Les donn&eacute;es utilisateurs sont trait&eacute;es et stock&eacute;es en Suisse et dans l&apos;Union europ&eacute;enne.
              </p>
            </div>

            {/* Clause de non-responsabilite */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Clause de non-responsabilit&eacute;
              </h2>
              <p>
                Les informations publi&eacute;es sur ce site sont fournies &agrave; titre indicatif et sont susceptibles d&apos;&ecirc;tre modifi&eacute;es sans pr&eacute;avis. HappySalary d&eacute;cline toute responsabilit&eacute; quant &agrave; l&apos;exactitude, la fiabilit&eacute; ou l&apos;exhaustivit&eacute; des informations pr&eacute;sent&eacute;es. L&apos;utilisation du site et l&apos;acc&egrave;s aux informations qu&apos;il contient se font sous la seule responsabilit&eacute; de l&apos;utilisateur.
              </p>
            </div>

            {/* Droits d'auteur */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Droits d&apos;auteur
              </h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logos, ic&ocirc;nes) est prot&eacute;g&eacute; par les lois suisses et internationales sur les droits d&apos;auteur. Toute reproduction, distribution ou utilisation sans autorisation &eacute;crite pr&eacute;alable de Thomas Busquets est interdite.
              </p>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Droit applicable et for juridique
              </h2>
              <p>
                Le pr&eacute;sent site est soumis au droit suisse. Le for juridique exclusif est Lausanne, canton de Vaud, Suisse.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
