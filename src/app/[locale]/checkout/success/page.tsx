import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutSuccessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <Card hover={false}>
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-secondary mb-4">
              Paiement confirme !
            </h1>

            <p className="text-text-muted mb-3">
              Merci pour votre abonnement a HappySalary. Votre compte est maintenant actif.
            </p>

            <p className="text-text-muted mb-8">
              Vous recevrez un e-mail de confirmation avec les instructions pour commencer a configurer votre premier employe.
            </p>

            <div className="space-y-3">
              <Button href="/" size="lg" className="w-full">
                Retour a l&apos;accueil
              </Button>
              <Button href="/contact" variant="ghost" className="w-full">
                Besoin d&apos;aide ?
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
