import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import type { Database } from "@/lib/database.types";

type ClientOverview = Database["public"]["Views"]["admin_client_overview"]["Row"];

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("admin_client_overview")
    .select("*")
    .order("registered_at", { ascending: false });
  const clients = (data || []) as ClientOverview[];

  // Compute metrics
  const total = clients.length;
  const withOnboarding = clients.filter((c) => c.onboarding_completed).length;
  const activeSubs = clients.filter((c) => c.subscription_status === "active").length;
  const totalEmployees = clients.reduce((sum, c) => sum + (c.active_employee_count || 0), 0);
  const onboardingRate = total > 0 ? Math.round((withOnboarding / total) * 100) : 0;
  const conversionRate = total > 0 ? Math.round((activeSubs / total) * 100) : 0;

  // Plans breakdown
  const planCounts: Record<string, number> = {};
  clients.forEach((c) => {
    if (c.subscription_plan) {
      planCounts[c.subscription_plan] = (planCounts[c.subscription_plan] || 0) + 1;
    }
  });

  // Canton breakdown
  const cantonCounts: Record<string, number> = {};
  clients.forEach((c) => {
    if (c.address_canton) {
      cantonCounts[c.address_canton] = (cantonCounts[c.address_canton] || 0) + 1;
    }
  });
  const topCantons = Object.entries(cantonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Recent signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSignups = clients.filter(
    (c) => new Date(c.registered_at) >= thirtyDaysAgo
  ).length;

  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">Analytics</h1>

        {/* Key metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-primary">{onboardingRate}%</p>
            <p className="text-xs text-text-muted mt-1">Taux onboarding</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-success">{conversionRate}%</p>
            <p className="text-xs text-text-muted mt-1">Taux de conversion</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-secondary">{recentSignups}</p>
            <p className="text-xs text-text-muted mt-1">Inscriptions (30j)</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-primary">{totalEmployees}</p>
            <p className="text-xs text-text-muted mt-1">Employes total</p>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Plans breakdown */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Plans actifs</h2>
            {Object.keys(planCounts).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(planCounts).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-sm font-medium text-text">{plan}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(10, (count / total) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-secondary w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Aucun abonnement actif.</p>
            )}
          </Card>

          {/* Top cantons */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Top cantons</h2>
            {topCantons.length > 0 ? (
              <div className="space-y-3">
                {topCantons.map(([canton, count]) => (
                  <div key={canton} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">{canton}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${Math.max(10, (count / total) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-secondary w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Aucune donnee canton.</p>
            )}
          </Card>
        </div>

        {/* Funnel */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-secondary mb-4">Funnel</h2>
          <div className="space-y-4">
            <FunnelStep label="Inscrits" value={total} maxValue={total} color="bg-primary/20" />
            <FunnelStep label="Onboarding termine" value={withOnboarding} maxValue={total} color="bg-primary/40" />
            <FunnelStep label="Abonnement actif" value={activeSubs} maxValue={total} color="bg-primary/70" />
            <FunnelStep label="Avec employes" value={clients.filter((c) => (c.active_employee_count || 0) > 0).length} maxValue={total} color="bg-primary" />
          </div>
        </Card>
      </div>
    </Container>
  );
}

function FunnelStep({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text">{label}</span>
        <span className="font-bold text-secondary">{value} <span className="font-normal text-text-muted text-xs">({Math.round(pct)}%)</span></span>
      </div>
      <div className="h-3 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
    </div>
  );
}
