/**
 * Swiss cantonal rates for household employee payroll.
 * Sources: BSV/OFAS, cantonal compensation offices (2024/2025).
 *
 * Federal rates (same across all cantons):
 *   AVS/AI/APG total: 10.6% (5.3% employer + 5.3% employee)
 *   ALV total: 2.2% (1.1% employer + 1.1% employee) on salary up to CHF 148'200/year
 *   ALV solidarity: 1.0% (0.5% + 0.5%) on salary above CHF 148'200/year
 *
 * Canton-specific: family allowance contribution rate (employer only).
 */

export interface CantonRate {
  /** Canton abbreviation (e.g. "VD") */
  code: string;
  /** Canton name in French */
  nameFr: string;
  /** Canton name in German */
  nameDe: string;
  /** Canton name in English */
  nameEn: string;
  /** Family allowance employer contribution rate (%) */
  familyAllowanceRate: number;
  /** Child allowance per child per month (CHF) */
  childAllowance: number;
  /** Education/training allowance per child per month (CHF) */
  educationAllowance: number;
}

export const CANTON_RATES: Record<string, CantonRate> = {
  AG: { code: "AG", nameFr: "Argovie", nameDe: "Aargau", nameEn: "Aargau", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  AI: { code: "AI", nameFr: "Appenzell Rh.-Int.", nameDe: "Appenzell I.Rh.", nameEn: "Appenzell I.Rh.", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  AR: { code: "AR", nameFr: "Appenzell Rh.-Ext.", nameDe: "Appenzell A.Rh.", nameEn: "Appenzell A.Rh.", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  BE: { code: "BE", nameFr: "Berne", nameDe: "Bern", nameEn: "Bern", familyAllowanceRate: 1.51, childAllowance: 230, educationAllowance: 290 },
  BL: { code: "BL", nameFr: "Bâle-Campagne", nameDe: "Basel-Landschaft", nameEn: "Basel-Landschaft", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  BS: { code: "BS", nameFr: "Bâle-Ville", nameDe: "Basel-Stadt", nameEn: "Basel-Stadt", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  FR: { code: "FR", nameFr: "Fribourg", nameDe: "Freiburg", nameEn: "Fribourg", familyAllowanceRate: 2.35, childAllowance: 245, educationAllowance: 305 },
  GE: { code: "GE", nameFr: "Genève", nameDe: "Genf", nameEn: "Geneva", familyAllowanceRate: 2.45, childAllowance: 300, educationAllowance: 400 },
  GL: { code: "GL", nameFr: "Glaris", nameDe: "Glarus", nameEn: "Glarus", familyAllowanceRate: 1.50, childAllowance: 200, educationAllowance: 250 },
  GR: { code: "GR", nameFr: "Grisons", nameDe: "Graubünden", nameEn: "Graubünden", familyAllowanceRate: 1.60, childAllowance: 220, educationAllowance: 270 },
  JU: { code: "JU", nameFr: "Jura", nameDe: "Jura", nameEn: "Jura", familyAllowanceRate: 2.10, childAllowance: 250, educationAllowance: 300 },
  LU: { code: "LU", nameFr: "Lucerne", nameDe: "Luzern", nameEn: "Lucerne", familyAllowanceRate: 2.15, childAllowance: 210, educationAllowance: 260 },
  NE: { code: "NE", nameFr: "Neuchâtel", nameDe: "Neuenburg", nameEn: "Neuchâtel", familyAllowanceRate: 2.71, childAllowance: 220, educationAllowance: 300 },
  NW: { code: "NW", nameFr: "Nidwald", nameDe: "Nidwalden", nameEn: "Nidwalden", familyAllowanceRate: 1.40, childAllowance: 200, educationAllowance: 250 },
  OW: { code: "OW", nameFr: "Obwald", nameDe: "Obwalden", nameEn: "Obwalden", familyAllowanceRate: 1.30, childAllowance: 200, educationAllowance: 250 },
  SG: { code: "SG", nameFr: "Saint-Gall", nameDe: "St. Gallen", nameEn: "St. Gallen", familyAllowanceRate: 2.30, childAllowance: 230, educationAllowance: 280 },
  SH: { code: "SH", nameFr: "Schaffhouse", nameDe: "Schaffhausen", nameEn: "Schaffhausen", familyAllowanceRate: 1.80, childAllowance: 200, educationAllowance: 250 },
  SO: { code: "SO", nameFr: "Soleure", nameDe: "Solothurn", nameEn: "Solothurn", familyAllowanceRate: 1.60, childAllowance: 200, educationAllowance: 250 },
  SZ: { code: "SZ", nameFr: "Schwyz", nameDe: "Schwyz", nameEn: "Schwyz", familyAllowanceRate: 1.50, childAllowance: 200, educationAllowance: 250 },
  TG: { code: "TG", nameFr: "Thurgovie", nameDe: "Thurgau", nameEn: "Thurgau", familyAllowanceRate: 2.00, childAllowance: 200, educationAllowance: 250 },
  TI: { code: "TI", nameFr: "Tessin", nameDe: "Tessin", nameEn: "Ticino", familyAllowanceRate: 1.50, childAllowance: 200, educationAllowance: 250 },
  UR: { code: "UR", nameFr: "Uri", nameDe: "Uri", nameEn: "Uri", familyAllowanceRate: 1.60, childAllowance: 200, educationAllowance: 250 },
  VD: { code: "VD", nameFr: "Vaud", nameDe: "Waadt", nameEn: "Vaud", familyAllowanceRate: 2.78, childAllowance: 300, educationAllowance: 400 },
  VS: { code: "VS", nameFr: "Valais", nameDe: "Wallis", nameEn: "Valais", familyAllowanceRate: 2.35, childAllowance: 295, educationAllowance: 440 },
  ZG: { code: "ZG", nameFr: "Zoug", nameDe: "Zug", nameEn: "Zug", familyAllowanceRate: 1.30, childAllowance: 200, educationAllowance: 250 },
  ZH: { code: "ZH", nameFr: "Zurich", nameDe: "Zürich", nameEn: "Zurich", familyAllowanceRate: 1.20, childAllowance: 200, educationAllowance: 250 },
};

/** Federal social contribution rates (2024/2025) */
export const FEDERAL_RATES = {
  /** AVS + AI + APG combined rate per party (employer or employee) */
  avsAiApg: 5.3,
  /** ALV rate per party (employer or employee) on salary ≤ ceiling */
  alv: 1.1,
  /** ALV solidarity rate per party on salary > ceiling */
  alvSolidarity: 0.5,
  /** ALV salary ceiling (annual) */
  alvCeiling: 148_200,
  /** Occupational accident (BU/AAP) — employer pays. Typical household rate. */
  buRate: 0.17,
  /** Non-occupational accident (NBU/AANP) — employee pays. Typical household rate. */
  nbuRate: 1.28,
  /** Minimum weekly hours for NBU to apply */
  nbuMinWeeklyHours: 8,
  /** Simplified procedure flat income tax rate */
  simplifiedTaxRate: 5.0,
  /** Simplified procedure salary ceiling (annual, per employee) */
  simplifiedCeiling: 22_050,
  /** Admin fee (compensation office). Typical rate. */
  adminFeeRate: 1.5,
  /** Vacation pay supplement for 4 weeks (hourly workers) */
  vacationSupplement4Weeks: 8.33,
  /** Vacation pay supplement for 5 weeks (hourly workers under 20) */
  vacationSupplement5Weeks: 10.64,
} as const;
