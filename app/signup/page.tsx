 "use client";

 import { FormEvent, useState } from "react";
 import Link from "next/link";
 import { useRouter } from "next/navigation";
 import { supabaseBrowserClient } from "@/lib/supabase/client";
 import { sanitizeAuthError } from "@/lib/auth-errors";

 export default function SignupPage() {
   const router = useRouter();

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [message, setMessage] = useState<string | null>(null);

   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError(null);
     setMessage(null);

     const { data, error } = await supabaseBrowserClient.auth.signUp({
       email,
       password,
       options: { data: { full_name: name.trim() } },
     });

     setLoading(false);

     if (error) {
       setError(sanitizeAuthError(error.message));
       return;
     }

     if (data.user && !data.session) {
       setMessage("Check your email to confirm your account.");
       return;
     }

     router.push("/dashboard");
   };

  return (
    <main className="flex min-h-screen bg-amber-50 text-blue-950">
      <section className="hidden min-h-screen flex-1 flex-col justify-between border-r border-blue-200 bg-white px-16 py-14 lg:flex">
        <div className="space-y-6 text-left">
          <p className="-ml-[0.12em] text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            Chatalaine Investments
          </p>
          <h1 className="max-w-md font-serif text-4xl font-semibold leading-tight text-blue-950">
            Onboard to discretionary strategies and research access.
          </h1>
          <p className="max-w-sm text-sm text-blue-900">
            This enrollment form is reserved for approved investors. Submissions
            are reviewed by our client services team.
          </p>
        </div>
        <div className="space-y-1 text-xs text-blue-800">
          <p>Investor relations · [CONTACT EMAIL]</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-800">
            Confidential · Do not forward
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center bg-amber-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8 opacity-0 animate-fade-in-up animation-delay-75">
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600">
              Investor enrollment
            </p>
            <h2 className="font-serif text-2xl font-semibold text-blue-950">
              Request access
            </h2>
            <p className="text-xs text-blue-900">
              Use the same identity details you provided to our onboarding team.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border border-blue-200 bg-white px-6 py-7 shadow-sm"
          >
            {error && (
              <div className="space-y-2">
                <p className="rounded border border-red-200 bg-red-50/80 px-3 py-2 text-xs text-red-800">
                  {error}
                </p>
                <p className="text-xs text-blue-900">
                  <Link
                    href="/login"
                    className="font-medium text-amber-600 underline hover:text-amber-700"
                  >
                    Sign in
                  </Link>{" "}
                  if you already have an account.
                </p>
              </div>
            )}

            {message && (
              <p className="rounded border border-blue-200 bg-blue-50/50 px-3 py-2 text-xs text-blue-950">
                {message}
              </p>
            )}

            <div className="space-y-1.5">
              <label
                className="block text-xs font-medium uppercase tracking-[0.18em] text-blue-900"
                htmlFor="name"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-blue-300 bg-blue-50/50 px-3 py-2.5 text-sm text-blue-950 outline-none transition duration-200 placeholder:text-blue-800 focus:border-blue-900/50 focus:ring-1 focus:ring-blue-900/30"
              />
            </div>

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
              {loading ? "Submitting…" : "Submit request"}
            </button>

            <p className="pt-1 text-[10px] leading-relaxed text-blue-800">
              Access remains subject to eligibility verification and regulatory
              requirements in your jurisdiction.
            </p>

            <div className="border-t border-blue-200 pt-5">
              <p className="mb-3 text-xs text-blue-800">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded border border-blue-300 bg-white px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-blue-900 transition duration-200 hover:bg-blue-50 hover:border-blue-400"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
 }

