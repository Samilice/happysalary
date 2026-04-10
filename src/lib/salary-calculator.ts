/**
 * Swiss salary calculator for household employees.
 * Computes gross → net, employee deductions, and employer charges
 * based on federal and cantonal rates (2024/2025).
 *
 * Supports:
 *   - Hourly or monthly salary input
 *   - Vacation supplement: added or included
 *   - Simplified procedure (Art. 37a LAVS): flat 5% income tax
 *   - NBU (AANP) conditional on weekly hours or explicit choice
 *   - Dynamic canton-specific rates
 */

import { CANTON_RATES, FEDERAL_RATES, type CantonRate } from "./canton-rates";

export type SalaryType = "hourly" | "monthly";
export type VacationHandling = "added" | "included";

export interface PayslipInput {
  // ── Core inputs ───────────────────────────────────────────────
  /** Hours worked this month (used when salaryType = 'hourly') */
  hoursWorked: number;
  /** Gross hourly rate in CHF (used when salaryType = 'hourly') */
  hourlyRate: number;
  /** Canton code (e.g. "VD", "GE") */
  canton: string;
  /** Employee is under 20 years old (5 weeks vacation → 10.64% supplement) */
  isUnder20: boolean;

  // ── Explicit options (all optional with backward-compatible defaults) ──
  /**
   * Salary type: 'hourly' (default) or 'monthly'.
   * - hourly: base gross = hoursWorked × hourlyRate
   * - monthly: base gross = hoursWorked (treated as monthly salary)
   */
  salaryType?: SalaryType;

  /**
   * Vacation handling:
   * - 'added' (default): vacation supplement (8.33%/10.64%) is added to gross
   * - 'included': salary already includes vacation, no supplement added
   */
  vacationHandling?: VacationHandling;

  /**
   * Simplified procedure (Art. 37a LAVS):
   * - true (default): 5% flat income tax is applied
   * - false: no income tax deduction (standard procedure)
   */
  simplifiedProcedure?: boolean;

  /**
   * Non-occupational accident insurance (NBU/AANP):
   * - 'auto' (default): applied if estimated weekly hours ≥ 8
   * - 'yes': always applied
   * - 'no': never applied
   */
  nbuOption?: "auto" | "yes" | "no";

  /**
   * Custom NBU rate (%) — if provided, overrides the default 1.28%.
   * Allows users to enter their actual insurer rate.
   */
  customNbuRate?: number;

  /**
   * Custom BU rate (%) — if provided, overrides the default 0.17%.
   * Allows users to enter their actual insurer rate.
   */
  customBuRate?: number;
}

export interface PayslipResult {
  // --- Earnings ---
  /** Base gross: hours × rate (hourly) or monthly salary */
  baseGross: number;
  /** Vacation pay supplement amount (0 if included) */
  vacationSupplement: number;
  /** Vacation supplement rate used (8.33%, 10.64%, or 0 if included) */
  vacationSupplementRate: number;
  /** Total gross: base + vacation supplement */
  totalGross: number;

  // --- Employee deductions ---
  employeeAvsAiApg: number;
  employeeAlv: number;
  employeeNbu: number;
  employeeTax: number;
  totalEmployeeDeductions: number;

  // --- Net salary ---
  netSalary: number;

  // --- Employer charges ---
  employerAvsAiApg: number;
  employerAlv: number;
  employerBu: number;
  employerFamilyAllowance: number;
  employerAdminFee: number;
  totalEmployerCharges: number;

  // --- Totals ---
  /** Total employer cost: gross + employer charges */
  totalEmployerCost: number;
  /** All social charges combined (employee + employer) */
  totalCharges: number;

  // --- Meta ---
  /** Whether NBU (non-occupational accident) applies */
  nbuApplies: boolean;
  /** Canton rate data used */
  cantonRate: CantonRate;
  /** Whether simplified procedure is active */
  simplifiedProcedure: boolean;
  /** Salary type used */
  salaryType: SalaryType;
  /** Vacation handling used */
  vacationHandling: VacationHandling;
  /** Whether custom LAA rates were used */
  customRatesUsed: boolean;
  /** Actual NBU rate applied */
  nbuRateUsed: number;
  /** Actual BU rate applied */
  buRateUsed: number;
}

/**
 * Round to 2 decimal places (Swiss rounding: standard half-up)
 */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Calculate a complete payslip breakdown.
 *
 * All options have sensible defaults for backward compatibility:
 * - salaryType: 'hourly'
 * - vacationHandling: 'added'
 * - simplifiedProcedure: true
 * - nbuOption: 'auto'
 *
 * @param input – Employee data + explicit calculation options
 * @returns Full payslip with all line items
 * @throws Error if canton code is unknown
 */
