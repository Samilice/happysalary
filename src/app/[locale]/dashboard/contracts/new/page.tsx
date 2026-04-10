import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ContractGenerateForm } from "@/components/dashboard/ContractGenerateForm";
import { Link } from "@/i18n/navigation";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export default async function NewContractPage() {
  const t = await getTranslations("dashboard.contracts");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: employerData } = await supabase
    .from("employers")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const employer = employerData as Employer | null;

  // Check subscription plan
  const { data: subData } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .single();
  const sub = subData as { plan: string } | null;
  const isPro = sub?.plan === "pro" || sub?.plan === "comfort" || sub?.plan === "premium";

  if (!isPro) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto">
          <Card hover={false} className="text-center py-16">
            <svg className="w-16 h-16 text-text-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h3 className="text-lg font-bold text-secondary mb-2">{t("proOnly")}</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
              {t("upgradeMessage")}
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

  const { data: employeesData } = await supabase
    .from("employees")
    .select("id, first_name, last_name, address_street, address_city, address_postal_code, date_of_birth, nationality, avs_number, job_title, monthly_hours, monthly_salary, start_date")
    .eq("employer_id", employer?.id || "")
    .eq("is_active", true);

  const employees = (employeesData || []) as Employee[];

  if (employees.length === 0) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-secondary mb-6">{t("title")}</h1>
          <Card hover={false} className="text-center py-12">
            <p className="text-text-muted mb-4">{t("noEmployees")}</p>
            <Link
              href="/dashboard/employees/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              {t("addEmployeeFirst")}
            </Link>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">{t("title")}</h1>
        <ContractGenerateForm
          employees={employees.map((e) => ({
            id: e.id,
            first_name: e.first_name,
            last_name: e.last_name,
            address_street: e.address_street,
            address_city: e.address_city,
            address_postal_code: e.address_postal_code,
            date_of_birth: e.date_of_birth,
            nationality: e.nationality,
            avs_number: e.avs_number,
            job_title: e.job_title,
            monthly_hours: e.monthly_hours,
            monthly_salary: Number(e.monthly_salary),
            start_date: e.start_date,
          }))}
          employer={{
            first_name: employer?.first_name || "",
            last_name: employer?.last_name || "",
            company: employer?.company_name || null,
            address_street: employer?.address_street || "",
            address_city: employer?.address_city || "",
            address_postal_code: employer?.address_postal_code || "",
            phone: employer?.phone || "",
          }}
        />
      </div>
    </Container>
  );
}
