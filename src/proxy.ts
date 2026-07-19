import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Next 16 renamed Middleware → Proxy (same functionality). Supabase SSR needs
// this to refresh the auth token cookie on every request; without it you get
// random logouts. No-ops when auth isn't configured.
export async function proxy(request: NextRequest) {
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Try-first: /app is open to everyone (local-first stores). This call still
  // matters — it refreshes the auth token cookie for signed-in users; without
  // it you get random logouts.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip static assets, image optimizer & crawler files — none need session
  // refresh, and robots/sitemap are exactly what bots poll most.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|webp|svg|mp4|webm|ico)$).*)"],
};
