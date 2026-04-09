import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const profile = profileData as Profile | null;
  const { data: employerData } = await supabase.from("employers").select("*").eq("user_id", user!.id).single();
  const employer = employerData as Employer | null;
  const { data: subscriptionData } = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).eq("status", "active").single();
  const subscription = subscriptionData as Subscription | null;

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">Paramètres</h1>

        <div className="space-y-6">
          {/* Account */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Compte</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Email</span>
                <span className="font-medium">{profile?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Nom</span>
                <span className="font-medium">{profile?.full_name || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">Inscrit le</span>
                <span className="font-medium">{new Date(profile?.created_at || "").toLocaleDateString("fr-CH")}</span>
              </div>
            </div>
          </Card>

          {/* Employer */}
          {employer && (
            <Card hover={false}>
              <h2 className="text-lg font-bold text-secondary mb-4">Informations employeur</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Nom</span>
                  <span className="font-medium">{employer.first_name} {employer.last_name}</span>
                </div>
                {employer.company_name && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted">Société</span>
                    <span className="font-medium">{employer.company_name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Adresse</span>
                  <span className="font-medium text-right">{employer.address_street}, {employer.address_postal_code} {employer.address_city} ({employer.address_canton})</span>
                </div>
                {employer.phone && (
                  <div className="flex justify-between py-2">
                    <span className="text-text-muted">Téléphone</span>
                    <span className="font-medium">{employer.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Subscription */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Abonnement</h2>
            {subscription ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Plan</span>
                  <span className="font-medium capitalize">{subscription.plan}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-muted">Statut</span>
                  <span className="font-medium text-success">Actif</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Aucun abonnement actif.</p>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
}
