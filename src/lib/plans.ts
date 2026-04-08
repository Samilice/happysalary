export type PlanId = "basic" | "comfort" | "premium";

export interface PlanFeature {
  key: string;
  included: boolean;
}

export interface Plan {
  id: PlanId;
  price: number;
  currency: "CHF";
  interval: "month";
  highlighted: boolean;
  stripePriceId: string;
  paymentLink: string;
  features: PlanFeature[];
}

export const plans: Plan[] = [
  {
    id: "basic",
    price: 9.9,
    currency: "CHF",
    interval: "month",
    highlighted: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "",
    paymentLink: "https://buy.stripe.com/aFadR914E1QL0OieTt4Ja00",
    features: [
      { key: "payroll", included: true },
      { key: "socialContributions", included: true },
      { key: "payslips", included: true },
      { key: "annualStatement", included: true },
      { key: "accidentInsurance", included: false },
      { key: "employmentContract", included: false },
      { key: "sicknessInsurance", included: false },
      { key: "prioritySupport", included: false },
      { key: "legalAdvice", included: false },
    ],
  },
  {
    id: "comfort",
    price: 19.9,
    currency: "CHF",
    interval: "month",
    highlighted: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_COMFORT || "",
    paymentLink: "https://buy.stripe.com/8x2fZh14E7b5fJc7r14Ja01",
    features: [
      { key: "payroll", included: true },
      { key: "socialContributions", included: true },
      { key: "payslips", included: true },
      { key: "annualStatement", included: true },
      { key: "accidentInsurance", included: true },
      { key: "employmentContract", included: true },
      { key: "sicknessInsurance", included: true },
      { key: "prioritySupport", included: false },
      { key: "legalAdvice", included: false },
    ],
  },
  {
    id: "premium",
    price: 29.9,
    currency: "CHF",
    interval: "month",
    highlighted: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || "",
    paymentLink: "https://buy.stripe.com/fZudR9aFe6710Oi4eP4Ja02",
    features: [
      { key: "payroll", included: true },
      { key: "socialContributions", included: true },
      { key: "payslips", included: true },
      { key: "annualStatement", included: true },
      { key: "accidentInsurance", included: true },
      { key: "employmentContract", included: true },
      { key: "sicknessInsurance", included: true },
      { key: "prioritySupport", included: true },
      { key: "legalAdvice", included: true },
    ],
  },
];
