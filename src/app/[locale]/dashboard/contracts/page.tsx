import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/lib/database.types";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export default async function ContractsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: employerRow } = await supabase
    .from("employers")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const employer = employerRow as Database["public"]["Tables"]["employers"]["Row"] | null;

  type Employee = Database["public"]["Tables"]["employees"]["Row"];

  // Fetch employees for this employer
  const { data: empData } = await supabase
    .from("employees")
    .select("*")
    .eq("employer_id", employer?.id || "");
  const employees = (empData || []) as Employee[];
  const employeeIds = employees.map((e) => e.id);
  const employeeNames = Object.fromEntries(
    employees.map((e) => [e.id, `${e.first_name} ${e.last_name}`])
  );

  // Fetch contracts (documents of type employment_contract)
  const { data: contractsData } = employeeIds.length > 0
    ? await supabase
        .from("documents")
        .select("*")
        .in("employee_id", employeeIds)
        .eq("type", "employment_contract")
        .order("created_at", { ascending: false })
    : { data: [] };
  const contracts = (contractsData || []) as Document[];

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-secondary">Contrats de travail</h1>
          <Button href="/dashboard/contracts/new" size="sm">
            + Générer un contrat
          </Button>
        </div>

        {contracts.length > 0 ? (
          <div className="space-y-4">
            {contracts.map((doc) => (
              <Card key={doc.id} hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">
                        {employeeNames[doc.employee_id] || "Employé"}
                      </h3>
                      <p className="text-xs text-text-muted">
                        Créé le {new Date(doc.created_at).toLocaleDateString("fr-CH")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-success bg-success/10">
                      {doc.status === "ready" ? "Généré" : doc.status}
                    </span>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-dark font-medium px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
                      >
                        Télécharger
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card hover={false} className="text-center py-16">
            <svg className="w-16 h-16 text-text-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <h3 className="text-lg font-bold text-secondary mb-2">Aucun contrat généré</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
              Générez un contrat de travail conforme au droit suisse pour votre employé.
            </p>
            <Button href="/dashboard/contracts/new" size="sm">
              + Générer un contrat
            </Button>
          </Card>
        )}
      </div>
    </Container>
  );
}
