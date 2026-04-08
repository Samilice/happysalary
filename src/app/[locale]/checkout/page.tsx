import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <Card>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary mb-4">Checkout</h1>
            <p className="text-text-muted mb-8">
              Notre solution de paiement sera bientot disponible. En attendant, contactez-nous pour souscrire.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/contact">Nous contacter</Button>
              <Button href="/pricing" variant="outline">Voir les tarifs</Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
