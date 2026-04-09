"use server";

import { getStripe } from "./stripe";

export async function createCheckoutSession(billing: "monthly" | "yearly", locale: string) {
  const priceId = billing === "monthly"
    ? process.env.STRIPE_PRICE_MONTHLY || ""
    : process.env.STRIPE_PRICE_YEARLY || "";

  if (!priceId) throw new Error("Stripe price not configured");

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/cancel`,
    locale: locale === "fr" ? "fr" : locale === "de" ? "de" : "en",
    allow_promotion_codes: true,
    billing_address_collection: "required",
    customer_creation: "always",
  });

  return { url: session.url, id: session.id };
}
