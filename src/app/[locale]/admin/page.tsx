import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { Database } from "@/lib/database.types";

type ClientOverview = Database["public"]["Views"]["admin_client_overview"]["Row"];

export default async function AdminPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("admin_client_overview")
    .select("*")
    .order("registered_at", { ascending: false });
  const clients = (data || []) as ClientOverview[];

  const totalClients = clients?.length || 0;
  const completedOnboarding = clients?.filter((c) => c.onboarding_completed).length || 0;
  const activeSubscriptions = clients?.filter((c) => c.subscription_status === "active").length || 0;
  const totalEmployees = clients?.reduce((sum, c) => sum + (c.active_employee_count || 0), 0) || 0;

  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">Administration</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-primary">{totalClients}</p>
            <p className="text-xs text-text-muted mt-1">Clients inscrits</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-success">{completedOnboarding}</p>
            <p className="text-xs text-text-muted mt-1">Onboarding terminé</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-secondary">{activeSubscriptions}</p>
            <p className="text-xs text-text-muted mt-1">Abonnements actifs</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-primary">{totalEmployees}</p>
            <p className="text-xs text-text-muted mt-1">Employés gérés</p>
          </Card>
        </div>

        {/* Client list */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-secondary mb-4">Tous les clients</h2>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-text-muted">Client</th>
                  <th className="pb-3 font-medium text-text-muted">Canton</th>
                  <th className="pb-3 font-medium text-text-muted">Employés</th>
                  <th className="pb-3 font-medium text-text-muted">Plan</th>
                  <th className="pb-3 font-medium text-text-muted">Statut</th>
                  <th className="pb-3 font-medium text-text-muted">Onboarding</th>
                  <th className="pb-3 font-medium text-text-muted">Inscrit le</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {clients?.map((client) => (
                  <tr key={client.user_id} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-text">
                          {client.employer_first_name ? `${client.employer_first_name} ${client.employer_last_name}` : client.full_name || "—"}
                        </p>
                        <p className="text-xs text-text-muted">{client.email}</p>
                      </div>
                    </td>
                    <td className="py-3">{client.address_canton || "—"}</td>
                    <td className="py-3">{client.active_employee_count || 0}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        client.subscription_plan ? "text-primary bg-primary/10" : "text-text-muted bg-border-light"
                      }`}>
                        {client.subscription_plan || "Aucun"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        client.subscription_status === "active" ? "text-success bg-success/10" : "text-text-muted bg-border-light"
                      }`}>
                        {client.subscription_status === "active" ? "Actif" : client.subscription_status || "—"}
                      </span>
                    </td>
                    <td className="py-3">
                      {client.onboarding_completed ? (
                        <span className="text-success">&#10003;</span>
                      ) : (
                        <span className="text-amber-500">En cours</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-text-muted">
                      {new Date(client.registered_at).toLocaleDateString("fr-CH")}
                    </td>
                    <td className="py-3">
                      <Link href={`/admin/clients/${client.user_id}`} className="text-xs text-primary font-medium hover:underline">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {clients?.map((client) => (
              <Link key={client.user_id} href={`/admin/clients/${client.user_id}`} className="block p-3 rounded-xl bg-background-alt hover:bg-primary/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-text">
                    {client.employer_first_name ? `${client.employer_first_name} ${client.employer_last_name}` : client.full_name || "—"}
                  </p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                    client.subscription_plan ? "text-primary bg-primary/10" : "text-text-muted bg-white"
                  }`}>
                    {client.subscription_plan || "Aucun"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{client.email}</span>
                  <span>{client.active_employee_count || 0} employé(s)</span>
                  {client.onboarding_completed ? (
                    <span className="text-success">&#10003;</span>
                  ) : (
                    <span className="text-amber-500">Onboarding...</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {(!clients || clients.length === 0) && (
            <p className="text-sm text-text-muted text-center py-8">Aucun client pour le moment.</p>
          )}
        </Card>
      </div>
    </Container>
  );
}
