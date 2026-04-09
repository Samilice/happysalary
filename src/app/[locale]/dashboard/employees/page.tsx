import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import type { Database } from "@/lib/database.types";

type Employer = Database["public"]["Tables"]["employers"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export default async function EmployeesPage() {
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
          <h1 className="text-2xl font-bold text-secondary">Mes employés</h1>
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
                  <div className="flex flex-wrap gap-3 sm:gap-6 text-sm">
                    <div>
                      <span className="text-text-muted">Heures : </span>
                      <strong>{emp.monthly_hours}h/mois</strong>
                    </div>
                    <div>
                      <span className="text-text-muted">Salaire : </span>
                      <strong>CHF {Number(emp.monthly_salary).toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        emp.is_active ? "text-success bg-success/10" : "text-red-500 bg-red-50"
                      }`}>
                        {emp.is_active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card hover={false} className="text-center py-12">
            <p className="text-text-muted">Aucun employé enregistré.</p>
          </Card>
        )}
      </div>
    </Container>
  );
}
