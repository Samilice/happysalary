"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { calculatePayslip, type PayslipResult, type SalaryType, type VacationHandling } from "@/lib/salary-calculator";
import { CANTON_RATES, FEDERAL_RATES } from "@/lib/canton-rates";
import { createClient } from "@/lib/supabase/client";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  monthly_hours: number;
  hourly_rate: number;
  monthly_salary: number;
  avs_number: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  date_of_birth: string;
  job_title: string;
};

type Employer = {
  first_name: string;
  last_name: string;
  company_name: string | null;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_canton: string;
  phone: string;
};

type Props = {
  employees: Employee[];
  employer: Employer;
};

const CANTON_CODES = Object.keys(CANTON_RATES).sort();

export function PayslipGenerateForm({ employees, employer }: Props) {
  const t = useTranslations("dashboard.payslip");
  const locale = useLocale();

  // ── Form state ────────────────────────────────────────────────
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || "");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [hoursWorked, setHoursWorked] = useState(employees[0]?.monthly_hours || 0);
  const [hourlyRate, setHourlyRate] = useState(
    employees[0]?.hourly_rate > 0
      ? employees[0].hourly_rate
      : employees[0]?.monthly_salary > 0 && employees[0]?.monthly_hours > 0
        ? Math.round((employees[0].monthly_salary / employees[0].monthly_hours) * 100) / 100
        : 0
  );
  const [canton, setCanton] = useState(employer.address_canton || "VD");
  const [salaryType, setSalaryType] = useState<SalaryType>("hourly");
  const [vacationHandling, setVacationHandling] = useState<VacationHandling>("added");
  const [simplifiedProcedure, setSimplifiedProcedure] = useState(true);
  const [nbuOption, setNbuOption] = useState<"auto" | "yes" | "no">("auto");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [existingDocs, setExistingDocs] = useState<{ period_month: number | null; period_year: number | null }[]>([]);

  const selectedEmployee = employees.find((e) => e.id === employeeId);

  // Current date boundaries for month restriction
  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Fetch existing payslips for selected employee
  const fetchExistingDocs = useCallback(async () => {
    if (!employeeId) return;
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("documents")
      .select("period_month, period_year")
      .eq("employee_id", employeeId)
      .eq("type", "salary_sheet");
    setExistingDocs(data || []);
  }, [employeeId]);

  useEffect(() => {
    fetchExistingDocs();
  }, [fetchExistingDocs]);

  // Check if payslip already generated for this employee/month/year
  const isAlreadyGenerated = existingDocs.some(
    (d) => d.period_month === month && d.period_year === year
  );

  // Available months (no future months)
  const maxMonth = year === currentYear ? currentMonth : 12;

  // ── Is employee under 20? (5 weeks vacation) ─────────────────
  const isUnder20 = useMemo(() => {
    if (!selectedEmployee?.date_of_birth) return false;
    const birth = new Date(selectedEmployee.date_of_birth);
    const ref = new Date(year, month - 1);
    return ref.getFullYear() - birth.getFullYear() < 20;
  }, [selectedEmployee, year, month]);

  // ── Live calculation ──────────────────────────────────────────
  const result: PayslipResult | null = useMemo(() => {
    if (!hoursWorked || hoursWorked <= 0 || !canton) return null;
    if (salaryType === "hourly" && (!hourlyRate || hourlyRate <= 0)) return null;
    try {
      return calculatePayslip({
        hoursWorked,
        hourlyRate,
        canton,
        isUnder20,
        salaryType,
        vacationHandling,
        simplifiedProcedure,
        nbuOption,
      });
    } catch {
      return null;
    }
  }, [hoursWorked, hourlyRate, canton, isUnder20, salaryType, vacationHandling, simplifiedProcedure, nbuOption]);

  // ── Helpers ───────────────────────────────────────────────────
  function handleEmployeeChange(id: string) {
    setEmployeeId(id);
    setSaveSuccess(false);
    setSaveError(null);
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setHoursWorked(emp.monthly_hours);
      if (emp.hourly_rate > 0) {
        setHourlyRate(emp.hourly_rate);
      } else if (emp.monthly_salary > 0 && emp.monthly_hours > 0) {
        setHourlyRate(Math.round((emp.monthly_salary / emp.monthly_hours) * 100) / 100);
      }
    }
  }

  function chf(n: number): string {
    return n.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getMonthName(m: number): string {
    const loc: Record<string, string> = { fr: "fr-CH", de: "de-CH", en: "en-CH" };
    return new Intl.DateTimeFormat(loc[locale] || "fr-CH", { month: "long" }).format(new Date(year, m - 1));
  }

  const periodLabel = `${getMonthName(month)} ${year}`;

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm";

  // ── PDF Generation ────────────────────────────────────────────
  async function handleDownloadPdf() {
    if (!result || !selectedEmployee) return;
    setLoading(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      const dark = rgb(0.11, 0.21, 0.34);
      const primary = rgb(0.9, 0.22, 0.27);
      const gray = rgb(0.45, 0.45, 0.45);
      const lightGray = rgb(0.85, 0.85, 0.85);
      const bgLight = rgb(0.96, 0.96, 0.96);

      function drawText(text: string, x: number, yPos: number, size: number, f = font, color = dark) {
        page.drawText(text, { x, y: yPos, size, font: f, color });
      }

      function drawLine(yPos: number) {
        page.drawLine({ start: { x: margin, y: yPos }, end: { x: pageWidth - margin, y: yPos }, thickness: 0.5, color: lightGray });
      }

      function checkPage(needed: number) {
        if (y - needed < margin + 30) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
      }

      function drawSection(title: string) {
        checkPage(45);
        y -= 18;
        drawText(title, margin, y, 12, fontBold, primary);
        y -= 5;
        drawLine(y);
        y -= 16;
      }

      function drawRow(label: string, rate: string, amount: string, bold = false) {
        checkPage(18);
        const f = bold ? fontBold : font;
        drawText(label, margin + 4, y, 9, f, dark);
        if (rate) drawText(rate, margin + 280, y, 9, font, gray);
        const amountWidth = f.widthOfTextAtSize(amount, 9);
        drawText(amount, pageWidth - margin - amountWidth - 4, y, 9, f, dark);
        y -= 16;
      }

      function drawInfoField(label: string, value: string) {
        checkPage(16);
        drawText(label, margin + 4, y, 8, font, gray);
        drawText(value, margin + 120, y, 9, font, dark);
        y -= 14;
      }

      // ===== HEADER =====
      // Top border line
      page.drawRectangle({ x: margin, y: y + 4, width: contentWidth, height: 3, color: primary });
      y -= 4;
      drawText("HAPPY", margin, y, 22, fontBold, dark);
      const hw = fontBold.widthOfTextAtSize("HAPPY", 22);
      drawText("SALARY", margin + hw, y, 22, fontBold, primary);

      // Document title right-aligned
      const docTitle = t("pdf.title").toUpperCase();
      const docTitleW = fontBold.widthOfTextAtSize(docTitle, 14);
      drawText(docTitle, pageWidth - margin - docTitleW, y, 14, fontBold, dark);
      y -= 18;

      // Period and payment date
      const lastDay = new Date(year, month, 0).getDate();
      const periodFull = `01.${String(month).padStart(2, "0")}.${year} — ${lastDay}.${String(month).padStart(2, "0")}.${year}`;
      drawText(`${t("pdf.period")} : ${periodFull}`, margin, y, 9, font, gray);
      const paymentDate = `${lastDay}.${String(month).padStart(2, "0")}.${year}`;
      const payDateStr = `${t("pdf.paymentDate")} : ${paymentDate}`;
      const payDateW = font.widthOfTextAtSize(payDateStr, 9);
      drawText(payDateStr, pageWidth - margin - payDateW, y, 9, font, gray);
      y -= 8;
      drawLine(y);
      y -= 24;

      // ===== EMPLOYER =====
      drawSection(t("pdf.employer"));
      const employerName = employer.company_name
        ? `${employer.company_name} (${employer.first_name} ${employer.last_name})`
        : `${employer.first_name} ${employer.last_name}`;
      drawInfoField(t("pdf.name"), employerName);
      drawInfoField(t("pdf.address"), `${employer.address_street}, ${employer.address_postal_code} ${employer.address_city}`);
      drawInfoField(t("pdf.canton"), `${canton} — ${CANTON_RATES[canton]?.nameFr || canton}`);

      // ===== EMPLOYEE =====
      drawSection(t("pdf.employee"));
      drawInfoField(t("pdf.name"), `${selectedEmployee.first_name} ${selectedEmployee.last_name}`);
      drawInfoField(t("pdf.address"), `${selectedEmployee.address_street}, ${selectedEmployee.address_postal_code} ${selectedEmployee.address_city}`);
      if (selectedEmployee.avs_number) drawInfoField(t("pdf.avs"), selectedEmployee.avs_number);
      drawInfoField(t("pdf.position"), selectedEmployee.job_title);

      // ===== EARNINGS =====
      drawSection(t("pdf.earnings"));
      drawRow(t("pdf.hoursWorked"), "", `${hoursWorked.toFixed(2)} h`);
      drawRow(t("pdf.hourlyRate"), "", `CHF ${chf(hourlyRate)}`);
      drawRow(t("pdf.baseSalary"), "", `CHF ${chf(result.baseGross)}`);
      drawRow(t("pdf.vacationSupp"), `${result.vacationSupplementRate}%`, `CHF ${chf(result.vacationSupplement)}`);
      y -= 4;
      drawLine(y);
      y -= 14;
      drawRow(t("pdf.totalGross"), "", `CHF ${chf(result.totalGross)}`, true);

      // ===== EMPLOYEE DEDUCTIONS =====
      drawSection(t("pdf.deductions"));
      drawRow(t("results.avsAiApg"), `${FEDERAL_RATES.avsAiApg}%`, `- CHF ${chf(result.employeeAvsAiApg)}`);
      drawRow(t("results.alv"), `${FEDERAL_RATES.alv}%`, `- CHF ${chf(result.employeeAlv)}`);
      if (result.nbuApplies) {
        drawRow(t("results.nbu"), `${FEDERAL_RATES.nbuRate}%`, `- CHF ${chf(result.employeeNbu)}`);
      } else {
        drawRow(t("results.nbu"), "", t("results.nbuNotApplicable"));
      }
      if (simplifiedProcedure && result.employeeTax > 0) {
        drawRow(t("results.simplifiedTax"), `${FEDERAL_RATES.simplifiedTaxRate}%`, `- CHF ${chf(result.employeeTax)}`);
      }
      y -= 4;
      drawLine(y);
      y -= 14;
      drawRow(t("results.totalDeductions"), "", `- CHF ${chf(result.totalEmployeeDeductions)}`, true);

      // ===== NET SALARY (highlighted) =====
      checkPage(50);
      y -= 8;
      page.drawRectangle({ x: margin, y: y - 24, width: contentWidth, height: 34, color: bgLight });
      const netLabel = t("pdf.netToPay").toUpperCase();
      drawText(netLabel, margin + 10, y - 14, 12, fontBold, dark);
      const netAmount = `CHF ${chf(result.netSalary)}`;
      const netW = fontBold.widthOfTextAtSize(netAmount, 14);
      drawText(netAmount, pageWidth - margin - netW - 10, y - 16, 14, fontBold, primary);
      y -= 40;

      // ===== EMPLOYER CHARGES =====
      drawSection(t("pdf.employerCharges"));
      drawRow(t("results.avsAiApg"), `${FEDERAL_RATES.avsAiApg}%`, `CHF ${chf(result.employerAvsAiApg)}`);
      drawRow(t("results.alv"), `${FEDERAL_RATES.alv}%`, `CHF ${chf(result.employerAlv)}`);
      drawRow(t("results.bu"), `${FEDERAL_RATES.buRate}%`, `CHF ${chf(result.employerBu)}`);
      drawRow(t("results.familyAllowance"), `${result.cantonRate.familyAllowanceRate}%`, `CHF ${chf(result.employerFamilyAllowance)}`);
      drawRow(t("results.adminFee"), `${FEDERAL_RATES.adminFeeRate}%`, `CHF ${chf(result.employerAdminFee)}`);
      y -= 4;
      drawLine(y);
      y -= 14;
      drawRow(t("results.totalCharges"), "", `CHF ${chf(result.totalEmployerCharges)}`, true);

      // ===== TOTAL EMPLOYER COST =====
      checkPage(50);
      y -= 8;
      page.drawRectangle({ x: margin, y: y - 24, width: contentWidth, height: 34, color: rgb(0.94, 0.96, 0.99) });
      const costLabel = t("pdf.totalCost").toUpperCase();
      drawText(costLabel, margin + 10, y - 14, 11, fontBold, dark);
      const costAmount = `CHF ${chf(result.totalEmployerCost)}`;
      const costW = fontBold.widthOfTextAtSize(costAmount, 13);
      drawText(costAmount, pageWidth - margin - costW - 10, y - 15, 13, fontBold, dark);
      y -= 46;

      // ===== GUIDANCE =====
      checkPage(100);
      drawSection(t("guide.title"));
      const empName = `${selectedEmployee.first_name} ${selectedEmployee.last_name}`;
      const steps = [
        { text: t("guide.pdfStep1", { amount: `CHF ${chf(result.netSalary)}`, name: empName }) },
        { text: t("guide.pdfStep2", { amount: `CHF ${chf(result.totalCharges)}` }) },
        { text: t("guide.pdfStep3") },
        { text: t("guide.pdfStep4") },
      ];
      for (let i = 0; i < steps.length; i++) {
        checkPage(20);
        drawText(`${i + 1}.`, margin + 4, y, 9, fontBold, primary);
        // Wrap step text
        const words = steps[i].text.split(" ");
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(test, 9) > contentWidth - 30) {
            drawText(line, margin + 20, y, 9, font, dark);
            y -= 14;
            checkPage(16);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) {
          drawText(line, margin + 20, y, 9, font, dark);
          y -= 18;
        }
      }

      // ===== DISCLAIMER =====
      checkPage(50);
      y -= 16;
      drawLine(y + 8);
      const disclaimerText = t("disclaimer");
      const dWords = disclaimerText.split(" ");
      let dLine = "";
      for (const word of dWords) {
        const test = dLine ? `${dLine} ${word}` : word;
        if (font.widthOfTextAtSize(test, 7) > contentWidth) {
          drawText(dLine, margin, y, 7, font, gray);
          y -= 10;
          dLine = word;
        } else {
          dLine = test;
        }
      }
      if (dLine) {
        drawText(dLine, margin, y, 7, font, gray);
        y -= 10;
      }
      y -= 6;
      drawText("HappySalary.ch", margin, y, 7, font, gray);

      // ===== SAVE & DOWNLOAD =====
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const fileName = `fiche-de-paie-${selectedEmployee.first_name}-${selectedEmployee.last_name}-${String(month).padStart(2, "0")}-${year}.pdf`;

      // Upload to Supabase Storage & create document record
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          const storagePath = `${userId}/${employeeId}/${String(month).padStart(2, "0")}-${year}.pdf`;

          // Upload PDF
          await supabase.storage.from("documents").upload(storagePath, blob, {
            contentType: "application/pdf",
            upsert: true,
          });

          // Create document record
          const title = `${t("pdf.title")} — ${periodLabel}`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("documents").insert({
            employee_id: employeeId,
            type: "salary_sheet",
            title,
            period_month: month,
            period_year: year,
            status: "ready",
            file_url: storagePath,
            generated_at: new Date().toISOString(),
          });

          setSaveSuccess(true);
          setSaveError(null);
          // Refresh existing docs list
          fetchExistingDocs();
        }
      } catch (saveErr) {
        console.error("Save error:", saveErr);
        setSaveError(t("saveError"));
      }

      // Download locally
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ─── Input Form ─────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{t("selectEmployee")}</label>
            <select value={employeeId} onChange={(e) => handleEmployeeChange(e.target.value)} className={inputClass}>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} — {emp.job_title}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("month")}</label>
              <select value={month} onChange={(e) => { setMonth(Number(e.target.value)); setSaveSuccess(false); }} className={inputClass}>
                {Array.from({ length: maxMonth }, (_, i) => {
                  const mName = getMonthName(i + 1);
                  return (
                    <option key={i + 1} value={i + 1}>
                      {mName.charAt(0).toUpperCase() + mName.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("year")}</label>
              <select value={year} onChange={(e) => { setYear(Number(e.target.value)); setSaveSuccess(false); }} className={inputClass}>
                {[currentYear - 1, currentYear].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hours & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("hoursWorked")}</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={hoursWorked || ""}
                onChange={(e) => setHoursWorked(Number(e.target.value))}
                className={inputClass}
                placeholder="40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("hourlyRate")}</label>
              <input
                type="number"
                min="0"
                step="0.05"
                value={hourlyRate || ""}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className={inputClass}
                placeholder="30.00"
              />
            </div>
          </div>

          {/* Canton */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{t("canton")}</label>
            <select value={canton} onChange={(e) => setCanton(e.target.value)} className={inputClass}>
              {CANTON_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} — {CANTON_RATES[code].nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* ─── Advanced options ─────────────────────────────────── */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">{t("advancedOptions")}</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Salary type */}
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">{t("salaryType")}</label>
                <select value={salaryType} onChange={(e) => setSalaryType(e.target.value as SalaryType)} className={inputClass}>
                  <option value="hourly">{t("salaryTypeHourly")}</option>
                  <option value="monthly">{t("salaryTypeMonthly")}</option>
                </select>
              </div>

              {/* Vacation handling */}
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">{t("vacationHandling")}</label>
                <select value={vacationHandling} onChange={(e) => setVacationHandling(e.target.value as VacationHandling)} className={inputClass}>
                  <option value="added">{t("vacationAdded")}</option>
                  <option value="included">{t("vacationIncluded")}</option>
                </select>
              </div>

              {/* Simplified procedure */}
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">{t("simplifiedProcedure")}</label>
                <select value={simplifiedProcedure ? "yes" : "no"} onChange={(e) => setSimplifiedProcedure(e.target.value === "yes")} className={inputClass}>
                  <option value="yes">{t("yes")}</option>
                  <option value="no">{t("no")}</option>
                </select>
              </div>

              {/* NBU */}
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">{t("nbuOption")}</label>
                <select value={nbuOption} onChange={(e) => setNbuOption(e.target.value as "auto" | "yes" | "no")} className={inputClass}>
                  <option value="auto">{t("nbuAuto")}</option>
                  <option value="yes">{t("nbuYes")}</option>
                  <option value="no">{t("nbuNo")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Results ────────────────────────────────────────────── */}
      {result && (
        <>
          {/* Net salary — big highlight */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-sm font-medium text-text-muted mb-1">{t("results.netSalary")}</p>
            <p className="text-3xl sm:text-4xl font-bold text-secondary">
              CHF {chf(result.netSalary)}
            </p>
            <p className="text-xs text-text-muted mt-2">{periodLabel}</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-text-muted mb-1">{t("results.grossSalary")}</p>
              <p className="text-lg font-bold text-secondary">CHF {chf(result.totalGross)}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-text-muted mb-1">{t("results.charges")}</p>
              <p className="text-lg font-bold text-secondary">CHF {chf(result.totalCharges)}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-text-muted mb-1">{t("results.totalCost")}</p>
              <p className="text-lg font-bold text-secondary">CHF {chf(result.totalEmployerCost)}</p>
            </div>
          </div>

          {/* Calculation details (collapsible) */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-semibold text-secondary hover:bg-background-alt transition-colors cursor-pointer"
            >
              {t("results.details")}
              <svg
                className={`w-4 h-4 text-text-muted transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDetails && (
              <div className="px-4 sm:px-6 pb-5 space-y-5">
                {/* Earnings */}
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("pdf.earnings")}</h4>
                  <div className="space-y-1.5 text-sm">
                    <Row label={`${hoursWorked}h x CHF ${chf(hourlyRate)}`} value={`CHF ${chf(result.baseGross)}`} />
                    <Row label={`${t("pdf.vacationSupp")} (${result.vacationSupplementRate}%)`} value={`CHF ${chf(result.vacationSupplement)}`} />
                    <Row label={t("pdf.totalGross")} value={`CHF ${chf(result.totalGross)}`} bold />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Employee deductions */}
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("results.employeeDeductions")}</h4>
                  <div className="space-y-1.5 text-sm">
                    <Row label={t("results.avsAiApg")} rate={`${FEDERAL_RATES.avsAiApg}%`} value={`- CHF ${chf(result.employeeAvsAiApg)}`} />
                    <Row label={t("results.alv")} rate={`${FEDERAL_RATES.alv}%`} value={`- CHF ${chf(result.employeeAlv)}`} />
                    {result.nbuApplies ? (
                      <Row label={t("results.nbu")} rate={`${FEDERAL_RATES.nbuRate}%`} value={`- CHF ${chf(result.employeeNbu)}`} />
                    ) : (
                      <Row label={t("results.nbu")} value={t("results.nbuNotApplicable")} muted />
                    )}
                    <Row label={t("results.simplifiedTax")} rate={`${FEDERAL_RATES.simplifiedTaxRate}%`} value={`- CHF ${chf(result.employeeTax)}`} />
                    <Row label={t("results.totalDeductions")} value={`- CHF ${chf(result.totalEmployeeDeductions)}`} bold />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Employer charges */}
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("results.employerChargesTitle")}</h4>
                  <div className="space-y-1.5 text-sm">
                    <Row label={t("results.avsAiApg")} rate={`${FEDERAL_RATES.avsAiApg}%`} value={`CHF ${chf(result.employerAvsAiApg)}`} />
                    <Row label={t("results.alv")} rate={`${FEDERAL_RATES.alv}%`} value={`CHF ${chf(result.employerAlv)}`} />
                    <Row label={t("results.bu")} rate={`${FEDERAL_RATES.buRate}%`} value={`CHF ${chf(result.employerBu)}`} />
                    <Row
                      label={`${t("results.familyAllowance")} (${canton})`}
                      rate={`${result.cantonRate.familyAllowanceRate}%`}
                      value={`CHF ${chf(result.employerFamilyAllowance)}`}
                    />
                    <Row label={t("results.adminFee")} rate={`${FEDERAL_RATES.adminFeeRate}%`} value={`CHF ${chf(result.employerAdminFee)}`} />
                    <Row label={t("results.totalCharges")} value={`CHF ${chf(result.totalEmployerCharges)}`} bold />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Guidance Section ───────────────────────────────── */}
          <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-secondary mb-4">{t("guide.title")}</h3>
            <div className="space-y-4">
              <GuideStep
                number={1}
                title={t("guide.step1", { amount: `CHF ${chf(result.netSalary)}`, name: selectedEmployee?.first_name || "" })}
                description={t("guide.step1desc", { period: periodLabel })}
                icon={<BanknoteIcon />}
              />
              <GuideStep
                number={2}
                title={t("guide.step2", { amount: `CHF ${chf(result.totalCharges)}` })}
                description={t("guide.step2desc")}
                icon={<ChartIcon />}
              />
              <GuideStep
                number={3}
                title={t("guide.step3")}
                description={t("guide.step3desc")}
                icon={<ClipboardIcon />}
              />
              <GuideStep
                number={4}
                title={t("guide.step4")}
                description={t("guide.step4desc")}
                icon={<DocumentIcon />}
              />
            </div>
          </div>

          {/* ─── Generate & Save ──────────────────────────────── */}
          {isAlreadyGenerated && !saveSuccess && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-700">{t("alreadyGenerated")}</p>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">{t("savedToDocuments")}</p>
            </div>
          )}

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={loading || isAlreadyGenerated}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/25 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {loading ? t("downloading") : t("generateAndSave")}
            </button>
            <p className="text-xs text-text-muted">{t("savedAutomatically")}</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">{t("disclaimer")}</p>
          </div>
        </>
      )}

      {/* No data prompt */}
      {!result && hoursWorked <= 0 && (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <svg className="w-12 h-12 text-text-light mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H15.75v-.008zm0 2.25h.008v.008H15.75V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
          </svg>
          <p className="text-sm text-text-muted">{t("enterHours")}</p>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function Row({ label, rate, value, bold, muted }: { label: string; rate?: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? "border-t border-border pt-2 mt-1" : ""}`}>
      <div className="flex items-center gap-2">
        <span className={bold ? "font-semibold text-text" : muted ? "text-text-muted" : "text-text"}>{label}</span>
        {rate && <span className="text-xs text-text-muted">({rate})</span>}
      </div>
      <span className={`tabular-nums ${bold ? "font-semibold text-text" : muted ? "text-text-muted text-xs" : "text-text"}`}>{value}</span>
    </div>
  );
}

function GuideStep({ number, title, description, icon }: { number: number; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-secondary">
          <span className="text-primary mr-1">{number}.</span>
          {title}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function BanknoteIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
