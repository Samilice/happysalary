"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { calculatePayslip } from "@/lib/salary-calculator";
import { CANTON_RATES } from "@/lib/canton-rates";
import { Link } from "@/i18n/navigation";

type Variant = "homepage" | "landing";

type Props = {
  variant?: Variant;
};

const CANTON_CODES = Object.keys(CANTON_RATES).sort();

export function FreemiumCalculator({ variant = "homepage" }: Props) {
  const t = useTranslations("calculator");
  const locale = useLocale();

  const [hours, setHours] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [canton, setCanton] = useState("VD");
  const [calculated, setCalculated] = useState(false);

  const cantonName = useMemo(() => {
    const c = CANTON_RATES[canton];
    if (!c) return canton;
    if (locale === "de") return c.nameDe;
    if (locale === "en") return c.nameEn;
    return c.nameFr;
  }, [canton, locale]);

  const result = useMemo(() => {
    const h = typeof hours === "number" ? hours : 0;
    const r = typeof rate === "number" ? rate : 0;
    if (h <= 0 || r <= 0) return null;
    try {
      return calculatePayslip({
        hoursWorked: h,
        hourlyRate: r,
        canton,
        isUnder20: false,
      });
    } catch {
      return null;
    }
  }, [hours, rate, canton]);

  function chf(n: number): string {
    return n.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleCalculate() {
    if (result) setCalculated(true);
  }

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary focus:bg-white/15 transition-all text-base backdrop-blur-sm";

  const isLanding = variant === "landing";

  return (
    <section
      id="calculator"
      className={
        isLanding
          ? "py-12 sm:py-16"
          : "py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-secondary via-secondary to-secondary-light"
      }
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${isLanding ? "" : ""}`}>
        {/* Header */}
        {!isLanding && (
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              {t("badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              {t("title")}
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        )}

        <div className={`max-w-2xl mx-auto ${isLanding ? "" : ""}`}>
          {/* Calculator card */}
          <div className={`rounded-3xl p-6 sm:p-8 ${isLanding ? "bg-secondary" : "bg-white/5 backdrop-blur-md border border-white/10"}`}>
            {/* Inputs */}
            <div className={`grid gap-4 ${isLanding ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  {t("hoursLabel")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hours}
                  onChange={(e) => {
                    setHours(e.target.value ? Number(e.target.value) : "");
                    setCalculated(false);
                  }}
                  className={inputClass}
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  {t("rateLabel")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value ? Number(e.target.value) : "");
                    setCalculated(false);
                  }}
                  className={inputClass}
                  placeholder="30"
                />
              </div>
              {isLanding && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    {t("cantonLabel")}
                  </label>
                  <select
                    value={canton}
                    onChange={(e) => {
                      setCanton(e.target.value);
                      setCalculated(false);
                    }}
                    className={inputClass}
                  >
                    {CANTON_CODES.map((code) => (
                      <option key={code} value={code} className="bg-secondary text-white">
                        {code} — {CANTON_RATES[code].nameFr}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* CTA button */}
            <button
              onClick={handleCalculate}
              disabled={!result}
              className="mt-6 w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/30 cursor-pointer"
            >
              {t("calculateCta")}
            </button>

            {/* Results — animated reveal */}
            {calculated && result && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Net salary — hero number */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-1">
                    {t("resultNet")}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-white">
                    CHF {chf(result.netSalary)}
                  </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/5">
                    <p className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                      {t("resultGross")}
                    </p>
                    <p className="text-sm sm:text-lg font-bold text-white">
                      CHF {chf(result.totalGross)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/5">
                    <p className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                      {t("resultCharges")}
                    </p>
                    <p className="text-sm sm:text-lg font-bold text-white">
                      CHF {chf(result.totalCharges)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/5">
                    <p className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                      {t("resultCost")}
                    </p>
                    <p className="text-sm sm:text-lg font-bold text-white">
                      CHF {chf(result.totalEmployerCost)}
                    </p>
                  </div>
                </div>

                {/* Canton info */}
                {isLanding && (
                  <p className="text-center text-xs text-white/40 mb-6">
                    {t("cantonInfo", { canton: cantonName })}
                  </p>
                )}

                {/* Blurred detail teaser */}
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Fake detail rows — blurred */}
                  <div className="bg-white/5 rounded-2xl p-4 sm:p-5 space-y-2.5 select-none" aria-hidden="true">
                    <div className="flex justify-between blur-[3px]">
                      <span className="text-sm text-white/60">AVS / AI / APG (5.3%)</span>
                      <span className="text-sm text-white/80">CHF {chf(result.employeeAvsAiApg)}</span>
                    </div>
                    <div className="flex justify-between blur-[3px]">
                      <span className="text-sm text-white/60">AC (1.1%)</span>
                      <span className="text-sm text-white/80">CHF {chf(result.employeeAlv)}</span>
                    </div>
                    <div className="flex justify-between blur-[3px]">
                      <span className="text-sm text-white/60">AANP (1.28%)</span>
                      <span className="text-sm text-white/80">CHF {chf(result.employeeNbu)}</span>
                    </div>
                    <div className="flex justify-between blur-[3px]">
                      <span className="text-sm text-white/60">{t("blurredLine1")}</span>
                      <span className="text-sm text-white/80">CHF ...</span>
                    </div>
                    <div className="flex justify-between blur-[3px]">
                      <span className="text-sm text-white/60">{t("blurredLine2")}</span>
                      <span className="text-sm text-white/80">CHF ...</span>
                    </div>
                  </div>

                  {/* Overlay with CTA */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/90 to-transparent flex flex-col items-center justify-end pb-5 sm:pb-6 px-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{t("paywallTitle")}</p>
                    <p className="text-xs text-white/50 mb-4 text-center max-w-xs">{t("paywallSubtitle")}</p>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
                    >
                      {t("paywallCta")}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trust line under calculator */}
          {!calculated && (
            <p className="text-center text-xs text-white/30 mt-4">
              {t("trustLine")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
