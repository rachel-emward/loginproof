 import { NextRequest, NextResponse } from "next/server";
 import { createServerClient } from "@supabase/ssr";

 const SECURITY_HEADERS: [string, string][] = [
   ["X-Frame-Options", "DENY"],
   ["X-Content-Type-Options", "nosniff"],
   ["Referrer-Policy", "strict-origin-when-cross-origin"],
 ];

 export async function middleware(req: NextRequest) {
   // Enforce HTTPS in production
   if (
     process.env.NODE_ENV === "production" &&
     req.headers.get("x-forwarded-proto") === "http"
   ) {
     const url = req.nextUrl.clone();
     url.protocol = "https:";
     return NextResponse.redirect(url, 301);
   }

   const res = NextResponse.next();
   SECURITY_HEADERS.forEach(([key, value]) => {
     res.headers.set(key, value);
   });
   if (process.env.NODE_ENV === "production") {
     res.headers.set(
       "Strict-Transport-Security",
       "max-age=31536000; includeSubDomains; preload"
     );
   }

   const supabase = createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         get(name: string) {
           return req.cookies.get(name)?.value;
         },
         set(name: string, value: string, options: any) {
           res.cookies.set(name, value, options);
         },
         remove(name: string, options: any) {
           res.cookies.delete(name, options);
         },
       },
     }
   );

   const {
     data: { user },
   } = await supabase.auth.getUser();

   const isAuth = !!user;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = req.nextUrl.pathname === "/login";
  const isSignupRoute = req.nextUrl.pathname === "/signup";

   if (!isAuth && isAuthRoute) {
     const redirectUrl = new URL("/login", req.url);
     redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
     const redirectRes = NextResponse.redirect(redirectUrl);
     SECURITY_HEADERS.forEach(([key, value]) =>
       redirectRes.headers.set(key, value)
     );
     return redirectRes;
   }

   if (isAuth && (isLoginRoute || isSignupRoute)) {
     const redirectRes = NextResponse.redirect(new URL("/dashboard", req.url));
     SECURITY_HEADERS.forEach(([key, value]) =>
       redirectRes.headers.set(key, value)
     );
     return redirectRes;
   }

   return res;
 }

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
