"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@/lib/supabase/client";
import { cleanName, cleanNameForFile, formatHours, cn } from "@/lib/utils";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  date_of_birth: string;
  nationality: string;
  avs_number: string;
  job_title: string;
  monthly_hours: number;
  monthly_salary: number;
  start_date: string;
};

type Employer = {
  first_name: string;
  last_name: string;
  company: string | null;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  phone: string;
};

type Props = {
  employees: Employee[];
  employer: Employer;
};

const CONTRACT_TYPES = ["cdi", "cdd"] as const;
const TRIAL_PERIODS = ["none", "1month", "3months"] as const;
const SALARY_TYPES = ["monthly", "hourly"] as const;
const NOTICE_PERIODS = ["legal", "1month", "2months", "3months"] as const;
const PAYMENT_DAYS = ["25", "end", "custom"] as const;
const PAYMENT_METHODS = ["transfer", "cash"] as const;
const HOURS_TYPES = ["fixed", "variable"] as const;
const VACATION_WEEKS = ["4", "5"] as const;

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex ml-1.5 group/tip">
      <span
        className="w-4 h-4 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors inline-flex items-center justify-center text-[10px] font-bold cursor-help flex-shrink-0"
        tabIndex={0}
      >
        i
      </span>
      <span className="pointer-events-none opacity-0 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 p-2.5 rounded-xl bg-secondary text-white text-xs leading-relaxed shadow-xl whitespace-normal">
        {text}
        <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-secondary" />
      </span>
    </span>
  );
}

