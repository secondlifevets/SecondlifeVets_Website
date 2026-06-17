import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware — Supabase Auth Session Management
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session on every request (keeps JWTs fresh)
 * 2. Protect all /admin/* routes — redirect to /login if unauthenticated
 * 3. Protect all /dashboard/* routes - redirect to /login if unauthenticated
 * 4. Ensure unified traffic routing from /login based on Admin emails
 */
const SEO_REDIRECTS: Record<string, string> = {
  '/book': '/book-vet-appointment-lahore',
  '/our-team': '/veterinarian-lahore',
  '/emergency': '/emergency-vet-lahore',
  '/faqs': '/vet-faqs-lahore',
  '/contact': '/contact-vet-lahore',
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Build a Supabase client that reads/writes cookies via the middleware response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to the request (for downstream SSR)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Re-create the response so the updated cookies propagate to the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  if (SEO_REDIRECTS[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = SEO_REDIRECTS[pathname];
    return NextResponse.redirect(url, 301);
  }

  const isAdminRoute = pathname.startsWith("/admin");
  
  const isCustomerRoute = pathname.startsWith("/dashboard");
  const isPublicLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  // ── Route protection logic ────────────────────────────────────────────────
  // We only call getUser() on protected routes to prevent unnecessary network requests
  
  if (isAdminRoute || isCustomerRoute || isPublicLoginPage || isSignupPage) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Define admins by email
    const adminEmails = ['contact@vetsondoor.com', 'admin@vetsondoor.com', 'vetondoor.backend@gmail.com'];
    if (process.env.ADMIN_EMAIL) adminEmails.push(process.env.ADMIN_EMAIL);
    const isAdmin = user && adminEmails.includes(user.email || '');

    // Elite Standard: Preserve refreshed cookies when redirecting!
    const redirectWithCookies = (url: URL) => {
      const response = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
      });
      return response;
    };

    // 1. Admin Routes
    if (isAdminRoute) {
      if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirectTo", pathname);
        return redirectWithCookies(loginUrl);
      } else if (!isAdmin) {
        // Logged in but not an admin -> send to customer dashboard
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        return redirectWithCookies(dashboardUrl);
      }
    }

    // 2. Customer Routes
    if (isCustomerRoute) {
      if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirectTo", pathname);
        return redirectWithCookies(loginUrl);
      } else if (isAdmin) {
        // Admins should not access customer dashboard, route them to admin portal
        const adminUrl = request.nextUrl.clone();
        adminUrl.pathname = "/admin";
        return redirectWithCookies(adminUrl);
      }
    }

    // 3. Public Auth Pages (/login, /signup)
    if (isPublicLoginPage || isSignupPage) {
      if (user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = isAdmin ? "/admin" : "/dashboard";
        return redirectWithCookies(redirectUrl);
      }
    }
  }

  // 4. All other routes — just return with refreshed session cookies
  return supabaseResponse;
}

/**
 * Matcher config — run middleware on these paths only.
 * Excludes static assets, images, and Next.js internals for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Public image files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt|llms-full.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
