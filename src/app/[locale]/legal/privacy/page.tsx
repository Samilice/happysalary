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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-10">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-text-muted space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                1. Introduction
              </h2>
              <p>
                HappySalary SA (ci-apres &quot;HappySalary&quot;, &quot;nous&quot; ou &quot;notre&quot;) s&apos;engage a proteger la vie privee de ses utilisateurs. La presente politique de confidentialite decrit les donnees personnelles que nous collectons, les finalites de leur traitement et les droits dont vous disposez conformement a la Loi federale suisse sur la protection des donnees (LPD) et au Reglement general sur la protection des donnees (RGPD).
              </p>
            </div>

            {/* Responsible entity */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                2. Responsable du traitement
              </h2>
              <div className="space-y-1">
                <p><strong>HappySalary SA</strong></p>
                <p>Rue du Marche 12, CH-1204 Geneve, Suisse</p>
                <p>E-Mail : privacy@happysalary.ch</p>
              </div>
            </div>

            {/* Data collected */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                3. Donnees collectees
              </h2>
              <p className="mb-3">Nous collectons les categories de donnees suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Donnees d&apos;identification :</strong> nom, prenom, adresse, date de naissance, numero AVS</li>
                <li><strong>Donnees de contact :</strong> adresse e-mail, numero de telephone</li>
                <li><strong>Donnees professionnelles :</strong> informations relatives a l&apos;emploi, salaire, taux d&apos;occupation</li>
                <li><strong>Donnees de connexion :</strong> adresse IP, type de navigateur, pages visitees, date et heure de la visite</li>
                <li><strong>Donnees de paiement :</strong> informations necessaires au traitement des paiements (traitees par notre prestataire Stripe)</li>
              </ul>
            </div>

            {/* Purpose */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                4. Finalites du traitement
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fourniture et gestion du service de paie pour le personnel de maison</li>
                <li>Calcul et declaration des cotisations sociales (AVS/AI/APG/AC)</li>
                <li>Etablissement des contrats de travail et des fiches de salaire</li>
                <li>Affiliation aux assurances obligatoires (LAA)</li>
                <li>Communication avec les utilisateurs et support client</li>
                <li>Amelioration de nos services et de l&apos;experience utilisateur</li>
                <li>Respect des obligations legales et reglementaires</li>
              </ul>
            </div>

            {/* Legal basis */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                5. Base juridique
              </h2>
              <p>
                Le traitement de vos donnees est fonde sur : l&apos;execution du contrat de service, le respect de nos obligations legales (en particulier en matiere de droit du travail et de securite sociale), votre consentement lorsque celui-ci est requis, et nos interets legitimes (amelioration de nos services).
              </p>
            </div>

            {/* Data sharing */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                6. Transmission des donnees
              </h2>
              <p className="mb-3">Vos donnees peuvent etre transmises aux tiers suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Caisses de compensation cantonales (AVS/AI/APG/AC)</li>
                <li>Compagnies d&apos;assurance (LAA, assurance maladie perte de gain)</li>
                <li>Autorites fiscales (impot a la source)</li>
                <li>Prestataires techniques (hebergement, paiement)</li>
              </ul>
              <p className="mt-3">
                Nous ne vendons ni ne louons vos donnees personnelles a des tiers a des fins commerciales.
              </p>
            </div>

            {/* Data storage */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                7. Conservation et securite des donnees
              </h2>
              <p>
                Vos donnees sont hebergees en Suisse aupres de prestataires certifies. Elles sont conservees pendant la duree de la relation contractuelle et pendant les delais de conservation legaux (en general 10 ans pour les documents comptables et de paie). Nous appliquons des mesures de securite techniques et organisationnelles appropriees pour proteger vos donnees contre tout acces non autorise, perte ou destruction.
              </p>
            </div>

            {/* User rights */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                8. Vos droits
              </h2>
              <p className="mb-3">Conformement a la LPD et au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees personnelles</li>
                <li><strong>Droit de rectification :</strong> corriger les donnees inexactes ou incompletes</li>
                <li><strong>Droit a l&apos;effacement :</strong> demander la suppression de vos donnees (sous reserve des obligations legales de conservation)</li>
                <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure et lisible</li>
                <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donnees</li>
              </ul>
              <p className="mt-3">
                Pour exercer vos droits, contactez-nous a : privacy@happysalary.ch
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                9. Cookies
              </h2>
              <p>
                Notre site utilise des cookies techniques necessaires au bon fonctionnement du service. Nous utilisons egalement des cookies d&apos;analyse pour ameliorer votre experience. Vous pouvez gerer vos preferences de cookies a tout moment via les parametres de votre navigateur ou la banniere de consentement affichee lors de votre premiere visite.
              </p>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                10. Modifications
              </h2>
              <p>
                Nous nous reservons le droit de modifier la presente politique de confidentialite a tout moment. Toute modification sera publiee sur cette page. Nous vous encourageons a consulter regulierement cette page.
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
