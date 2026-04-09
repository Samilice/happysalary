import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { EmployeeActions } from "@/components/admin/EmployeeActions";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

type Props = {
  params: Promise<{ clientId: string }>;
};

const employmentTypeLabels: Record<string, string> = {
  cleaning: "Femme de ménage",
  nanny: "Nounou",
  au_pair: "Au pair",
  elderly_care: "Aide personnes âgées",
  gardener: "Jardinier",
  other: "Autre",
};

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", clientId)
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const { data: employerData } = await supabase
    .from("employers")
    .select("*")
    .eq("user_id", clientId)
    .single();
  const employer = employerData as Employer | null;

  const { data: employeesData } = await supabase
    .from("employees")
    .select("*")
    .eq("employer_id", employer?.id || "none")
    .order("created_at", { ascending: false });
  const employees = (employeesData || []) as Employee[];

  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  const subscription = subscriptionData as Subscription | null;

  const employeeIds = employees.map((e) => e.id);
  const { data: documentsData } = await supabase
    .from("documents")
    .select("*")
    .in("employee_id", employeeIds.length > 0 ? employeeIds : ["none"])
    .order("created_at", { ascending: false });
  const documents = (documentsData || []) as Document[];

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-text-muted hover:text-text">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-secondary">
            {employer ? `${employer.first_name} ${employer.last_name}` : profile.full_name || profile.email}
          </h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            profile.onboarding_completed ? "text-success bg-success/10" : "text-amber-600 bg-amber-50"
          }`}>
            {profile.onboarding_completed ? "Complet" : "Onboarding en cours"}
          </span>
        </div>

        <div className="space-y-6">
          {/* Profile & Subscription */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card hover={false}>
              <h2 className="text-lg font-bold text-secondary mb-4">Compte</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Email</span><span className="font-medium">{profile.email}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Inscrit le</span><span className="font-medium">{new Date(profile.created_at).toLocaleDateString("fr-CH")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Rôle</span><span className="font-medium capitalize">{profile.role}</span></div>
              </div>
            </Card>

            <Card hover={false}>
              <h2 className="text-lg font-bold text-secondary mb-4">Abonnement</h2>
              {subscription ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Plan</span><span className="font-medium capitalize">{subscription.plan}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Statut</span><span className={`font-medium ${subscription.status === "active" ? "text-success" : "text-red-500"}`}>{subscription.status}</span></div>
                  {subscription.stripe_subscription_id && <div className="flex justify-between"><span className="text-text-muted">Stripe ID</span><span className="font-mono text-xs">{subscription.stripe_subscription_id}</span></div>}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Aucun abonnement.</p>
              )}
            </Card>
          </div>

          {/* Employer details */}
          {employer && (
            <Card hover={false}>
              <h2 className="text-lg font-bold text-secondary mb-4">Informations employeur</h2>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Prénom</span><span className="font-medium">{employer.first_name}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Nom</span><span className="font-medium">{employer.last_name}</span></div>
                {employer.company_name && <div className="flex justify-between"><span className="text-text-muted">Société</span><span className="font-medium">{employer.company_name}</span></div>}
                <div className="flex justify-between"><span className="text-text-muted">Adresse</span><span className="font-medium">{employer.address_street}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Lieu</span><span className="font-medium">{employer.address_postal_code} {employer.address_city}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Canton</span><span className="font-medium">{employer.address_canton}</span></div>
                {employer.phone && <div className="flex justify-between"><span className="text-text-muted">Téléphone</span><span className="font-medium">{employer.phone}</span></div>}
              </div>
            </Card>
          )}

          {/* Employees */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">
              Employés ({employees?.length || 0})
            </h2>
            {employees && employees.length > 0 ? (
              <div className="space-y-4">
                {employees.map((emp) => (
                  <div key={emp.id} className="p-4 rounded-xl bg-background-alt">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{emp.first_name.charAt(0)}{emp.last_name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-text">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-text-muted">{employmentTypeLabels[emp.employment_type] || emp.employment_type} — {emp.job_title}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${emp.is_active ? "text-success bg-success/10" : "text-red-500 bg-red-50"}`}>
                        {emp.is_active ? "Actif" : "Inactif"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                      <div><span className="text-text-muted">AVS</span><p className="font-medium font-mono">{emp.avs_number}</p></div>
                      <div><span className="text-text-muted">Né(e) le</span><p className="font-medium">{new Date(emp.date_of_birth).toLocaleDateString("fr-CH")}</p></div>
                      <div><span className="text-text-muted">Heures/mois</span><p className="font-medium">{emp.monthly_hours}h</p></div>
                      <div><span className="text-text-muted">Salaire</span><p className="font-medium">CHF {Number(emp.monthly_salary).toFixed(2)}</p></div>
                    </div>

                    <EmployeeActions employee={{ id: emp.id, first_name: emp.first_name, last_name: emp.last_name }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Aucun employé enregistré.</p>
            )}
          </Card>

          {/* Documents */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">
              Documents ({documents?.length || 0})
            </h2>
            {documents && documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-background-alt text-sm">
                    <div>
                      <p className="font-medium text-text">{doc.title}</p>
                      <p className="text-xs text-text-muted">{doc.type} — {doc.status}</p>
                    </div>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium">
                        Voir
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-text-muted">Aucun document généré.</p>
                <p className="text-xs text-text-muted mt-1 italic">Les boutons ci-dessus permettront de générer des documents pour chaque employé.</p>
              </div>
            )}

            {/* Preview area placeholder */}
            <div className="mt-6 border-2 border-dashed border-border rounded-xl p-8 text-center">
              <svg className="w-12 h-12 text-text-light mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium text-text-muted">Prévisualisation des documents</p>
              <p className="text-xs text-text-muted mt-1">Le PDF généré apparaîtra ici avant envoi au client.</p>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
