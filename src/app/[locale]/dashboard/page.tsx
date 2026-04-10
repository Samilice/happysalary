import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export default async function DashboardPage() {
  const t = await getTranslations("dashboard.home");
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
    .select("*")
    .eq("employer_id", employer?.id || "")
    .eq("is_active", true);
  const employees = (employeesData || []) as Employee[];

  const { data: documentsData } = await supabase
    .from("documents")
    .select("*")
    .in("employee_id", employees.map((e) => e.id))
    .order("created_at", { ascending: false })
    .limit(5);
  const documents = (documentsData || []) as Document[];

  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .single();
  const subscription = subscriptionData as Subscription | null;

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          {t("greeting")}{employer?.first_name || ""}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-primary">{employees?.length || 0}</p>
            <p className="text-xs text-text-muted mt-1">{t("activeEmployees")}</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-secondary">{documents?.length || 0}</p>
            <p className="text-xs text-text-muted mt-1">{t("documents")}</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-success capitalize">{subscription?.plan || "—"}</p>
            <p className="text-xs text-text-muted mt-1">{t("currentPlan")}</p>
          </Card>
          <Card hover={false} className="text-center p-4">
            <p className="text-3xl font-bold text-success">
              {subscription?.status === "active" ? t("statusActive") : "—"}
            </p>
            <p className="text-xs text-text-muted mt-1">{t("status")}</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Employees */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">{t("myEmployees")}</h2>
              <Link href="/dashboard/employees" className="text-sm text-primary font-medium hover:underline">
                {t("viewAll")}
              </Link>
            </div>
            {employees && employees.length > 0 ? (
              <div className="space-y-3">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-background-alt">
                    <div>
                      <p className="font-medium text-sm text-text">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-text-muted">{emp.job_title}</p>
                    </div>
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      {t("statusActive")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">{t("noEmployees")}</p>
            )}
          </Card>

          {/* Recent documents */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">{t("recentDocuments")}</h2>
              <Link href="/dashboard/documents" className="text-sm text-primary font-medium hover:underline">
                {t("viewAll")}
              </Link>
            </div>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-background-alt">
                    <div>
                      <p className="font-medium text-sm text-text">{doc.title}</p>
                      <p className="text-xs text-text-muted">
                        {doc.type === "salary_sheet" ? t("salarySheet") : doc.type === "employment_contract" ? t("contract") : doc.type}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      doc.status === "ready" ? "text-success bg-success/10" :
                      doc.status === "pending" ? "text-amber-600 bg-amber-50" :
                      "text-text-muted bg-border-light"
                    }`}>
                      {doc.status === "ready" ? t("statusReady") : doc.status === "pending" ? t("statusPending") : doc.status === "generating" ? t("statusGenerating") : doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <svg className="w-12 h-12 text-text-light mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm text-text-muted">{t("documentsWillAppear")}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
}
