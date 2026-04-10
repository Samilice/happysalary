import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Run intl middleware first to get the response
  const response = intlMiddleware(request);

  // Refresh Supabase session on every request to keep auth cookies alive
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

  // This refreshes the session token if needed and writes updated cookies
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next|api/webhooks|images|favicon.ico|robots.txt|sitemap.xml|hero-video|.*\\..*).*)"],
};
