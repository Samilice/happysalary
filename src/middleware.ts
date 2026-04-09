import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Auth protection is handled at the layout level:
// - src/app/[locale]/dashboard/layout.tsx → redirects to /login if no user
// - src/app/[locale]/admin/layout.tsx → redirects if not admin
// This keeps middleware Edge-compatible for Cloudflare Workers (OpenNext).

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // All routes — i18n locale detection & routing only
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api/webhooks|images|favicon.ico|robots.txt|sitemap.xml|hero-video|.*\\..*).*)"],
};
