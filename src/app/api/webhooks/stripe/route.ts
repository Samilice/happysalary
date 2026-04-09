import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer as string;

      if (customerEmail) {
        // Find user by email
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any;
        const { data: profile } = await sb
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();

        if (profile) {
          // Determine plan from amount
          const amount = session.amount_total ? session.amount_total / 100 : 0;
          let plan: "basic" | "comfort" | "premium" = "basic";
          if (amount >= 29) plan = "premium";
          else if (amount >= 19) plan = "comfort";

          await sb.from("subscriptions").upsert({
            user_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: session.subscription as string || null,
            plan,
            status: "active",
            current_period_start: new Date().toISOString(),
          }, { onConflict: "user_id" });

          await sb
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = subscription as any;
      await (supabase as any)
        .from("subscriptions")
        .update({
          status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", stripeSubId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
