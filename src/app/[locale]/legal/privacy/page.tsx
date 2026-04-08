import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.privacy");

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-10">
            {/* Introduction */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                1. Introduction
              </h2>
              <p>
                La pr&eacute;sente politique de confidentialit&eacute; d&eacute;crit la mani&egrave;re dont HappySalary, exploit&eacute; par Thomas Busquets (raison individuelle), ci-apr&egrave;s &laquo; HappySalary &raquo;, &laquo; nous &raquo; ou &laquo; notre &raquo;, collecte, traite et prot&egrave;ge les donn&eacute;es personnelles de ses utilisateurs. Elle s&apos;applique conform&eacute;ment &agrave; la Loi f&eacute;d&eacute;rale suisse sur la protection des donn&eacute;es (LPD / nDSG) entr&eacute;e en vigueur le 1er septembre 2023, ainsi qu&apos;au R&egrave;glement g&eacute;n&eacute;ral sur la protection des donn&eacute;es (RGPD) dans la mesure o&ugrave; celui-ci est applicable.
              </p>
            </div>

            {/* Responsable du traitement */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                2. Responsable du traitement
              </h2>
              <div className="space-y-1">
                <p><strong>HappySalary &ndash; Thomas Busquets</strong></p>
                <p>Raison individuelle</p>
                <p>Rue du March&eacute; 12, 1003 Lausanne, Suisse</p>
                <p>E-mail : <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a></p>
                <p>T&eacute;l&eacute;phone : <a href="tel:+41795268650" className="text-primary hover:underline">+41 79 526 86 50</a></p>
              </div>
              <p className="mt-3">
                Pour toute question relative &agrave; la protection des donn&eacute;es, veuillez nous contacter &agrave; l&apos;adresse <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a>.
              </p>
            </div>

            {/* Donnees collectees */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                3. Donn&eacute;es collect&eacute;es
              </h2>
              <p className="mb-3">Nous collectons les cat&eacute;gories de donn&eacute;es suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Donn&eacute;es d&apos;identification :</strong> nom, pr&eacute;nom, adresse, date de naissance, num&eacute;ro AVS</li>
                <li><strong>Donn&eacute;es de contact :</strong> adresse e-mail, num&eacute;ro de t&eacute;l&eacute;phone</li>
                <li><strong>Donn&eacute;es professionnelles :</strong> informations relatives &agrave; l&apos;emploi, salaire, taux d&apos;occupation, fonction</li>
                <li><strong>Donn&eacute;es de connexion :</strong> adresse IP, type de navigateur, pages visit&eacute;es, date et heure de la visite</li>
                <li><strong>Donn&eacute;es de paiement :</strong> les informations n&eacute;cessaires au traitement des paiements sont trait&eacute;es directement par notre prestataire de paiement Stripe et ne sont pas stock&eacute;es sur nos serveurs</li>
              </ul>
            </div>

            {/* Finalites du traitement */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                4. Finalit&eacute;s du traitement
              </h2>
              <p className="mb-3">Vos donn&eacute;es personnelles sont trait&eacute;es pour les finalit&eacute;s suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fourniture et gestion du service de paie pour le personnel de maison</li>
                <li>Calcul et d&eacute;claration des cotisations sociales (AVS/AI/APG/AC)</li>
                <li>&Eacute;tablissement des contrats de travail et des fiches de salaire</li>
                <li>Affiliation aux assurances obligatoires (LAA)</li>
                <li>Traitement des paiements via Stripe</li>
                <li>Communication avec les utilisateurs et support client</li>
                <li>Am&eacute;lioration de nos services et de l&apos;exp&eacute;rience utilisateur</li>
                <li>Respect des obligations l&eacute;gales et r&eacute;glementaires</li>
              </ul>
            </div>

            {/* Base juridique */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                5. Base juridique du traitement
              </h2>
              <p>
                Le traitement de vos donn&eacute;es est fond&eacute; sur les bases juridiques suivantes, conform&eacute;ment &agrave; la LPD (nDSG) :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>Ex&eacute;cution du contrat :</strong> le traitement est n&eacute;cessaire &agrave; l&apos;ex&eacute;cution du contrat de service entre vous et HappySalary</li>
                <li><strong>Obligations l&eacute;gales :</strong> le traitement est n&eacute;cessaire au respect de nos obligations l&eacute;gales, en particulier en mati&egrave;re de droit du travail et de s&eacute;curit&eacute; sociale</li>
                <li><strong>Consentement :</strong> lorsque celui-ci est requis, notamment pour l&apos;envoi de communications marketing</li>
                <li><strong>Int&eacute;r&ecirc;ts l&eacute;gitimes :</strong> am&eacute;lioration de nos services et pr&eacute;vention des fraudes</li>
              </ul>
            </div>

            {/* Transmission des donnees */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                6. Transmission des donn&eacute;es &agrave; des tiers
              </h2>
              <p className="mb-3">Vos donn&eacute;es peuvent &ecirc;tre transmises aux tiers suivants dans le cadre de la fourniture de nos services :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Stripe, Inc.</strong> &ndash; traitement des paiements en ligne (certifi&eacute; PCI DSS)</li>
                <li><strong>Cloudflare, Inc.</strong> &ndash; h&eacute;bergement du site web et s&eacute;curisation des donn&eacute;es</li>
                <li><strong>Caisses de compensation cantonales</strong> &ndash; d&eacute;claration des cotisations AVS/AI/APG/AC</li>
                <li><strong>Compagnies d&apos;assurance</strong> &ndash; affiliation LAA et assurance maladie perte de gain</li>
                <li><strong>Autorit&eacute;s fiscales</strong> &ndash; imp&ocirc;t &agrave; la source le cas &eacute;ch&eacute;ant</li>
              </ul>
              <p className="mt-4 font-semibold">
                Nous ne vendons, ne louons et ne c&eacute;dons jamais vos donn&eacute;es personnelles &agrave; des tiers &agrave; des fins commerciales ou publicitaires.
              </p>
            </div>

            {/* Hebergement et securite */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                7. H&eacute;bergement, s&eacute;curit&eacute; et conservation des donn&eacute;es
              </h2>
              <p>
                Vos donn&eacute;es sont h&eacute;berg&eacute;es en Suisse et dans l&apos;Union europ&eacute;enne via Cloudflare. Nous appliquons des mesures de s&eacute;curit&eacute; techniques et organisationnelles conformes &agrave; l&apos;&eacute;tat de la technique pour prot&eacute;ger vos donn&eacute;es contre tout acc&egrave;s non autoris&eacute;, perte, destruction ou alt&eacute;ration.
              </p>
              <p className="mt-3">
                Vos donn&eacute;es sont conserv&eacute;es pendant la dur&eacute;e de la relation contractuelle et pendant les d&eacute;lais de conservation l&eacute;gaux applicables (en r&egrave;gle g&eacute;n&eacute;rale, 10 ans pour les documents comptables et de paie conform&eacute;ment au Code des obligations suisse). &Agrave; l&apos;expiration de ces d&eacute;lais, les donn&eacute;es sont supprim&eacute;es de mani&egrave;re s&eacute;curis&eacute;e.
              </p>
            </div>

            {/* Transfert a l'etranger */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                8. Transfert de donn&eacute;es &agrave; l&apos;&eacute;tranger
              </h2>
              <p>
                Certains de nos prestataires (Stripe, Cloudflare) peuvent traiter des donn&eacute;es aux &Eacute;tats-Unis. Dans ce cas, le transfert est encadr&eacute; par des clauses contractuelles types (SCC) ou par des garanties &eacute;quivalentes assurant un niveau de protection ad&eacute;quat au sens de la LPD et du RGPD.
              </p>
            </div>

            {/* Droits */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                9. Vos droits
              </h2>
              <p className="mb-3">Conform&eacute;ment &agrave; la LPD (nDSG) et, le cas &eacute;ch&eacute;ant, au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d&apos;acc&egrave;s :</strong> obtenir une copie de vos donn&eacute;es personnelles (art. 25 nDSG)</li>
                <li><strong>Droit de rectification :</strong> corriger les donn&eacute;es inexactes ou incompl&egrave;tes</li>
                <li><strong>Droit &agrave; l&apos;effacement :</strong> demander la suppression de vos donn&eacute;es, sous r&eacute;serve des obligations l&eacute;gales de conservation</li>
                <li><strong>Droit &agrave; la portabilit&eacute; :</strong> recevoir vos donn&eacute;es dans un format structur&eacute;, couramment utilis&eacute; et lisible par machine (art. 28 nDSG)</li>
                <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donn&eacute;es dans certaines circonstances</li>
                <li><strong>Droit de r&eacute;vocation du consentement :</strong> retirer votre consentement &agrave; tout moment lorsque le traitement est fond&eacute; sur celui-ci</li>
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, contactez-nous &agrave; : <a href="mailto:contact@happysalary.ch" className="text-primary hover:underline">contact@happysalary.ch</a>
              </p>
              <p className="mt-2">
                Vous avez &eacute;galement le droit de d&eacute;poser une plainte aupr&egrave;s du Pr&eacute;pos&eacute; f&eacute;d&eacute;ral &agrave; la protection des donn&eacute;es et &agrave; la transparence (PFPDT).
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                10. Cookies et technologies de suivi
              </h2>
              <p>
                Notre site utilise des cookies techniques strictement n&eacute;cessaires au bon fonctionnement du service. Nous pouvons &eacute;galement utiliser des cookies d&apos;analyse pour am&eacute;liorer votre exp&eacute;rience utilisateur. Vous pouvez g&eacute;rer vos pr&eacute;f&eacute;rences de cookies &agrave; tout moment via les param&egrave;tres de votre navigateur ou la banni&egrave;re de consentement affich&eacute;e lors de votre premi&egrave;re visite.
              </p>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">
                11. Modifications de la pr&eacute;sente politique
              </h2>
              <p>
                Nous nous r&eacute;servons le droit de modifier la pr&eacute;sente politique de confidentialit&eacute; &agrave; tout moment. Toute modification substantielle sera communiqu&eacute;e par e-mail ou par un avis sur notre site. La version en vigueur est toujours accessible sur cette page.
              </p>
              <p className="mt-4 text-sm">
                Derni&egrave;re mise &agrave; jour : avril 2026
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
