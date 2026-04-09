"use client";

import { useState } from "react";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
};

type Props = {
  employee: Employee;
};

export function EmployeeActions({ employee }: Props) {
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  async function handleGeneratePayslip() {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          month: currentMonth,
          year: currentYear,
          type: "salary_sheet",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la génération");
        return;
      }

      setSuccess(`Fiche de salaire générée pour ${employee.first_name} ${employee.last_name}. Disponible dans l'onglet Documents.`);
    } catch {
      setError("Erreur réseau");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
        <button
          onClick={handleGeneratePayslip}
          disabled={generating}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
            generating
              ? "bg-primary/10 text-primary opacity-60 cursor-wait"
              : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          {generating ? "Génération..." : "Générer fiche de salaire"}
        </button>
        <button disabled className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary cursor-not-allowed opacity-60 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
          Générer contrat (bientôt)
        </button>
      </div>

      {success && (
        <div className="mt-2 bg-success/10 border border-success/20 text-success text-xs rounded-lg p-2">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-2">
          {error}
        </div>
      )}
    </div>
  );
}
