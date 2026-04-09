import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import type { Database } from "@/lib/database.types";
import { getChecklistSteps } from "@/lib/checklist";
import { ChecklistClient } from "@/components/dashboard/ChecklistClient";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export default async function ChecklistPage() {
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
    .eq("employer_id", employer?.id || "none")
    .eq("is_active", true);
  const employees = (employeesData || []) as Employee[];

  // Get checklist progress for all employees
  const employeeIds = employees.map((e) => e.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progressData } = await (supabase as any)
    .from("checklist_progress")
    .select("*")
    .in("employee_id", employeeIds.length > 0 ? employeeIds : ["none"]);

  const progress = (progressData || []) as Database["public"]["Tables"]["checklist_progress"]["Row"][];

  // Build checklist for each employee
  const employeeChecklists = employees.map((emp) => {
    const steps = getChecklistSteps(employer?.address_canton || "VD", emp.employment_type);
    const empProgress = progress.filter((p) => p.employee_id === emp.id);
    const completedKeys = new Set(empProgress.filter((p) => p.completed).map((p) => p.step_key));
    const completedCount = steps.filter((s) => completedKeys.has(s.key)).length;
    const percentage = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

    return {
      employee: emp,
      steps,
      completedKeys: Array.from(completedKeys),
      completedCount,
      totalSteps: steps.length,
      percentage,
    };
  });

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Démarches employeur</h1>
          <p className="text-sm text-text-muted mt-1">
            Suivez pas à pas les démarches pour employer correctement votre personnel de maison.
          </p>
        </div>

        {employeeChecklists.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <p className="text-text-muted">Aucun employé actif. Ajoutez un employé pour voir votre checklist.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {employeeChecklists.map((ec) => (
              <ChecklistClient
                key={ec.employee.id}
                employee={ec.employee}
                steps={ec.steps}
                completedKeys={ec.completedKeys}
                percentage={ec.percentage}
                completedCount={ec.completedCount}
                totalSteps={ec.totalSteps}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
