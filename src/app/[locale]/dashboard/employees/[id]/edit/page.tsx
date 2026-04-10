import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { EmployeeForm } from "@/components/dashboard/EmployeeForm";
import { notFound } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("dashboard.employees");
  const supabase = await createClient();

  const { data: employeeData } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (!employeeData) notFound();
  const emp = employeeData as Employee;

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">{t("editEmployee")}</h1>
        <EmployeeForm
          employerId={emp.employer_id}
          mode="edit"
          initialData={{
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            address_street: emp.address_street,
            address_city: emp.address_city,
            address_postal_code: emp.address_postal_code,
            date_of_birth: emp.date_of_birth,
            nationality: emp.nationality,
            avs_number: emp.avs_number,
            permit_type: emp.permit_type || "",
            job_title: emp.job_title,
            employment_type: emp.employment_type,
            start_date: emp.start_date,
            monthly_hours: String(emp.monthly_hours),
            hourly_rate: String(emp.hourly_rate),
            monthly_salary: String(emp.monthly_salary),
          }}
        />
      </div>
    </Container>
  );
}
