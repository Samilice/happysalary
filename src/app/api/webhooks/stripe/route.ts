import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "");
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

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
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
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
        const sb = supabase as Record<string, CallableFunction>;
        const { data: profile } = await (supabase as ReturnType<typeof createServerClient>)
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();

        if (profile) {
          const amount = session.amount_total ? session.amount_total / 100 : 0;
          let plan: "basic" | "comfort" | "premium" = "basic";
          if (amount >= 29) plan = "premium";
          else if (amount >= 19) plan = "comfort";

          await (supabase as ReturnType<typeof createServerClient>).from("subscriptions").upsert({
            user_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: (session.subscription as string) || null,
            plan,
            status: "active" as const,
            current_period_start: new Date().toISOString(),
          } as Record<string, unknown>, { onConflict: "user_id" });

          await (supabase as ReturnType<typeof createServerClient>)
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

      const sub = subscription as unknown as { current_period_start: number; current_period_end: number };
      await (supabase as ReturnType<typeof createServerClient>)
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
