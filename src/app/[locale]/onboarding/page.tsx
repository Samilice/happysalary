"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const CANTONS = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
  "TI", "UR", "VD", "VS", "ZG", "ZH",
];

const EMPLOYMENT_TYPES = [
  { value: "cleaning", label: "Femme de ménage" },
  { value: "nanny", label: "Nounou" },
  { value: "au_pair", label: "Au pair" },
  { value: "elderly_care", label: "Aide aux personnes âgées" },
  { value: "gardener", label: "Jardinier" },
  { value: "other", label: "Autre" },
];

type EmployerData = {
  first_name: string;
  last_name: string;
  company_name: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_canton: string;
  phone: string;
};

type EmployeeData = {
  first_name: string;
  last_name: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  date_of_birth: string;
  nationality: string;
  avs_number: string;
  permit_type: string;
  job_title: string;
  employment_type: string;
  start_date: string;
  monthly_hours: string;
  hourly_rate: string;
  monthly_salary: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employer, setEmployer] = useState<EmployerData>({
    first_name: "", last_name: "", company_name: "",
    address_street: "", address_city: "", address_postal_code: "",
    address_canton: "VD", phone: "",
  });

  const [employee, setEmployee] = useState<EmployeeData>({
    first_name: "", last_name: "",
    address_street: "", address_city: "", address_postal_code: "",
    date_of_birth: "", nationality: "Suisse", avs_number: "",
    permit_type: "", job_title: "", employment_type: "cleaning",
    start_date: "", monthly_hours: "", hourly_rate: "", monthly_salary: "",
  });

  function updateEmployer(field: keyof EmployerData, value: string) {
    setEmployer((prev) => ({ ...prev, [field]: value }));
  }

  function updateEmployee(field: keyof EmployeeData, value: string) {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  }

  // Auto-calculate monthly salary when hours/rate change
  function handleHoursOrRateChange(field: "monthly_hours" | "hourly_rate", value: string) {
    updateEmployee(field, value);
    const hours = field === "monthly_hours" ? parseFloat(value) : parseFloat(employee.monthly_hours);
    const rate = field === "hourly_rate" ? parseFloat(value) : parseFloat(employee.hourly_rate);
    if (hours && rate) {
      updateEmployee("monthly_salary", (hours * rate).toFixed(2));
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    // Create employer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: employerData, error: empError } = await (supabase as any)
      .from("employers")
      .insert({
        user_id: user.id,
        first_name: employer.first_name,
        last_name: employer.last_name,
        company_name: employer.company_name || null,
        address_street: employer.address_street,
        address_city: employer.address_city,
        address_postal_code: employer.address_postal_code,
        address_canton: employer.address_canton,
        phone: employer.phone || null,
      })
      .select()
      .single();

    if (empError) {
      setError(empError.message);
      setLoading(false);
      return;
    }

    // Create employee
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: eeError } = await (supabase as any).from("employees").insert({
      employer_id: employerData.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      address_street: employee.address_street,
      address_city: employee.address_city,
      address_postal_code: employee.address_postal_code,
      date_of_birth: employee.date_of_birth,
      nationality: employee.nationality,
      avs_number: employee.avs_number,
      permit_type: employee.permit_type || null,
      job_title: employee.job_title,
      employment_type: employee.employment_type as "cleaning" | "nanny" | "au_pair" | "elderly_care" | "gardener" | "other",
      start_date: employee.start_date,
      monthly_hours: parseFloat(employee.monthly_hours),
      hourly_rate: parseFloat(employee.hourly_rate),
      monthly_salary: parseFloat(employee.monthly_salary),
    });

    if (eeError) {
      setError(eeError.message);
      setLoading(false);
      return;
    }

    // Mark onboarding complete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    window.location.href = "/fr/dashboard";
  }

  return (
    <section className="py-12 sm:py-20 min-h-screen bg-gradient-to-b from-background-alt to-background">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s ? "bg-primary text-white" : "bg-border-light text-text-muted"
                }`}>
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                {s < 3 && <div className={`w-12 sm:w-20 h-0.5 ${step > s ? "bg-primary" : "bg-border-light"}`} />}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Étape {step} sur 3
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mt-1">
              {step === 1 && "Vos informations"}
              {step === 2 && "Votre employé(e)"}
              {step === 3 && "Confirmation"}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Employer Info */}
          {step === 1 && (
            <Card hover={false}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Prénom *</label>
                    <input type="text" value={employer.first_name} onChange={(e) => updateEmployer("first_name", e.target.value)} required className={inputClass} placeholder="Jean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Nom *</label>
                    <input type="text" value={employer.last_name} onChange={(e) => updateEmployer("last_name", e.target.value)} required className={inputClass} placeholder="Dupont" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Entreprise <span className="text-text-muted">(optionnel)</span></label>
                  <input type="text" value={employer.company_name} onChange={(e) => updateEmployer("company_name", e.target.value)} className={inputClass} placeholder="Ma Société Sàrl" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Rue et numéro *</label>
                  <input type="text" value={employer.address_street} onChange={(e) => updateEmployer("address_street", e.target.value)} required className={inputClass} placeholder="Rue de la Gare 15" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">NPA *</label>
                    <input type="text" value={employer.address_postal_code} onChange={(e) => updateEmployer("address_postal_code", e.target.value)} required className={inputClass} placeholder="1000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Ville *</label>
                    <input type="text" value={employer.address_city} onChange={(e) => updateEmployer("address_city", e.target.value)} required className={inputClass} placeholder="Lausanne" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Canton *</label>
                    <select value={employer.address_canton} onChange={(e) => updateEmployer("address_canton", e.target.value)} className={inputClass}>
                      {CANTONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Téléphone</label>
                  <input type="tel" value={employer.phone} onChange={(e) => updateEmployer("phone", e.target.value)} className={inputClass} placeholder="+41 79 000 00 00" />
                </div>

                <div className="pt-4">
                  <Button onClick={() => setStep(2)} className="w-full">
                    Continuer
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Employee Info */}
          {step === 2 && (
            <Card hover={false}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Prénom *</label>
                    <input type="text" value={employee.first_name} onChange={(e) => updateEmployee("first_name", e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Nom *</label>
                    <input type="text" value={employee.last_name} onChange={(e) => updateEmployee("last_name", e.target.value)} required className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Rue et numéro *</label>
                  <input type="text" value={employee.address_street} onChange={(e) => updateEmployee("address_street", e.target.value)} required className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">NPA *</label>
                    <input type="text" value={employee.address_postal_code} onChange={(e) => updateEmployee("address_postal_code", e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Ville *</label>
                    <input type="text" value={employee.address_city} onChange={(e) => updateEmployee("address_city", e.target.value)} required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Date de naissance *</label>
                    <input type="date" value={employee.date_of_birth} onChange={(e) => updateEmployee("date_of_birth", e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Nationalité *</label>
                    <input type="text" value={employee.nationality} onChange={(e) => updateEmployee("nationality", e.target.value)} required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Numéro AVS *</label>
                    <input type="text" value={employee.avs_number} onChange={(e) => updateEmployee("avs_number", e.target.value)} required className={inputClass} placeholder="756.XXXX.XXXX.XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Type de permis</label>
                    <input type="text" value={employee.permit_type} onChange={(e) => updateEmployee("permit_type", e.target.value)} className={inputClass} placeholder="B, C, L..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Type d&apos;emploi *</label>
                    <select value={employee.employment_type} onChange={(e) => updateEmployee("employment_type", e.target.value)} className={inputClass}>
                      {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Poste *</label>
                    <input type="text" value={employee.job_title} onChange={(e) => updateEmployee("job_title", e.target.value)} required className={inputClass} placeholder="Aide ménagère" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Date de début *</label>
                  <input type="date" value={employee.start_date} onChange={(e) => updateEmployee("start_date", e.target.value)} required className={inputClass} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Heures/mois *</label>
                    <input type="number" step="0.5" value={employee.monthly_hours} onChange={(e) => handleHoursOrRateChange("monthly_hours", e.target.value)} required className={inputClass} placeholder="40" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Taux horaire *</label>
                    <input type="number" step="0.05" value={employee.hourly_rate} onChange={(e) => handleHoursOrRateChange("hourly_rate", e.target.value)} required className={inputClass} placeholder="28.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Salaire/mois</label>
                    <input type="text" value={employee.monthly_salary ? `CHF ${employee.monthly_salary}` : ""} readOnly className={`${inputClass} bg-background-alt font-semibold`} />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-xl border-2 border-border text-text font-semibold hover:bg-background-alt transition-colors">
                    Retour
                  </button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continuer
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <Card hover={false}>
                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Employeur
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-text-muted">Nom :</span> <strong>{employer.first_name} {employer.last_name}</strong></div>
                  {employer.company_name && <div><span className="text-text-muted">Société :</span> <strong>{employer.company_name}</strong></div>}
                  <div><span className="text-text-muted">Adresse :</span> <strong>{employer.address_street}</strong></div>
                  <div><span className="text-text-muted">Lieu :</span> <strong>{employer.address_postal_code} {employer.address_city} ({employer.address_canton})</strong></div>
                  {employer.phone && <div><span className="text-text-muted">Tél. :</span> <strong>{employer.phone}</strong></div>}
                </div>
              </Card>

              <Card hover={false}>
                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Employé(e)
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-text-muted">Nom :</span> <strong>{employee.first_name} {employee.last_name}</strong></div>
                  <div><span className="text-text-muted">Né(e) le :</span> <strong>{employee.date_of_birth}</strong></div>
                  <div><span className="text-text-muted">Nationalité :</span> <strong>{employee.nationality}</strong></div>
                  <div><span className="text-text-muted">AVS :</span> <strong>{employee.avs_number}</strong></div>
                  <div><span className="text-text-muted">Poste :</span> <strong>{employee.job_title}</strong></div>
                  <div><span className="text-text-muted">Début :</span> <strong>{employee.start_date}</strong></div>
                  <div><span className="text-text-muted">Heures/mois :</span> <strong>{employee.monthly_hours}h</strong></div>
                  <div><span className="text-text-muted">Salaire :</span> <strong>CHF {employee.monthly_salary}</strong></div>
                </div>
              </Card>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 rounded-xl border-2 border-border text-text font-semibold hover:bg-background-alt transition-colors">
                  Modifier
                </button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? "Envoi..." : "Confirmer et continuer"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
