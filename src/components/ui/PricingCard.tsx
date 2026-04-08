import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/plans";

type Props = {
  plan: Plan;
};

export function PricingCard({ plan }: Props) {
  const t = useTranslations("pricing");
  const tc = useTranslations("common");

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-surface border p-6 lg:p-8 flex flex-col h-full transition-all duration-300",
        plan.highlighted
          ? "border-primary shadow-xl shadow-primary/10 lg:scale-105"
          : "border-border hover:border-primary/20 hover:shadow-lg"
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary">{tc("mostPopular")}</Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-secondary">{t(`${plan.id}.name`)}</h3>
        <p className="text-sm text-text-muted mt-1">{t(`${plan.id}.description`)}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-secondary">
            CHF {plan.price.toFixed(2).replace(".", ".")}
          </span>
        </div>
        <p className="text-sm text-text-muted mt-1">
          {tc("perEmployee")} / {tc("perMonth")}
        </p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex items-center gap-3">
            {feature.included ? (
              <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={cn("text-sm", feature.included ? "text-text" : "text-text-light")}>
              {t(`features.${feature.key}`)}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold px-6 py-3 w-full transition-all duration-200",
          plan.highlighted
            ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25"
            : "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
        )}
      >
        {t("cta")}
      </a>
    </div>
  );
}
