export const PLAN = {
  monthlyPrice: 12.99,
  yearlyPrice: 99,
  currency: "CHF" as const,
  features: [
    "checklist",
    "payroll",
    "payslips",
    "contracts",
    "guidance",
    "support",
    "updates",
  ],
  // Update these with your actual Stripe Payment Links
  monthlyPaymentLink: "https://buy.stripe.com/YOUR_MONTHLY_LINK",
  yearlyPaymentLink: "https://buy.stripe.com/YOUR_YEARLY_LINK",
};
