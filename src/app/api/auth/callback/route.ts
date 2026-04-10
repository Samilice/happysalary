import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getSafeRedirect(next: string | null): string {
  const fallback = "/fr/dashboard";
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes(":\\")) return fallback;
  try {
    const url = new URL(next, "http://localhost");
    if (url.hostname !== "localhost") return fallback;
  } catch {
    return fallback;
  }
  return next;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://happysalary.ch";
  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next") ?? "/fr/dashboard");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/fr/login?error=auth`);
}
