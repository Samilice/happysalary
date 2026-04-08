import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { plans } from "@/lib/plans";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { plan: planId } = await searchParams;
  const selectedPlan = plans.find((p) => p.id === planId) || plans[1];

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <Card hover={false}>
            <Badge variant="accent" className="mb-6">Checkout</Badge>

            <h1 className="text-3xl font-bold text-secondary mb-4">
              Checkout Coming Soon
            </h1>

            <p className="text-text-muted mb-8">
              Our secure checkout is currently being set up. You will soon be able to subscribe to the {selectedPlan.id.charAt(0).toUpperCase() + selectedPlan.id.slice(1)} plan.
            </p>

            {/* Plan Summary */}
            <div className="rounded-xl bg-background-alt border border-border p-6 mb-8">
              <h2 className="text-lg font-bold text-secondary mb-1">
                {selectedPlan.id.charAt(0).toUpperCase() + selectedPlan.id.slice(1)}
              </h2>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-secondary">
                  CHF {selectedPlan.price.toFixed(2)}
                </span>
                <span className="text-text-muted text-sm">/mois</span>
              </div>
              <ul className="text-sm text-text-muted space-y-1 mt-4">
                {selectedPlan.features
                  .filter((f) => f.included)
                  .map((f) => (
                    <li key={f.key} className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f.key}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/pricing" variant="outline">
                Back to Pricing
              </Button>
              <Button href="/contact">
                Contact Us
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
