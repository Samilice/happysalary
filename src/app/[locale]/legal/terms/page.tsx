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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-10">
            {/* Champ d'application */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                1. Champ d&apos;application
              </h2>
              <p>
                Les pr&eacute;sentes conditions g&eacute;n&eacute;rales d&apos;utilisation (ci-apr&egrave;s &laquo; CGU &raquo;) r&eacute;gissent l&apos;utilisation de la plateforme HappySalary (ci-apr&egrave;s &laquo; la Plateforme &raquo;), exploit&eacute;e par Thomas Busquets, raison individuelle, Suisse (ci-apr&egrave;s &laquo; HappySalary &raquo;). En acc&eacute;dant &agrave; la Plateforme ou en utilisant nos services, l&apos;utilisateur accepte les pr&eacute;sentes CGU dans leur int&eacute;gralit&eacute;.
              </p>
            </div>

            {/* Description des services */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                2. Description des services
              </h2>
              <p className="mb-3">
                HappySalary propose un service en ligne de gestion de la paie pour les employeurs de personnel de maison en Suisse. Les services comprennent notamment :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Le calcul et l&apos;&eacute;tablissement des fiches de salaire mensuelles</li>
                <li>Le calcul des cotisations sociales (AVS/AI/APG/AC)</li>
                <li>La d&eacute;claration et le versement des cotisations sociales</li>
                <li>L&apos;affiliation &agrave; l&apos;assurance accidents (LAA)</li>
                <li>La g&eacute;n&eacute;ration de contrats de travail conformes au droit suisse</li>
                <li>Le calcul de l&apos;imp&ocirc;t &agrave; la source le cas &eacute;ch&eacute;ant</li>
                <li>L&apos;archivage s&eacute;curis&eacute; des documents</li>
              </ul>
            </div>

            {/* Inscription */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                3. Inscription et compte utilisateur
              </h2>
              <p>
                L&apos;utilisation des services de HappySalary n&eacute;cessite la cr&eacute;ation d&apos;un compte. L&apos;utilisateur s&apos;engage &agrave; fournir des informations exactes, compl&egrave;tes et &agrave; jour. L&apos;utilisateur est responsable de la confidentialit&eacute; de ses identifiants de connexion et de toute activit&eacute; effectu&eacute;e depuis son compte. HappySalary se r&eacute;serve le droit de suspendre ou de supprimer un compte en cas de violation des pr&eacute;sentes CGU.
              </p>
            </div>

            {/* Tarifs et paiement */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                4. Tarifs et paiement
              </h2>
              <p className="mb-3">
                Les services de HappySalary sont propos&eacute;s sous forme d&apos;abonnement mensuel &agrave; forfait fixe par employ&eacute;. Les plans tarifaires en vigueur sont les suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Basic :</strong> CHF 9.90 / mois par employ&eacute; &ndash; gestion des salaires et cotisations sociales</li>
                <li><strong>Comfort :</strong> CHF 19.90 / mois par employ&eacute; &ndash; inclut en plus les assurances et contrats de travail</li>
                <li><strong>Premium :</strong> CHF 29.90 / mois par employ&eacute; &ndash; service int&eacute;gral avec support prioritaire et conseils juridiques</li>
              </ul>
              <p className="mt-4">Conditions de paiement :</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Le paiement est effectu&eacute; mensuellement par carte bancaire via notre prestataire de paiement <strong>Stripe</strong></li>
                <li>Les cotisations sociales et primes d&apos;assurance sont factur&eacute;es s&eacute;par&eacute;ment au co&ucirc;t r&eacute;el, sans majoration</li>
                <li>Les prix sont indiqu&eacute;s en francs suisses (CHF), TVA incluse le cas &eacute;ch&eacute;ant</li>
                <li>HappySalary se r&eacute;serve le droit de modifier ses tarifs avec un pr&eacute;avis de 30 jours</li>
                <li>En cas de non-paiement, HappySalary se r&eacute;serve le droit de suspendre l&apos;acc&egrave;s aux services</li>
              </ul>
            </div>

            {/* Obligations de l'utilisateur */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                5. Obligations de l&apos;utilisateur
              </h2>
              <p className="mb-3">L&apos;utilisateur s&apos;engage &agrave; :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des informations exactes et compl&egrave;tes sur son employ&eacute;</li>
                <li>Communiquer dans les meilleurs d&eacute;lais toute modification des conditions d&apos;emploi</li>
                <li>Verser le salaire &agrave; son employ&eacute; selon les montants calcul&eacute;s par HappySalary</li>
                <li>Respecter les obligations l&eacute;gales en tant qu&apos;employeur, au-del&agrave; du p&eacute;rim&egrave;tre des services de HappySalary</li>
                <li>Ne pas utiliser la Plateforme &agrave; des fins frauduleuses ou illicites</li>
              </ul>
            </div>

            {/* Responsabilite */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                6. Limitation de responsabilit&eacute;
              </h2>
              <p>
                HappySalary s&apos;efforce de fournir un service de qualit&eacute; et conforme &agrave; la l&eacute;gislation suisse en vigueur. Toutefois :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>HappySalary ne saurait &ecirc;tre tenu responsable des dommages indirects, y compris les pertes de revenus, de donn&eacute;es ou de b&eacute;n&eacute;fices, r&eacute;sultant de l&apos;utilisation ou de l&apos;impossibilit&eacute; d&apos;utiliser la Plateforme</li>
                <li>La responsabilit&eacute; totale de HappySalary est limit&eacute;e au montant des frais de service effectivement pay&eacute;s par l&apos;utilisateur au cours des 12 derniers mois</li>
                <li>HappySalary ne garantit pas la disponibilit&eacute; ininterrompue de la Plateforme et ne saurait &ecirc;tre tenu responsable des interruptions temporaires li&eacute;es &agrave; la maintenance ou &agrave; des circonstances ind&eacute;pendantes de sa volont&eacute;</li>
                <li>L&apos;utilisateur reste seul responsable du respect de l&apos;ensemble de ses obligations en tant qu&apos;employeur</li>
              </ul>
            </div>

            {/* Resiliation */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                7. R&eacute;siliation
              </h2>
              <p>
                L&apos;utilisateur peut r&eacute;silier son abonnement &agrave; tout moment depuis son espace client ou en contactant le support &agrave; <a href="mailto:support@happysalary.ch" className="text-primary hover:underline">support@happysalary.ch</a>. Il n&apos;y a aucun engagement minimum de dur&eacute;e.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>La r&eacute;siliation prend effet &agrave; la fin de la p&eacute;riode de facturation en cours</li>
                <li>Aucun frais de r&eacute;siliation n&apos;est appliqu&eacute;</li>
                <li>HappySalary fournira les documents de fin d&apos;emploi n&eacute;cessaires (d&eacute;compte annuel de salaire, attestation) dans un d&eacute;lai raisonnable</li>
                <li>HappySalary peut &eacute;galement r&eacute;silier le contrat avec un pr&eacute;avis de 30 jours, sauf en cas de violation grave des CGU justifiant une r&eacute;siliation imm&eacute;diate</li>
              </ul>
            </div>

            {/* Propriete intellectuelle */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                8. Propri&eacute;t&eacute; intellectuelle
              </h2>
              <p>
                L&apos;ensemble des &eacute;l&eacute;ments de la Plateforme (logiciel, interface, contenus, marques, logos) sont la propri&eacute;t&eacute; exclusive de HappySalary &ndash; Thomas Busquets ou de ses partenaires. Toute reproduction, repr&eacute;sentation ou exploitation, m&ecirc;me partielle, est interdite sans autorisation &eacute;crite pr&eacute;alable.
              </p>
            </div>

            {/* Protection des donnees */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                9. Protection des donn&eacute;es
              </h2>
              <p>
                Le traitement des donn&eacute;es personnelles est r&eacute;gi par notre Politique de confidentialit&eacute;, accessible sur la Plateforme. HappySalary s&apos;engage &agrave; traiter les donn&eacute;es personnelles conform&eacute;ment &agrave; la Loi f&eacute;d&eacute;rale sur la protection des donn&eacute;es (LPD / nDSG) et au RGPD dans la mesure applicable.
              </p>
            </div>

            {/* Modifications des CGU */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                10. Modifications des CGU
              </h2>
              <p>
                HappySalary se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU &agrave; tout moment. Les utilisateurs seront inform&eacute;s de toute modification substantielle par e-mail ou via la Plateforme avec un pr&eacute;avis de 30 jours. L&apos;utilisation continue de la Plateforme apr&egrave;s l&apos;entr&eacute;e en vigueur des modifications vaut acceptation des nouvelles CGU.
              </p>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                11. Droit applicable et for juridique
              </h2>
              <p>
                Les pr&eacute;sentes CGU sont soumises au droit suisse. Tout litige relatif &agrave; l&apos;interpr&eacute;tation, la validit&eacute; ou l&apos;ex&eacute;cution des pr&eacute;sentes CGU sera soumis &agrave; la comp&eacute;tence exclusive des tribunaux de Lausanne, canton de Vaud, Suisse.
              </p>
              <p className="mt-4 text-sm">
                Derni&egrave;re mise &agrave; jour : avril 2026
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                12. Contact
              </h2>
              <p>
                Pour toute question relative aux pr&eacute;sentes CGU, veuillez nous contacter :
              </p>
              <div className="space-y-1 mt-3">
                <p>HappySalary &ndash; Thomas Busquets</p>
                <p>E-mail : <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a></p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
