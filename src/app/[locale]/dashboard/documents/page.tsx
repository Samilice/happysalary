import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import type { Database } from "@/lib/database.types";
import { getTranslations } from "next-intl/server";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

export default async function DocumentsPage() {
  const t = await getTranslations("dashboard.documentsPage");

  const typeLabels: Record<string, string> = {
    salary_sheet: t("typeSalarySheet"),
    employment_contract: t("typeContract"),
    annual_statement: t("typeAnnualStatement"),
    other: t("typeOther"),
  };

  const statusLabels: Record<string, { label: string; className: string }> = {
    pending: { label: t("statusPending"), className: "text-amber-600 bg-amber-50" },
    generating: { label: t("statusGenerating"), className: "text-blue-600 bg-blue-50" },
    ready: { label: t("statusReady"), className: "text-success bg-success/10" },
    sent: { label: t("statusSent"), className: "text-primary bg-primary/10" },
  };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: employerData } = await supabase
    .from("employers")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const employer = employerData as Employer | null;

  const { data: employeesData } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("employer_id", employer?.id || "");
  const employees = (employeesData || []) as Pick<Database["public"]["Tables"]["employees"]["Row"], "id" | "first_name" | "last_name">[];

  const employeeIds = employees.map((e) => e.id);
  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, `${e.first_name} ${e.last_name}`]));

  const { data: documentsData } = await supabase
    .from("documents")
    .select("*")
    .in("employee_id", employeeIds.length > 0 ? employeeIds : ["none"])
    .order("created_at", { ascending: false });
  const documents = (documentsData || []) as Document[];

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">{t("title")}</h1>

        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => {
              const status = statusLabels[doc.status] || statusLabels.pending;
              return (
                <Card key={doc.id} hover={false}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-text">{doc.title}</p>
                        <p className="text-xs text-text-muted">
                          {typeLabels[doc.type] || doc.type} — {employeeMap[doc.employee_id] || ""}
                          {doc.period_month && doc.period_year && ` — ${String(doc.period_month).padStart(2, "0")}/${doc.period_year}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                      {doc.status === "ready" && doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                          {t("download")}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card hover={false} className="text-center py-16">
            <svg className="w-16 h-16 text-text-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="text-lg font-bold text-secondary mb-2">{t("noDocuments")}</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              {t("noDocumentsDesc")}
            </p>
          </Card>
        )}
      </div>
    </Container>
  );
}
