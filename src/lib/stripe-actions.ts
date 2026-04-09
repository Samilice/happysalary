"use server";

import { getStripe } from "./stripe";
import { plans } from "./plans";
import type { PlanId } from "./plans";

export async function createCheckoutSession(planId: PlanId, locale: string) {
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/cancel`,
    locale: locale === "fr" ? "fr" : locale === "de" ? "de" : "en",
    allow_promotion_codes: true,
    billing_address_collection: "required",
    customer_creation: "always",
  });

  return { url: session.url, id: session.id };
}
