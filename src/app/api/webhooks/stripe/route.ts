import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy Stripe initialization — avoids crash at build time
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "");
}

// Admin Supabase client for webhooks — requires service role key (never anon)
function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    serviceRoleKey
  );
}

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || ""]: "premium",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || ""]: "premium",
};

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !webhookSecret || !serviceRoleKey) {
    console.error("Missing required env vars for webhook");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = getStripe();

  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer as string;

      if (customerEmail) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();

        if (profile) {
          const lineItems = session.line_items?.data || [];
          const priceId = lineItems[0]?.price?.id || "";
          const plan = PRICE_TO_PLAN[priceId] || "premium";

          await supabase.from("subscriptions").upsert({
            user_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: (session.subscription as string) || null,
            plan,
            status: "active",
            current_period_start: new Date().toISOString(),
          }, { onConflict: "user_id" });

          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("id", profile.id);
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeSubId = subscription.id;
      const status = subscription.status === "active" ? "active"
        : subscription.status === "past_due" ? "past_due"
        : "canceled";

      const item = subscription.items?.data?.[0];
      const periodStart = item?.current_period_start;
      const periodEnd = item?.current_period_end;
      await supabase
        .from("subscriptions")
        .update({
          status,
          ...(periodStart && { current_period_start: new Date(periodStart * 1000).toISOString() }),
          ...(periodEnd && { current_period_end: new Date(periodEnd * 1000).toISOString() }),
        })
        .eq("stripe_subscription_id", stripeSubId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
