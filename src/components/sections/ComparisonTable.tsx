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
    <section className="py-20 lg:py-28 bg-secondary/[0.02]">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <ScrollReveal>
          <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 lg:p-6 text-sm font-medium text-text-muted">
                    {t("feature")}
                  </th>
                  <th className="p-4 lg:p-6 text-center">
                    <span className="text-primary font-bold">HappySalary</span>
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
                    <td className="p-4 lg:p-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {row.hs}
                      </span>
                    </td>
                    <td className="p-4 lg:p-6 text-center">
                      <span className="text-sm text-text-muted">{row.comp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
