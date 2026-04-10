import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PayslipGenerateForm } from "@/components/dashboard/PayslipGenerateForm";
import { Link } from "@/i18n/navigation";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export default async function PayslipPage() {
  const t = await getTranslations("dashboard.payslip");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch employer (for canton, address info)
  const { data: employerData } = await supabase
    .from("employers")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const employer = employerData as Employer | null;

  // Check subscription
  const { data: subData } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .single();
  const sub = subData as { plan: string } | null;

  if (!sub) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto">
          <Card hover={false} className="text-center py-16">
            <svg className="w-16 h-16 text-text-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h3 className="text-lg font-bold text-secondary mb-2">{t("subscriptionRequired")}</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
              {t("subscriptionMessage")}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
            >
              {t("viewPlans")}
            </Link>
          </Card>
        </div>
      </Container>
    );
  }

  // Fetch employees
  const { data: employeesData } = await supabase
    .from("employees")
    .select("id, first_name, last_name, address_street, address_city, address_postal_code, date_of_birth, avs_number, job_title, monthly_hours, hourly_rate, monthly_salary")
    .eq("employer_id", employer?.id || "")
    .eq("is_active", true);
  const employees = (employeesData || []) as Employee[];

  if (employees.length === 0) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-secondary mb-2">{t("pageTitle")}</h1>
          <p className="text-sm text-text-muted mb-6">{t("subtitle")}</p>
          <Card hover={false} className="text-center py-12">
            <svg className="w-14 h-14 text-text-light mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm text-text-muted mb-4">{t("noEmployees")}</p>
            <Link
              href="/dashboard/employees"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              {t("addEmployee")}
            </Link>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary">{t("pageTitle")}</h1>
          <p className="text-sm text-text-muted mt-1">{t("subtitle")}</p>
        </div>
        <PayslipGenerateForm
          employees={employees.map((e) => ({
            id: e.id,
            first_name: e.first_name,
            last_name: e.last_name,
            monthly_hours: e.monthly_hours,
            hourly_rate: Number(e.hourly_rate),
            monthly_salary: Number(e.monthly_salary),
            avs_number: e.avs_number,
            address_street: e.address_street,
            address_city: e.address_city,
            address_postal_code: e.address_postal_code,
            date_of_birth: e.date_of_birth,
            job_title: e.job_title,
          }))}
          employer={{
            first_name: employer?.first_name || "",
            last_name: employer?.last_name || "",
            company_name: employer?.company_name || null,
            address_street: employer?.address_street || "",
            address_city: employer?.address_city || "",
            address_postal_code: employer?.address_postal_code || "",
            address_canton: employer?.address_canton || "",
            phone: employer?.phone || "",
          }}
        />
      </div>
    </Container>
  );
}
