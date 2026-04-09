import Stripe from "stripe";

// Lazy initialization — avoids crash at build time when env vars are missing
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      typescript: true,
    });
  }
  return _stripe;
}
