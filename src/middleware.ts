import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/dashboard", "/admin", "/onboarding"];
const authPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for path matching
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en|de)/, "") || "/";

  const isProtected = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathnameWithoutLocale.startsWith(p));
  const isApiRoute = pathname.startsWith("/api");

  // Skip auth check for API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // For protected and auth routes, check Supabase session
  if (isProtected || isAuthPage) {
    let response = intlMiddleware(request);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Detect locale from URL
    const localeMatch = pathname.match(/^\/(fr|en|de)/);
    const locale = localeMatch ? localeMatch[1] : "fr";

    if (isProtected && !user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    if (isAuthPage && user) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // Admin route protection
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
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api/webhooks|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
