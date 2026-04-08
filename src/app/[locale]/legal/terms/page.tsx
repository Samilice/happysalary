import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.terms");

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-8">
            {/* Scope */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                1. Champ d&apos;application
              </h2>
              <p>
                Les presentes conditions generales d&apos;utilisation (ci-apres &quot;CGU&quot;) regissent l&apos;utilisation de la plateforme HappySalary (ci-apres &quot;la Plateforme&quot;) exploitee par HappySalary SA, Rue du Marche 12, CH-1204 Geneve (ci-apres &quot;HappySalary&quot;). En utilisant la Plateforme, l&apos;utilisateur accepte les presentes CGU dans leur integralite.
              </p>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                2. Description des services
              </h2>
              <p className="mb-3">
                HappySalary propose un service en ligne de gestion de la paie pour les employeurs de personnel de maison en Suisse. Les services comprennent notamment :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Le calcul et l&apos;etablissement des fiches de salaire mensuelles</li>
                <li>Le calcul des cotisations sociales (AVS/AI/APG/AC)</li>
                <li>La declaration et le versement des cotisations sociales</li>
                <li>L&apos;affiliation a l&apos;assurance accidents (LAA)</li>
                <li>La generation de contrats de travail conformes au droit suisse</li>
                <li>Le calcul de l&apos;impot a la source le cas echeant</li>
                <li>L&apos;archivage securise des documents</li>
              </ul>
            </div>

            {/* Registration */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                3. Inscription et compte utilisateur
              </h2>
              <p>
                L&apos;utilisation des services de HappySalary necessite la creation d&apos;un compte. L&apos;utilisateur s&apos;engage a fournir des informations exactes, completes et a jour. L&apos;utilisateur est responsable de la confidentialite de ses identifiants de connexion et de toute activite effectuee depuis son compte. HappySalary se reserve le droit de suspendre ou de supprimer un compte en cas de violation des presentes CGU.
              </p>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                4. Tarifs et paiement
              </h2>
              <p className="mb-3">
                Les services de HappySalary sont factures sous forme d&apos;un abonnement mensuel a forfait fixe par employe. Les tarifs en vigueur sont affiches sur la page de tarification de la Plateforme.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Le paiement est effectue mensuellement par carte bancaire via Stripe</li>
                <li>Les cotisations sociales et primes d&apos;assurance sont facturees separement au cout reel</li>
                <li>HappySalary se reserve le droit de modifier ses tarifs avec un preavis de 30 jours</li>
                <li>En cas de non-paiement, HappySalary se reserve le droit de suspendre les services</li>
              </ul>
            </div>

            {/* User obligations */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                5. Obligations de l&apos;utilisateur
              </h2>
              <p className="mb-3">L&apos;utilisateur s&apos;engage a :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des informations exactes et completes sur son employe</li>
                <li>Communiquer dans les meilleurs delais toute modification des conditions d&apos;emploi</li>
                <li>Verser le salaire a son employe selon les montants calcules par HappySalary</li>
                <li>Respecter les obligations legales en tant qu&apos;employeur au-dela du perimetre des services de HappySalary</li>
                <li>Ne pas utiliser la Plateforme a des fins frauduleuses ou illicites</li>
              </ul>
            </div>

            {/* Liability */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                6. Responsabilite
              </h2>
              <p>
                HappySalary s&apos;efforce de fournir un service de qualite et conforme a la legislation suisse en vigueur. Toutefois, HappySalary ne saurait etre tenue responsable des dommages indirects, y compris les pertes financieres, resultant de l&apos;utilisation de la Plateforme. La responsabilite de HappySalary est limitee au montant des frais de service payes par l&apos;utilisateur au cours des 12 derniers mois. L&apos;utilisateur reste seul responsable du respect de l&apos;ensemble de ses obligations en tant qu&apos;employeur.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                7. Resiliation
              </h2>
              <p>
                L&apos;utilisateur peut resilier son abonnement a tout moment depuis son espace client. La resiliation prend effet a la fin du mois en cours. HappySalary fournira les documents de fin d&apos;emploi necessaires (decompte annuel de salaire, attestation de travail) dans un delai raisonnable. HappySalary peut egalement resilier le contrat avec un preavis de 30 jours, sauf en cas de violation grave des CGU justifiant une resiliation immediate.
              </p>
            </div>

            {/* Intellectual property */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                8. Propriete intellectuelle
              </h2>
              <p>
                L&apos;ensemble des elements de la Plateforme (logiciel, interface, contenus, marques, logos) sont la propriete exclusive de HappySalary SA ou de ses partenaires. Toute reproduction, representation ou exploitation, meme partielle, est interdite sans autorisation ecrite prealable.
              </p>
            </div>

            {/* Data protection */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                9. Protection des donnees
              </h2>
              <p>
                Le traitement des donnees personnelles est regi par notre Politique de confidentialite, disponible sur la Plateforme. HappySalary s&apos;engage a traiter les donnees personnelles conformement a la LPD et au RGPD.
              </p>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                10. Modifications des CGU
              </h2>
              <p>
                HappySalary se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes de toute modification substantielle par e-mail ou via la Plateforme avec un preavis de 30 jours. L&apos;utilisation continue de la Plateforme apres l&apos;entree en vigueur des modifications vaut acceptation des nouvelles CGU.
              </p>
            </div>

            {/* Applicable law */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                11. Droit applicable et for juridique
              </h2>
              <p>
                Les presentes CGU sont soumises au droit suisse. Tout litige relatif a l&apos;interpretation ou a l&apos;execution des presentes CGU sera soumis a la competence exclusive des tribunaux de Geneve, Suisse.
              </p>
              <p className="mt-3 text-sm">
                Derniere mise a jour : janvier 2025
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
