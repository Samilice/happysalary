import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

// Swiss social contribution rates (2024/2025)
const RATES = {
  avs_ai_apg_employee: 0.053,  // 5.3%
  avs_ai_apg_employer: 0.053,
  ac_employee: 0.011,           // 1.1%
  ac_employer: 0.011,
  laa_anp_estimate: 0.014,     // ~1.4% estimate for non-occupational
};

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  const { employeeId, month, year, type } = await request.json();

  if (!employeeId || !month || !year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Restrict payslip generation to current month only
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (type === "salary_sheet" && (month !== currentMonth || year !== currentYear)) {
    return NextResponse.json(
      { error: "Les fiches de salaire ne peuvent être générées que pour le mois en cours." },
      { status: 403 }
    );
  }

  // Check if payslip already exists for this employee/month/year
  const { data: existing } = await supabase
    .from("documents")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("type", "salary_sheet")
    .eq("period_month", month)
    .eq("period_year", year)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "Une fiche de salaire existe déjà pour ce mois. Consultez l'onglet Documents." },
      { status: 409 }
    );
  }

  // Fetch employee + employer data
  const { data: employee } = await supabase
    .from("employees")
    .select("*, employer:employers(*)")
    .eq("id", employeeId)
    .single();

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const employer = (employee as any).employer;
  const docType = type || "salary_sheet";

  if (docType === "salary_sheet") {
    return generatePayslip(supabase, employee, employer, month, year);
  }

  return NextResponse.json({ error: "Unsupported document type" }, { status: 400 });
}

