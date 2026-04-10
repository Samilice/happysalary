import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ToggleActiveButton } from "@/components/dashboard/ToggleActiveButton";
import { getTranslations } from "next-intl/server";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export default async function EmployeesPage() {
  const t = await getTranslations("dashboard.employees");
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
    .order("created_at", { ascending: false });
  const employees = (employeesData || []) as Employee[];

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
          <Button href="/dashboard/employees/new" size="sm">
            {t("addEmployee")}
          </Button>
        </div>

        {employees && employees.length > 0 ? (
          <div className="space-y-4">
            {employees.map((emp) => (
              <Card key={emp.id} hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary">{emp.first_name} {emp.last_name}</h3>
                      <p className="text-sm text-text-muted">{emp.job_title}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                    <div>
                      <span className="text-text-muted">{t("hours")} : </span>
                      <strong>{emp.monthly_hours}{t("hPerMonth")}</strong>
                    </div>
                    <div>
                      <span className="text-text-muted">{t("salary")} : </span>
                      <strong>CHF {Number(emp.monthly_salary).toFixed(2)}</strong>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      emp.is_active ? "text-success bg-success/10" : "text-red-500 bg-red-50"
                    }`}>
                      {emp.is_active ? t("active") : t("inactive")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/employees/${emp.id}/edit`}
                        className="text-xs text-primary hover:text-primary-dark font-medium px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
                      >
                        {t("edit")}
                      </Link>
                      <ToggleActiveButton employeeId={emp.id} isActive={emp.is_active} activateLabel={t("activate")} deactivateLabel={t("deactivate")} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card hover={false} className="text-center py-12">
            <p className="text-text-muted mb-4">{t("noEmployees")}</p>
            <Button href="/dashboard/employees/new" size="sm">
              {t("addEmployee")}
            </Button>
          </Card>
        )}
      </div>
    </Container>
  );
}
