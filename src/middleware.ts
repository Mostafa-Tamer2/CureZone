import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // This will refresh the session if it exists and is expired
  await supabase.auth.getSession();

  return res;
}

// Match all routes except for API routes, static files, and auth callback
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images (all images in the public/Images folder)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|Images/|api/).*)",
  ],
};