async function generatePayslip(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  employee: any,
  employer: any,
  month: number,
  year: number
) {
  const grossSalary = Number(employee.monthly_salary);

  // Calculate deductions
  const avsAiApg = grossSalary * RATES.avs_ai_apg_employee;
  const ac = grossSalary * RATES.ac_employee;
  const laaAnp = grossSalary * RATES.laa_anp_estimate;
  const totalDeductions = avsAiApg + ac + laaAnp;
  const netSalary = grossSalary - totalDeductions;

  // Employer contributions
  const empAvsAiApg = grossSalary * RATES.avs_ai_apg_employer;
  const empAc = grossSalary * RATES.ac_employer;

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const periodLabel = `${monthNames[month - 1]} ${year}`;

  // Generate PDF
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // --- HEADER ---
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 54, 93); // secondary color
  doc.text("FICHE DE SALAIRE", margin, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(periodLabel, pageWidth - margin, y, { align: "right" });

  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // --- EMPLOYER INFO ---
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("EMPLOYEUR", margin, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text(`${employer.first_name} ${employer.last_name}`, margin, y);
  if (employer.company_name) {
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(employer.company_name, margin, y);
  }
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`${employer.address_street}`, margin, y);
  y += 5;
  doc.text(`${employer.address_postal_code} ${employer.address_city} (${employer.address_canton})`, margin, y);

  // --- EMPLOYEE INFO (right side) ---
  let ey = y - (employer.company_name ? 20 : 15);
  const rightCol = pageWidth / 2 + 10;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("EMPLOYÉ(E)", rightCol, ey);
  ey += 5;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text(`${employee.first_name} ${employee.last_name}`, rightCol, ey);
  ey += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`${employee.address_street}`, rightCol, ey);
  ey += 5;
  doc.text(`${employee.address_postal_code} ${employee.address_city}`, rightCol, ey);
  ey += 5;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`N° AVS : ${employee.avs_number}`, rightCol, ey);

  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- EMPLOYMENT DETAILS ---
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("DÉTAILS DE L'EMPLOI", margin, y);
  y += 6;

  const detailRows = [
    ["Fonction", employee.job_title],
    ["Heures mensuelles", `${employee.monthly_hours}h`],
    ["Taux horaire", `CHF ${Number(employee.hourly_rate).toFixed(2)}`],
    ["Période", periodLabel],
  ];

  doc.setFontSize(9);
  for (const [label, value] of detailRows) {
    doc.setTextColor(100, 100, 100);
    doc.text(label, margin, y);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(value, margin + 60, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  }

  y += 8;

  // --- SALARY TABLE ---
  // Table header
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, y - 4, contentWidth, 8, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("RUBRIQUE", margin + 3, y);
  doc.text("TAUX", margin + 100, y);
  doc.text("MONTANT (CHF)", pageWidth - margin - 3, y, { align: "right" });
  y += 8;

  // Gross salary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("Salaire brut", margin + 3, y);
  doc.text(grossSalary.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Deductions header
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("DÉDUCTIONS EMPLOYÉ(E)", margin + 3, y);
  y += 6;

  const deductionRows = [
    ["AVS / AI / APG", `${(RATES.avs_ai_apg_employee * 100).toFixed(1)}%`, avsAiApg],
    ["AC (assurance chômage)", `${(RATES.ac_employee * 100).toFixed(1)}%`, ac],
    ["LAA ANP (accidents non prof.)", `~${(RATES.laa_anp_estimate * 100).toFixed(1)}%`, laaAnp],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const [label, rate, amount] of deductionRows) {
    doc.setTextColor(80, 80, 80);
    doc.text(label as string, margin + 3, y);
    doc.setTextColor(120, 120, 120);
    doc.text(rate as string, margin + 100, y);
    doc.setTextColor(220, 60, 60);
    doc.text(`- ${(amount as number).toFixed(2)}`, pageWidth - margin - 3, y, { align: "right" });
    y += 6;
  }

  // Total deductions
  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin + 80, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Total des déductions", margin + 3, y);
  doc.setTextColor(220, 60, 60);
  doc.text(`- ${totalDeductions.toFixed(2)}`, pageWidth - margin - 3, y, { align: "right" });

  // Net salary
  y += 12;
  doc.setFillColor(26, 54, 93); // dark blue
  doc.rect(margin, y - 5, contentWidth, 12, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SALAIRE NET À VERSER", margin + 3, y + 2);
  doc.text(`CHF ${netSalary.toFixed(2)}`, pageWidth - margin - 3, y + 2, { align: "right" });

  // Employer contributions section
  y += 20;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("CHARGES PATRONALES (pour information)", margin + 3, y);
  y += 6;

  const employerRows = [
    ["AVS / AI / APG (part employeur)", `${(RATES.avs_ai_apg_employer * 100).toFixed(1)}%`, empAvsAiApg],
    ["AC (part employeur)", `${(RATES.ac_employer * 100).toFixed(1)}%`, empAc],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const [label, rate, amount] of employerRows) {
    doc.setTextColor(80, 80, 80);
    doc.text(label as string, margin + 3, y);
    doc.setTextColor(120, 120, 120);
    doc.text(rate as string, margin + 100, y);
    doc.setTextColor(80, 80, 80);
    doc.text((amount as number).toFixed(2), pageWidth - margin - 3, y, { align: "right" });
    y += 6;
  }

  // --- FOOTER ---
  const footerY = 270;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("Document généré par HappySalary — happysalary.ch", margin, footerY + 5);
  doc.text(`Ce document est fourni à titre indicatif. L'employeur reste responsable de l'exactitude des informations.`, margin, footerY + 9);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-CH")}`, pageWidth - margin, footerY + 5, { align: "right" });

  // Convert to base64
  const pdfBase64 = doc.output("datauristring");
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  // Upload to Supabase Storage (if configured) or store inline
  const title = `Fiche de salaire — ${employee.first_name} ${employee.last_name} — ${periodLabel}`;

  // Save document record
  const { data: docRecord, error: docError } = await supabase
    .from("documents")
    .insert({
      employee_id: employee.id,
      type: "salary_sheet",
      title,
      period_month: month,
      period_year: year,
      status: "ready",
      generated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 });
  }

  // Return the PDF as base64 for preview + the document record
  return NextResponse.json({
    document: docRecord,
    pdf: pdfBase64,
    filename: `fiche-salaire-${employee.last_name.toLowerCase()}-${monthNames[month - 1].toLowerCase()}-${year}.pdf`,
  });
}

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
