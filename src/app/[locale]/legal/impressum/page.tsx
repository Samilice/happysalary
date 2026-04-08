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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Angaben gemass Art. 3 Abs. 1 Bst. s DSG / Informations selon art. 3 al. 1 let. s LPD
              </h2>
              <div className="space-y-1">
                <p><strong>HappySalary SA</strong></p>
                <p>Rue du Marche 12</p>
                <p>CH-1204 Geneve</p>
                <p>Suisse / Schweiz</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Contact
              </h2>
              <div className="space-y-1">
                <p>Telephone : +41 22 123 45 67</p>
                <p>E-Mail : contact@happysalary.ch</p>
                <p>Site web : www.happysalary.ch</p>
              </div>
            </div>

            {/* Legal form */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Forme juridique / Rechtsform
              </h2>
              <p>
                Societe anonyme de droit suisse (SA), inscrite au Registre du commerce du canton de Geneve.
              </p>
            </div>

            {/* Registration */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Registre du commerce / Handelsregister
              </h2>
              <div className="space-y-1">
                <p>Numero IDE : CHE-123.456.789</p>
                <p>Numero TVA : CHE-123.456.789 TVA</p>
                <p>Registre du commerce du canton de Geneve</p>
              </div>
            </div>

            {/* Responsible person */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Personne responsable / Verantwortliche Person
              </h2>
              <p>Thomas B., Fondateur & CEO</p>
            </div>

            {/* Hosting */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Hebergement / Hosting
              </h2>
              <div className="space-y-1">
                <p>Vercel Inc.</p>
                <p>440 N Baxter Street, Suite 200</p>
                <p>Los Angeles, CA 90036, USA</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Clause de non-responsabilite / Haftungsausschluss
              </h2>
              <p>
                Les informations publiees sur ce site sont fournies a titre indicatif et sont susceptibles d&apos;etre modifiees sans preavis. HappySalary SA decline toute responsabilite quant a l&apos;exactitude, la fiabilite ou l&apos;exhaustivite des informations presentees. L&apos;utilisation du site et l&apos;acces aux informations qu&apos;il contient se font sous la seule responsabilite de l&apos;utilisateur.
              </p>
            </div>

            {/* Copyright */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Droits d&apos;auteur / Urheberrecht
              </h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logos, icones) est protege par les lois suisses et internationales sur les droits d&apos;auteur. Toute reproduction, distribution ou utilisation sans autorisation ecrite prealable est interdite.
              </p>
            </div>

            {/* Applicable law */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Droit applicable / Anwendbares Recht
              </h2>
              <p>
                Le present site est soumis au droit suisse. Le for juridique est Geneve, Suisse.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
