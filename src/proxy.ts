import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPaths = ["/dashboard", "/admin", "/onboarding"];
const authPaths = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Strip locale prefix for path matching
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en|de)/, "") || "/";
  const isProtected = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathnameWithoutLocale.startsWith(p));

  // For protected/auth routes, try Supabase auth check
  if (isProtected || isAuthPage) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // No Supabase config — just do i18n routing
        return intlMiddleware(request);
      }

      const { createServerClient } = await import("@supabase/ssr");

      let response = intlMiddleware(request);

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();

      const localeMatch = pathname.match(/^\/(fr|en|de)/);
      const locale = localeMatch ? localeMatch[1] : "fr";

      if (isProtected && !user) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }

      if (isAuthPage && user) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
      }

      if (pathnameWithoutLocale.startsWith("/admin") && user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
        }
      }

      return response;
    } catch (e) {
      // If Supabase fails, just do i18n routing
      console.error("Middleware auth error:", e);
      return intlMiddleware(request);
    }
  }

  // All other routes — just i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api/webhooks|images|favicon.ico|robots.txt|sitemap.xml|hero-video|.*\\..*).*)"],
};
