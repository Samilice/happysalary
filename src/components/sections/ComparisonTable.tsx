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
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-primary font-bold text-base">HappySalary</span>
                    </div>
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

          {/* Mobile: side-by-side comparison cards */}
          <div className="sm:hidden space-y-3">
            {/* Column headers */}
            <div className="flex gap-2 mb-1 px-1">
              <div className="flex-1" />
              <div className="w-[100px] text-center">
                <span className="text-xs font-bold text-primary">HappySalary</span>
              </div>
              <div className="w-[100px] text-center">
                <span className="text-xs font-medium text-text-muted">{t("competitors")}</span>
              </div>
            </div>
            {rows.map((row) => (
              <div key={row.key} className="bg-white rounded-xl border border-border p-3 shadow-sm">
                <p className="text-xs font-medium text-text mb-2">{t(row.key)}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-success/10 rounded-lg px-2 py-1.5 text-center">
                    <span className="text-xs font-semibold text-success flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {row.hs}
                    </span>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg px-2 py-1.5 text-center">
                    <span className="text-xs text-red-400 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {row.comp}
                    </span>
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