export function ContractGenerateForm({ employees, employer }: Props) {
  const t = useTranslations("dashboard.contracts");

  // ── Form state ────────────────────────────────────────────────
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || "");
  const [contractType, setContractType] = useState<typeof CONTRACT_TYPES[number]>("cdi");
  const [startDate, setStartDate] = useState(employees[0]?.start_date || new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [activityRate, setActivityRate] = useState("100");
  const [salaryAmount, setSalaryAmount] = useState(String(employees[0]?.monthly_salary || ""));
  const [salaryType, setSalaryType] = useState<typeof SALARY_TYPES[number]>("monthly");
  const [weeklyHours, setWeeklyHours] = useState(String(Math.round((employees[0]?.monthly_hours || 0) * 12 / 52)));
  const [workingDays, setWorkingDays] = useState("");
  const [trialPeriod, setTrialPeriod] = useState<typeof TRIAL_PERIODS[number]>("1month");
  const [workplace, setWorkplace] = useState(`${employer.address_street}, ${employer.address_postal_code} ${employer.address_city}`);
  const [taskDescription, setTaskDescription] = useState("");
  const [vacationIncluded, setVacationIncluded] = useState(false);
  const [accidentInsurance, setAccidentInsurance] = useState(true);
  const [noticePeriod, setNoticePeriod] = useState<typeof NOTICE_PERIODS[number]>("legal");
  const [accommodation, setAccommodation] = useState(false);
  const [meals, setMeals] = useState(false);
  const [specialConditions, setSpecialConditions] = useState("");

  // New fields
  const [paymentDay, setPaymentDay] = useState<typeof PAYMENT_DAYS[number]>("end");
  const [customPaymentDay, setCustomPaymentDay] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>("transfer");
  const [thirteenthSalary, setThirteenthSalary] = useState(false);
  const [thirteenthSalaryAmount, setThirteenthSalaryAmount] = useState("");
  const [hoursType, setHoursType] = useState<typeof HOURS_TYPES[number]>("fixed");
  const [minHours, setMinHours] = useState("");
  const [maxHours, setMaxHours] = useState("");
  const [simplifiedProcedure, setSimplifiedProcedure] = useState(false);
  const [vacationWeeks, setVacationWeeks] = useState<typeof VACATION_WEEKS[number]>("4");

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedEmployee = employees.find((e) => e.id === employeeId);

  const handleEmployeeChange = useCallback((id: string) => {
    setEmployeeId(id);
    setSaveSuccess(false);
    setSaveError(null);
    setErrors({});
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setSalaryAmount(String(emp.monthly_salary));
      setStartDate(emp.start_date || new Date().toISOString().split("T")[0]);
      setWeeklyHours(String(Math.round((emp.monthly_hours || 0) * 12 / 52)));
      setThirteenthSalaryAmount(String((emp.monthly_salary / 12).toFixed(2)));
    }
  }, [employees]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm";
  const errorInputClass = "border-red-400 focus:ring-red-400/50 focus:border-red-400";

  function FieldError({ name }: { name: string }) {
    if (!errors[name]) return null;
    return <p className="text-xs text-red-500 mt-1">{errors[name]}</p>;
  }

  // ── Validation ────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!employeeId) errs.employeeId = t("errors.required");
    if (!startDate) errs.startDate = t("errors.required");
    if (contractType === "cdd" && !endDate) errs.endDate = t("errors.endDateRequired");
    const rate = Number(activityRate);
    if (!rate || rate < 1 || rate > 100) errs.activityRate = t("errors.activityRange");
    const salary = Number(salaryAmount);
    if (!salary || salary <= 0) errs.salaryAmount = t("errors.salaryPositive");
    if (hoursType === "fixed") {
      const wh = Number(weeklyHours);
      if (!wh || wh <= 0) errs.weeklyHours = t("errors.hoursPositive");
    } else {
      const mn = Number(minHours);
      const mx = Number(maxHours);
      if (!mn || mn <= 0) errs.minHours = t("errors.hoursPositive");
      if (!mx || mx <= 0) errs.maxHours = t("errors.hoursPositive");
      if (mn && mx && mn >= mx) errs.maxHours = t("errors.minMaxInvalid");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── PDF Generation + Save ─────────────────────────────────────
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEmployee) return;
    if (!validate()) return;
    setLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 55;
      const contentWidth = pageWidth - margin * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      const dark = rgb(0.11, 0.21, 0.34);
      const primary = rgb(0.9, 0.22, 0.27);
      const gray = rgb(0.45, 0.45, 0.45);
      const lightGray = rgb(0.85, 0.85, 0.85);
      const bgLight = rgb(0.96, 0.96, 0.96);

      // Cleaned names
      const empFirstName = cleanName(selectedEmployee.first_name);
      const empLastName = cleanName(selectedEmployee.last_name);
      const empName = `${empFirstName} ${empLastName}`;
      const employerFirstName = cleanName(employer.first_name);
      const employerLastName = cleanName(employer.last_name);
      const employerName = employer.company
        ? `${employer.company} (${employerFirstName} ${employerLastName})`
        : `${employerFirstName} ${employerLastName}`;

      function drawText(text: string, x: number, yPos: number, size: number, f = font, color = dark) {
        page.drawText(text, { x, y: yPos, size, font: f, color });
      }

      function drawLine(yPos: number) {
        page.drawLine({ start: { x: margin, y: yPos }, end: { x: pageWidth - margin, y: yPos }, thickness: 0.5, color: lightGray });
      }

      function checkPage(needed: number) {
        if (y - needed < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
      }

      function wrapText(text: string, maxWidth: number, size: number, f = font): string[] {
        const words = text.split(" ");
        const lines: string[] = [];
        let current = "";
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          if (f.widthOfTextAtSize(test, size) > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        return lines;
      }

      let sectionNum = 0;
      function drawSection(title: string) {
        sectionNum++;
        checkPage(50);
        y -= 26;
        page.drawRectangle({ x: margin, y: y - 4, width: contentWidth, height: 22, color: bgLight });
        drawText(`Article ${sectionNum} — ${title}`, margin + 8, y, 10.5, fontBold, dark);
        y -= 22;
      }

      function drawField(label: string, value: string) {
        checkPage(18);
        drawText(label, margin + 8, y, 8.5, fontBold, gray);
        drawText(value, margin + 160, y, 9.5, font, dark);
        y -= 16;
      }

      function drawParagraph(text: string) {
        const lines = wrapText(text, contentWidth - 16, 9.5);
        for (const line of lines) {
          checkPage(15);
          drawText(line, margin + 8, y, 9.5, font, dark);
          y -= 14;
        }
        y -= 4;
      }

      // ===== TOP BAR + HEADER =====
      page.drawRectangle({ x: margin, y: y + 4, width: contentWidth, height: 3, color: primary });
      y -= 4;
      drawText("HAPPY", margin, y, 20, fontBold, dark);
      const hw = fontBold.widthOfTextAtSize("HAPPY", 20);
      drawText("SALARY", margin + hw, y, 20, fontBold, primary);

      const docTitle = t("pdf.documentTitle").toUpperCase();
      const dtW = fontBold.widthOfTextAtSize(docTitle, 14);
      drawText(docTitle, pageWidth - margin - dtW, y, 14, fontBold, dark);
      y -= 14;
      drawText(`${t("startDate")} : ${startDate}`, margin, y, 8.5, font, gray);
      y -= 8;
      drawLine(y);
      y -= 20;

      // ===== CONTRACT SUMMARY BOX (line-by-line) =====
      checkPage(130);
      const salaryStr = salaryType === "hourly"
        ? `CHF ${Number(salaryAmount).toFixed(2)} / h`
        : `CHF ${Number(salaryAmount).toFixed(2)} / ${t("pdf.perMonth")}`;

      const summaryLines = [
        `${t("pdf.employer")} : ${employerName}`,
        `${t("pdf.employee")} : ${empName}`,
        `${t("pdf.contractType")} : ${contractType === "cdi" ? t("cdi") : t("cdd")}`,
        `${t("pdf.position")} : ${selectedEmployee.job_title}`,
        `${t("pdf.grossSalary")} : ${salaryStr}`,
        `${t("activityRate")} : ${activityRate}%`,
        `${t("startDate")} : ${startDate}`,
      ];
      const summaryH = summaryLines.length * 14 + 26;

      page.drawRectangle({ x: margin, y: y - summaryH, width: contentWidth, height: summaryH, color: rgb(0.94, 0.96, 0.99) });
      page.drawRectangle({ x: margin, y: y - summaryH, width: 3, height: summaryH, color: primary });

      drawText(t("pdf.summaryTitle").toUpperCase(), margin + 14, y - 14, 8, fontBold, primary);
      let sy = y - 30;
      for (const line of summaryLines) {
        drawText(line, margin + 14, sy, 9, font, dark);
        sy -= 14;
      }
      y -= summaryH + 16;

      // ===== ART 1 — EMPLOYER =====
      drawSection(t("pdf.employer"));
      drawField(t("pdf.name"), employerName);
      drawField(t("pdf.address"), `${employer.address_street}, ${employer.address_postal_code} ${employer.address_city}`);
      drawField(t("pdf.phone"), employer.phone);

      // ===== ART 2 — EMPLOYEE =====
      drawSection(t("pdf.employee"));
      drawField(t("pdf.name"), empName);
      drawField(t("pdf.address"), `${selectedEmployee.address_street}, ${selectedEmployee.address_postal_code} ${selectedEmployee.address_city}`);
      drawField(t("pdf.dateOfBirth"), selectedEmployee.date_of_birth);
      drawField(t("pdf.nationality"), selectedEmployee.nationality);
      if (selectedEmployee.avs_number) drawField(t("pdf.avs"), selectedEmployee.avs_number);

      // ===== ART 3 — CONTRACT TERMS =====
      drawSection(t("pdf.terms"));
      drawField(t("pdf.contractType"), contractType === "cdi" ? t("cdi") : t("cdd"));
      drawField(t("pdf.position"), selectedEmployee.job_title);
      if (taskDescription) {
        drawField(t("pdf.taskDescription"), "");
        drawParagraph(taskDescription);
      }
      drawField(t("startDate"), startDate);
      if (contractType === "cdd" && endDate) drawField(t("endDate"), endDate);
      drawField(t("pdf.workplace"), workplace);

      // ===== ART 4 — TRIAL PERIOD =====
      if (trialPeriod !== "none") {
        drawSection(t("trialPeriod"));
        const trialText = trialPeriod === "1month" ? t("trial1Month") : t("trial3Months");
        drawParagraph(t("pdf.trialClause", { duration: trialText }));
      }

      // ===== ART 5 — WORKING HOURS =====
      drawSection(t("pdf.workingHoursTitle"));
      drawField(t("activityRate"), `${activityRate}%`);
      if (hoursType === "fixed") {
        if (weeklyHours) drawField(t("pdf.weeklyHours"), `${formatHours(weeklyHours)} / ${t("pdf.perWeek")}`);
      } else {
        drawField(t("pdf.weeklyHours"), t("pdf.hoursRange", { min: minHours, max: maxHours }));
      }
      if (workingDays) drawField(t("pdf.workingDays"), workingDays);

      // ===== ART 6 — SALARY =====
      drawSection(t("pdf.salaryTitle"));
      drawField(t("pdf.grossSalary"), salaryStr);
      drawParagraph(t("pdf.salaryClause"));
      drawParagraph(t("pdf.salaryNetClause"));
      if (simplifiedProcedure) {
        drawParagraph(t("pdf.simplifiedTaxNote"));
      }
      if (vacationIncluded) {
        drawParagraph(vacationWeeks === "5" ? t("pdf.vacationIncludedClause5") : t("pdf.vacationIncludedClause"));
      }
      // Payment details
      const payDayStr = paymentDay === "25" ? t("paymentDay25") : paymentDay === "end" ? t("paymentDayEnd") : customPaymentDay;
      drawField(t("pdf.paymentDayField"), payDayStr);
      drawField(t("pdf.paymentMethodField"), paymentMethod === "transfer" ? t("pdf.paymentTransferValue") : t("pdf.paymentCashValue"));
      // 13th salary
      if (thirteenthSalary) {
        const amount13 = thirteenthSalaryAmount || (Number(salaryAmount) / 12).toFixed(2);
        drawParagraph(t("pdf.thirteenthSalaryClause", { amount: amount13 }));
      }

      // ===== ART 7 — VACATION =====
      drawSection(t("pdf.vacationTitle"));
      drawParagraph(vacationWeeks === "5" ? t("pdf.vacationClause5") : t("pdf.vacationClause"));

      // ===== ART 8 — INSURANCE =====
      drawSection(t("pdf.insuranceTitle"));
      drawParagraph(accidentInsurance ? t("pdf.insuranceYes") : t("pdf.insuranceNo"));

      // ===== ART 9 — NOTICE =====
      drawSection(t("pdf.noticeTitle"));
      if (contractType === "cdi") {
        if (noticePeriod === "legal") {
          drawParagraph(t("pdf.noticeClauseCDI"));
        } else {
          const np = noticePeriod === "1month" ? t("notice1Month") : noticePeriod === "2months" ? t("notice2Months") : t("notice3Months");
          drawParagraph(t("pdf.noticeClauseCustom", { period: np }));
        }
      } else {
        drawParagraph(t("pdf.noticeClauseCDD"));
      }

      // ===== ART 10 — SPECIFIC CONDITIONS =====
      if (accommodation || meals || specialConditions) {
        drawSection(t("pdf.specificTitle"));
        if (accommodation) drawParagraph(t("pdf.accommodationClause"));
        if (meals) drawParagraph(t("pdf.mealsClause"));
        if (specialConditions) {
          drawField(t("pdf.specialConditions"), "");
          drawParagraph(specialConditions);
        }
      }

      // ===== SIGNATURES (lines first, names below) =====
      checkPage(130);
      y -= 20;
      drawSection(t("pdf.signatures"));
      drawText(`${t("pdf.signDate")} _______________________`, margin + 8, y, 9, font, gray);
      y -= 30;

      const halfW = contentWidth / 2 - 10;
      // Headers
      drawText(t("pdf.employer"), margin + 8, y, 9, fontBold, gray);
      drawText(t("pdf.employee"), margin + halfW + 20, y, 9, fontBold, gray);
      y -= 40;
      // Signature lines
      page.drawLine({ start: { x: margin + 8, y }, end: { x: margin + halfW, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
      page.drawLine({ start: { x: margin + halfW + 20, y }, end: { x: pageWidth - margin - 8, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
      // Names BELOW the lines
      y -= 14;
      drawText(employerName, margin + 8, y, 8.5, font, gray);
      drawText(empName, margin + halfW + 20, y, 8.5, font, gray);

      // ===== LEGAL DISCLAIMER =====
      checkPage(60);
      y -= 40;
      drawLine(y + 10);
      y -= 5;
      const disclaimerLines = wrapText(t("pdf.legalDisclaimer"), contentWidth, 7.5);
      for (const line of disclaimerLines) {
        drawText(line, margin, y, 7.5, font, gray);
        y -= 11;
      }
      y -= 6;
      // Discreet footer — small, right-aligned, lighter gray
      const footerText = "happysalary.ch";
      const footerW = font.widthOfTextAtSize(footerText, 6.5);
      drawText(footerText, pageWidth - margin - footerW, y, 6.5, font, rgb(0.7, 0.7, 0.7));

      // ===== SAVE & DOWNLOAD =====
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const fileName = `contrat-${cleanNameForFile(selectedEmployee.first_name)}-${cleanNameForFile(selectedEmployee.last_name)}.pdf`;

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          const storagePath = `${userId}/${employeeId}/contrat-${startDate}.pdf`;

          await supabase.storage.from("documents").upload(storagePath, blob, {
            contentType: "application/pdf",
            upsert: true,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("documents").insert({
            employee_id: employeeId,
            type: "employment_contract",
            title: `${t("pdf.documentTitle")} — ${empName}`,
            status: "ready",
            file_url: storagePath,
            generated_at: new Date().toISOString(),
          });

          setSaveSuccess(true);
        }
      } catch (err) {
        console.error("Save error:", err);
        setSaveError(t("saveError"));
      }

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
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6">
        <form onSubmit={handleGenerate} className="space-y-6">

          {/* ── Bloc 1 : Employe ──────────────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-secondary mb-2">{t("selectEmployee")}</legend>
            <select value={employeeId} onChange={(e) => handleEmployeeChange(e.target.value)} className={inputClass}>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{cleanName(emp.first_name)} {cleanName(emp.last_name)} — {emp.job_title}</option>
              ))}
            </select>
          </fieldset>

          {/* ── Bloc 2 : Type & Dates ────────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-secondary mb-2">{t("pdf.terms")}</legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("contractType")}</label>
                <select value={contractType} onChange={(e) => setContractType(e.target.value as typeof CONTRACT_TYPES[number])} className={inputClass}>
                  <option value="cdi">{t("cdi")}</option>
                  <option value="cdd">{t("cdd")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("trialPeriod")}
                  <Tooltip text={t("tooltips.trial")} />
                </label>
                <select value={trialPeriod} onChange={(e) => setTrialPeriod(e.target.value as typeof TRIAL_PERIODS[number])} className={inputClass}>
                  <option value="none">{t("trialNone")}</option>
                  <option value="1month">{t("trial1Month")}</option>
                  <option value="3months">{t("trial3Months")}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("startDate")}</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={cn(inputClass, errors.startDate && errorInputClass)} />
                <FieldError name="startDate" />
              </div>
              {contractType === "cdd" && (
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t("endDate")}</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={cn(inputClass, errors.endDate && errorInputClass)} />
                  <FieldError name="endDate" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("workplace")}</label>
              <input type="text" value={workplace} onChange={(e) => setWorkplace(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("taskDescription")}</label>
              <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows={2} placeholder={t("taskDescriptionPlaceholder")} className={inputClass + " resize-none"} />
            </div>
          </fieldset>

          {/* ── Bloc 3 : Temps de travail ────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-secondary mb-2">{t("pdf.workingHoursTitle")}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("activityRate")}
                  <Tooltip text={t("tooltips.activityRate")} />
                </label>
                <input type="number" min="1" max="100" value={activityRate} onChange={(e) => setActivityRate(e.target.value)} className={cn(inputClass, errors.activityRate && errorInputClass)} />
                <FieldError name="activityRate" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("hoursType")}</label>
                <select value={hoursType} onChange={(e) => setHoursType(e.target.value as typeof HOURS_TYPES[number])} className={inputClass}>
                  <option value="fixed">{t("hoursFixed")}</option>
                  <option value="variable">{t("hoursVariable")}</option>
                </select>
              </div>
              {hoursType === "fixed" ? (
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t("weeklyHours")}</label>
                  <input type="number" min="1" max="50" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} className={cn(inputClass, errors.weeklyHours && errorInputClass)} />
                  <FieldError name="weeklyHours" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t("minHoursLabel")}</label>
                    <input type="number" min="1" max="50" value={minHours} onChange={(e) => setMinHours(e.target.value)} className={cn(inputClass, errors.minHours && errorInputClass)} />
                    <FieldError name="minHours" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t("maxHoursLabel")}</label>
                    <input type="number" min="1" max="50" value={maxHours} onChange={(e) => setMaxHours(e.target.value)} className={cn(inputClass, errors.maxHours && errorInputClass)} />
                    <FieldError name="maxHours" />
                  </div>
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("workingDaysLabel")}</label>
              <input type="text" value={workingDays} onChange={(e) => setWorkingDays(e.target.value)} placeholder={t("workingDaysPlaceholder")} className={inputClass} />
            </div>
          </fieldset>

          {/* ── Bloc 4 : Salaire ──────────────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-secondary mb-2">{t("pdf.salaryTitle")}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("salaryTypeLabel")}</label>
                <select value={salaryType} onChange={(e) => setSalaryType(e.target.value as typeof SALARY_TYPES[number])} className={inputClass}>
                  <option value="monthly">{t("salaryMonthly")}</option>
                  <option value="hourly">{t("salaryHourly")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("salary")}</label>
                <input type="number" step="0.01" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} className={cn(inputClass, errors.salaryAmount && errorInputClass)} />
                <FieldError name="salaryAmount" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("paymentDay")}</label>
                <select value={paymentDay} onChange={(e) => setPaymentDay(e.target.value as typeof PAYMENT_DAYS[number])} className={inputClass}>
                  <option value="25">{t("paymentDay25")}</option>
                  <option value="end">{t("paymentDayEnd")}</option>
                  <option value="custom">{t("paymentDayCustom")}</option>
                </select>
                {paymentDay === "custom" && (
                  <input type="text" value={customPaymentDay} onChange={(e) => setCustomPaymentDay(e.target.value)} placeholder={t("customPaymentDayLabel")} className={cn(inputClass, "mt-2")} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("paymentMethod")}
                  <Tooltip text={t("tooltips.paymentMethod")} />
                </label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as typeof PAYMENT_METHODS[number])} className={inputClass}>
                  <option value="transfer">{t("paymentTransfer")}</option>
                  <option value="cash">{t("paymentCash")}</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={vacationIncluded} onChange={(e) => setVacationIncluded(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("vacationIncluded")}
              <Tooltip text={t("tooltips.vacation")} />
            </label>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("vacationWeeks")}</label>
              <select value={vacationWeeks} onChange={(e) => setVacationWeeks(e.target.value as typeof VACATION_WEEKS[number])} className={inputClass}>
                <option value="4">{t("vacationWeeks4")}</option>
                <option value="5">{t("vacationWeeks5")}</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={thirteenthSalary} onChange={(e) => setThirteenthSalary(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("thirteenthSalary")}
              <Tooltip text={t("tooltips.thirteenth")} />
            </label>
            {thirteenthSalary && (
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">{t("thirteenthSalaryAmount")}</label>
                <input type="number" step="0.01" value={thirteenthSalaryAmount} onChange={(e) => setThirteenthSalaryAmount(e.target.value)} placeholder={(Number(salaryAmount) / 12).toFixed(2)} className={inputClass} />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={simplifiedProcedure} onChange={(e) => setSimplifiedProcedure(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("simplifiedProcedureLabel")}
              <Tooltip text={t("tooltips.simplifiedProcedure")} />
            </label>
          </fieldset>

          {/* ── Bloc 5 : Assurance ────────────────────────────── */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-secondary mb-2">
              {t("pdf.insuranceTitle")}
              <Tooltip text={t("tooltips.insurance")} />
            </legend>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={accidentInsurance} onChange={(e) => setAccidentInsurance(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("accidentInsuranceLabel")}
            </label>
          </fieldset>

          {/* ── Bloc 6 : Resiliation ──────────────────────────── */}
          {contractType === "cdi" && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-secondary mb-2">
                {t("pdf.noticeTitle")}
                <Tooltip text={t("tooltips.notice")} />
              </legend>
              <select value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value as typeof NOTICE_PERIODS[number])} className={inputClass}>
                <option value="legal">{t("noticeLegal")}</option>
                <option value="1month">{t("notice1Month")}</option>
                <option value="2months">{t("notice2Months")}</option>
                <option value="3months">{t("notice3Months")}</option>
              </select>
            </fieldset>
          )}

          {/* ── Bloc 7 : Conditions specifiques ──────────────── */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-secondary mb-2">{t("pdf.specificTitle")}</legend>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={accommodation} onChange={(e) => setAccommodation(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("accommodationLabel")}
            </label>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={meals} onChange={(e) => setMeals(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/50" />
              {t("mealsLabel")}
            </label>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("specialConditionsLabel")}</label>
              <textarea value={specialConditions} onChange={(e) => setSpecialConditions(e.target.value)} rows={2} placeholder={t("specialConditionsPlaceholder")} className={inputClass + " resize-none"} />
            </div>
          </fieldset>

          {/* ── Disclaimer ────────────────────────────────────── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700">{t("disclaimer")}</p>
          </div>

          {/* ── Success / Error ───────────────────────────────── */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              {t("savedToDocuments")}
            </div>
          )}
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {saveError}
            </div>
          )}

          {/* ── Submit ────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading || !employeeId}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {loading ? t("generating") : t("generate")}
          </button>
        </form>
      </div>
    </div>
  );
}
