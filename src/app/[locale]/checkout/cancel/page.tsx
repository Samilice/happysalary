import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutCancelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <Card hover={false}>
            {/* Cancel Icon */}
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-accent-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-secondary mb-4">
              Paiement annule
            </h1>

            <p className="text-text-muted mb-3">
              Votre paiement a ete annule. Aucun montant n&apos;a ete debite de votre compte.
            </p>

            <p className="text-text-muted mb-8">
              Vous pouvez revenir a nos tarifs pour choisir un autre plan ou nous contacter si vous avez des questions.
            </p>

            <div className="space-y-3">
              <Button href="/pricing" size="lg" className="w-full">
                Voir les tarifs
              </Button>
              <Button href="/" variant="outline" className="w-full">
                Retour a l&apos;accueil
              </Button>
              <Button href="/contact" variant="ghost" className="w-full">
                Nous contacter
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
