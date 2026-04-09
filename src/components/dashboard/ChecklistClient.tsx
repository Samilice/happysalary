"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChecklistStep } from "@/lib/checklist";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  employment_type: string;
  job_title: string;
};

type Props = {
  employee: Employee;
  steps: ChecklistStep[];
  completedKeys: string[];
  percentage: number;
  completedCount: number;
  totalSteps: number;
};

const employmentTypeLabels: Record<string, string> = {
  cleaning: "Aide ménagère",
  nanny: "Nounou",
  au_pair: "Au pair",
  elderly_care: "Aide à domicile",
  gardener: "Jardinier",
  other: "Autre",
};

export function ChecklistClient({ employee, steps, completedKeys: initialCompleted, percentage: initialPercentage, completedCount: initialCount, totalSteps }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const completedCount = steps.filter((s) => completed.has(s.key)).length;
  const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  async function toggleStep(stepKey: string) {
    const isNowCompleted = !completed.has(stepKey);
    const newCompleted = new Set(completed);
    if (isNowCompleted) {
      newCompleted.add(stepKey);
    } else {
      newCompleted.delete(stepKey);
    }
    setCompleted(newCompleted);
    setSaving(stepKey);

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    if (isNowCompleted) {
      await sb.from("checklist_progress").upsert({
        employee_id: employee.id,
        step_key: stepKey,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: "employee_id,step_key" });
    } else {
      await sb.from("checklist_progress").upsert({
        employee_id: employee.id,
        step_key: stepKey,
        completed: false,
        completed_at: null,
      }, { onConflict: "employee_id,step_key" });
    }
    setSaving(null);
  }

  return (
    <div>
      {/* Employee header + progress */}
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-secondary">{employee.first_name} {employee.last_name}</h2>
              <p className="text-xs text-text-muted">{employmentTypeLabels[employee.employment_type] || employee.job_title}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${percentage === 100 ? "text-success" : "text-primary"}`}>
              {percentage}%
            </span>
            <p className="text-[10px] text-text-muted">{completedCount}/{totalSteps} étapes</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${percentage === 100 ? "bg-success" : "bg-primary"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {percentage === 100 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-success font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Toutes les démarches sont terminées !
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = completed.has(step.key);
          const isExpanded = expandedStep === step.key;
          const isSaving = saving === step.key;

          return (
            <div
              key={step.key}
              className={`bg-white rounded-xl border transition-colors ${
                isCompleted ? "border-success/30 bg-success/[0.02]" : "border-border"
              }`}
            >
              {/* Step header - clickable */}
              <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpandedStep(isExpanded ? null : step.key)}>
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStep(step.key); }}
                  disabled={isSaving}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isCompleted
                      ? "bg-success border-success"
                      : "border-border hover:border-primary"
                  } ${isSaving ? "opacity-50" : ""}`}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted bg-border-light px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                    <h3 className={`text-sm font-semibold ${isCompleted ? "text-success line-through" : "text-secondary"}`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                </div>

                {/* Expand arrow */}
                <svg
                  className={`w-5 h-5 text-text-muted flex-shrink-0 mt-0.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {/* Expanded guidance */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 ml-9">
                  <div className="bg-background-alt rounded-xl p-4 text-sm text-text leading-relaxed whitespace-pre-line">
                    {step.guidance}
                  </div>

                  {step.links.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Liens utiles</p>
                      {step.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