export function calculatePayslip(input: PayslipInput): PayslipResult {
  const cantonRate = CANTON_RATES[input.canton];
  if (!cantonRate) {
    throw new Error(`Unknown canton: ${input.canton}`);
  }

  const r = FEDERAL_RATES;

  // Resolve options with defaults
  const salaryType: SalaryType = input.salaryType ?? "hourly";
  const vacationHandling: VacationHandling = input.vacationHandling ?? "added";
  const useSimplified = input.simplifiedProcedure ?? true;
  const nbuOption = input.nbuOption ?? "auto";

  // ── 1. Gross salary ──────────────────────────────────────────
  const baseGross =
    salaryType === "monthly"
      ? round2(input.hoursWorked) // hoursWorked field carries monthly salary value
      : round2(input.hoursWorked * input.hourlyRate);

  let vacationSupplementRate: number;
  let vacationSupplement: number;

  if (vacationHandling === "included") {
    // Salary already includes vacation — no supplement
    vacationSupplementRate = 0;
    vacationSupplement = 0;
  } else {
    // Add vacation supplement on top
    vacationSupplementRate = input.isUnder20
      ? r.vacationSupplement5Weeks
      : r.vacationSupplement4Weeks;
    vacationSupplement = round2(baseGross * vacationSupplementRate / 100);
  }

  const totalGross = round2(baseGross + vacationSupplement);

  // ── 2. NBU eligibility ───────────────────────────────────────
  let nbuApplies: boolean;
  if (nbuOption === "yes") {
    nbuApplies = true;
  } else if (nbuOption === "no") {
    nbuApplies = false;
  } else {
    // Auto: estimate from monthly hours
    const weeklyHours = input.hoursWorked / 4.33;
    nbuApplies = weeklyHours >= r.nbuMinWeeklyHours;
  }

  // ── 3. LAA rates (custom or default) ─────────────────────────
  const nbuRateUsed = input.customNbuRate ?? r.nbuRate;
  const buRateUsed = input.customBuRate ?? r.buRate;
  const customRatesUsed = input.customNbuRate !== undefined || input.customBuRate !== undefined;

  // ── 4. Employee deductions (withheld from gross) ─────────────
  const employeeAvsAiApg = round2(totalGross * r.avsAiApg / 100);
  const employeeAlv = round2(totalGross * r.alv / 100);
  const employeeNbu = nbuApplies ? round2(totalGross * nbuRateUsed / 100) : 0;
  const employeeTax = useSimplified ? round2(totalGross * r.simplifiedTaxRate / 100) : 0;
  const totalEmployeeDeductions = round2(
    employeeAvsAiApg + employeeAlv + employeeNbu + employeeTax
  );

  // ── 4. Net salary ───────────────────────────────────────────
  const netSalary = round2(totalGross - totalEmployeeDeductions);

  // ── 5. Employer charges (additional cost) ────────────────────
  const employerAvsAiApg = round2(totalGross * r.avsAiApg / 100);
  const employerAlv = round2(totalGross * r.alv / 100);
  const employerBu = round2(totalGross * buRateUsed / 100);
  const employerFamilyAllowance = round2(totalGross * cantonRate.familyAllowanceRate / 100);
  const employerAdminFee = round2(totalGross * r.adminFeeRate / 100);
  const totalEmployerCharges = round2(
    employerAvsAiApg + employerAlv + employerBu + employerFamilyAllowance + employerAdminFee
  );

  // ── 6. Totals ───────────────────────────────────────────────
  const totalEmployerCost = round2(totalGross + totalEmployerCharges);
  const totalCharges = round2(totalEmployeeDeductions + totalEmployerCharges);

  return {
    baseGross,
    vacationSupplement,
    vacationSupplementRate,
    totalGross,
    employeeAvsAiApg,
    employeeAlv,
    employeeNbu,
    employeeTax,
    totalEmployeeDeductions,
    netSalary,
    employerAvsAiApg,
    employerAlv,
    employerBu,
    employerFamilyAllowance,
    employerAdminFee,
    totalEmployerCharges,
    totalEmployerCost,
    totalCharges,
    nbuApplies,
    cantonRate,
    simplifiedProcedure: useSimplified,
    salaryType,
    vacationHandling,
    customRatesUsed,
    nbuRateUsed,
    buRateUsed,
  };
}
