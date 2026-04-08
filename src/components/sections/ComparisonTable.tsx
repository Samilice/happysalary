import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ComparisonTable() {
  const t = useTranslations("home.comparison");

  const rows = [
    { key: "pricingModel", hs: t("flatFee"), comp: t("commission"), hsWin: true },
    { key: "hiddenCosts", hs: t("none"), comp: t("possible"), hsWin: true },
    { key: "allInclusive", hs: t("yes"), comp: t("extra"), hsWin: true },
    { key: "support", hs: t("included"), comp: t("paid"), hsWin: true },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-secondary/[0.02]">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <ScrollReveal>
          {/* Desktop: table */}
          <div className="hidden sm:block max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/20 bg-background-alt/50">
                  <th className="text-left p-4 lg:p-6 text-sm font-medium text-text-muted">
                    {t("feature")}
                  </th>
                  <th className="p-4 lg:p-6 text-center bg-primary/5">
                    <span className="text-primary font-bold text-base">HappySalary</span>
                  </th>
                  <th className="p-4 lg:p-6 text-center">
                    <span className="text-text-muted font-medium">{t("competitors")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.key} className={idx < rows.length - 1 ? "border-b border-border" : ""}>
                    <td className="p-4 lg:p-6 text-sm font-medium text-text">
                      {t(row.key)}
                    </td>
                    <td className="p-4 lg:p-6 text-center bg-primary/5">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {row.hs}
                      </span>
                    </td>
                    <td className="p-4 lg:p-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm text-red-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {row.comp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: clean two-column table */}
          <div className="sm:hidden overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            {/* Header row */}
            <div className="grid grid-cols-2 border-b-2 border-primary/20">
              <div className="p-3 text-center bg-primary/5 border-r border-border">
                <span className="text-sm font-bold text-primary">HappySalary</span>
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-medium text-text-muted">{t("competitors")}</span>
              </div>
            </div>
            {/* Data rows */}
            {rows.map((row, idx) => (
              <div key={row.key} className={idx < rows.length - 1 ? "border-b border-border" : ""}>
                <div className="px-3 pt-3 pb-1">
                  <span className="text-xs font-semibold text-text uppercase tracking-wide">{t(row.key)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-3 pt-1 bg-primary/5 border-r border-border">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-semibold text-success">{row.hs}</span>
                    </div>
                  </div>
                  <div className="p-3 pt-1">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm text-red-400">{row.comp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
