import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { EmployeeForm } from "@/components/dashboard/EmployeeForm";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];

export default async function NewEmployeePage() {
  const t = await getTranslations("dashboard.employees");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: employerData } = await supabase
    .from("employers")
    .select("id")
    .eq("user_id", user!.id)
    .single();
  const employer = employerData as Pick<Employer, "id"> | null;

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">{t("newEmployee")}</h1>
        <EmployeeForm employerId={employer?.id || ""} mode="create" />
      </div>
    </Container>
  );
}
