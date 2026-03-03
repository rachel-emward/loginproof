 "use client";

 import { FormEvent, useState } from "react";
 import Link from "next/link";
 import { useRouter, useSearchParams } from "next/navigation";
 import { supabaseBrowserClient } from "@/lib/supabase/client";
 import { sanitizeAuthError } from "@/lib/auth-errors";

 export default function LoginPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectTo = searchParams.get("redirectTo") || "/dashboard";

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError(null);

     const { error } = await supabaseBrowserClient.auth.signInWithPassword({
       email,
       password,
     });

     setLoading(false);

     if (error) {
       setError(sanitizeAuthError(error.message));
       return;
     }

     router.push(redirectTo);
   };

  return (
    <main className="flex min-h-screen bg-amber-50 text-blue-950">
      <section className="hidden min-h-screen flex-1 flex-col justify-between border-r border-blue-200 bg-white px-16 py-14 lg:flex">
        <div className="space-y-6 text-left">
          <p className="-ml-[0.12em] text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            Chatalaine Investments
          </p>
          <h1 className="max-w-md font-serif text-4xl font-semibold leading-tight text-blue-950">
            Client access to discretionary strategies and private mandates.
          </h1>
          <p className="max-w-sm text-sm text-blue-900">
            Restricted portal. Activity is monitored and recorded. Unauthorized
            use is strictly prohibited.
          </p>
        </div>
        <div className="space-y-1 text-xs text-blue-800">
          <p>New York · London · Singapore</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-800">
            © {new Date().getFullYear()} Chatalaine Investments
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center bg-amber-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8 opacity-0 animate-fade-in-up animation-delay-75">
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600">
              Secure login
            </p>
            <h2 className="font-serif text-2xl font-semibold text-blue-950">
              Client portal
            </h2>
            <p className="text-xs text-blue-900">
              Enter the credentials supplied in your onboarding package.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border border-blue-200 bg-white px-6 py-7 shadow-sm"
          >
            {searchParams.get("timeout") === "1" && (
              <p className="rounded border border-blue-200 bg-blue-50/50 px-3 py-2 text-xs text-blue-950">
                You were signed out due to inactivity. Please sign in again.
              </p>
            )}
            {error && (
              <p className="rounded border border-red-200 bg-red-50/80 px-3 py-2 text-xs text-red-800">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label
                className="block text-xs font-medium uppercase tracking-[0.18em] text-blue-900"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-blue-300 bg-blue-50/50 px-3 py-2.5 text-sm text-blue-950 outline-none transition duration-200 placeholder:text-blue-800 focus:border-blue-900/50 focus:ring-1 focus:ring-blue-900/30"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-xs font-medium uppercase tracking-[0.18em] text-blue-900"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-blue-300 bg-blue-50/50 px-3 py-2.5 text-sm text-blue-950 outline-none transition duration-200 placeholder:text-blue-800 focus:border-blue-900/50 focus:ring-1 focus:ring-blue-900/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded border border-amber-500 bg-amber-500 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition duration-200 hover:bg-amber-600 hover:border-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Authenticating…" : "Enter portfolio"}
            </button>

            <p className="pt-1 text-[10px] leading-relaxed text-blue-800">
              By accessing this portal you confirm you are an authorized client
              or representative and agree to the confidentiality provisions of
              your mandate.
            </p>

            <div className="border-t border-blue-200 pt-5">
              <p className="mb-3 text-xs text-blue-800">
                Don’t have an account?
              </p>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded border border-blue-300 bg-white px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-blue-900 transition duration-200 hover:bg-blue-50 hover:border-blue-400"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
 }
