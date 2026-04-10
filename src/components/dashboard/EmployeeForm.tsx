"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const CANTONS = [
  "AG","AI","AR","BE","BL","BS","FR","GE","GL","GR",
  "JU","LU","NE","NW","OW","SG","SH","SO","SZ","TG",
  "TI","UR","VD","VS","ZG","ZH",
];

const EMPLOYMENT_TYPE_KEYS = ["cleaning","nanny","au_pair","elderly_care","gardener","other"] as const;

type EmployeeData = {
  id?: string;
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

type Props = {
  employerId: string;
  initialData?: EmployeeData;
  mode: "create" | "edit";
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm";

export function EmployeeForm({ employerId, initialData, mode }: Props) {
  const t = useTranslations("dashboard.employees");
  const te = useTranslations("onboarding.employee");
  const tet = useTranslations("onboarding.employmentTypes");
  const locale = useLocale();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EmployeeData>(
    initialData || {
      first_name: "", last_name: "",
      address_street: "", address_city: "", address_postal_code: "",
      date_of_birth: "", nationality: "", avs_number: "",
      permit_type: "", job_title: "", employment_type: "cleaning",
      start_date: "", monthly_hours: "", hourly_rate: "", monthly_salary: "",
    }
  );

  function update(field: keyof EmployeeData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleHoursOrRateChange(field: "monthly_hours" | "hourly_rate", value: string) {
    update(field, value);
    const hours = field === "monthly_hours" ? parseFloat(value) : parseFloat(form.monthly_hours);
    const rate = field === "hourly_rate" ? parseFloat(value) : parseFloat(form.hourly_rate);
    if (hours && rate) {
      update("monthly_salary", (hours * rate).toFixed(2));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      address_street: form.address_street,
      address_city: form.address_city,
      address_postal_code: form.address_postal_code,
      date_of_birth: form.date_of_birth,
      nationality: form.nationality,
      avs_number: form.avs_number,
      permit_type: form.permit_type || null,
      job_title: form.job_title,
      employment_type: form.employment_type as "cleaning" | "nanny" | "au_pair" | "elderly_care" | "gardener" | "other",
      start_date: form.start_date,
      monthly_hours: parseFloat(form.monthly_hours),
      hourly_rate: parseFloat(form.hourly_rate),
      monthly_salary: parseFloat(form.monthly_salary),
    };

    if (mode === "create") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any).from("employees").insert({
        ...payload,
        employer_id: employerId,
      });
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any).from("employees").update(payload).eq("id", form.id);
      if (err) { setError(err.message); setLoading(false); return; }
    }

    window.location.href = `/${locale}/dashboard/employees`;
  }

  return (
    <Card hover={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("firstName")} *</label>
            <input type="text" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("lastName")} *</label>
            <input type="text" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{te("street")} *</label>
          <input type="text" value={form.address_street} onChange={(e) => update("address_street", e.target.value)} required className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("postalCode")} *</label>
            <input type="text" value={form.address_postal_code} onChange={(e) => update("address_postal_code", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("city")} *</label>
            <input type="text" value={form.address_city} onChange={(e) => update("address_city", e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("dateOfBirth")} *</label>
            <input type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("nationality")} *</label>
            <input type="text" value={form.nationality} onChange={(e) => update("nationality", e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("avsNumber")} *</label>
            <input type="text" value={form.avs_number} onChange={(e) => update("avs_number", e.target.value)} required className={inputClass} placeholder="756.XXXX.XXXX.XX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("permitType")}</label>
            <input type="text" value={form.permit_type} onChange={(e) => update("permit_type", e.target.value)} className={inputClass} placeholder="B, C, L..." />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("employmentType")} *</label>
            <select value={form.employment_type} onChange={(e) => update("employment_type", e.target.value)} className={inputClass}>
              {EMPLOYMENT_TYPE_KEYS.map((key) => <option key={key} value={key}>{tet(key)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("jobTitle")} *</label>
            <input type="text" value={form.job_title} onChange={(e) => update("job_title", e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{te("startDate")} *</label>
          <input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} required className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("monthlyHours")} *</label>
            <input type="number" step="0.5" value={form.monthly_hours} onChange={(e) => handleHoursOrRateChange("monthly_hours", e.target.value)} required className={inputClass} placeholder="40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("hourlyRate")} *</label>
            <input type="number" step="0.05" value={form.hourly_rate} onChange={(e) => handleHoursOrRateChange("hourly_rate", e.target.value)} required className={inputClass} placeholder="28.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{te("monthlySalary")}</label>
            <input type="text" value={form.monthly_salary ? `CHF ${form.monthly_salary}` : ""} readOnly className={`${inputClass} bg-background-alt font-semibold`} />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button href="/dashboard/employees" variant="outline" size="sm" className="flex-1">
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={loading} size="sm" className="flex-1">
            {loading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
