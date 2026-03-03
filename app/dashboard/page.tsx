import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardChart } from "./DashboardChart";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const clientName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    (user.email?.split("@")[0] ?? "Client");
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const {
    data: documents,
    error,
  } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex min-h-screen flex-col bg-blue-50 text-blue-950">
      <header className="border-b border-blue-200 bg-white py-5 shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-8">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600">
              Chatalaine Investments
            </p>
            <h1 className="font-serif text-xl font-semibold text-blue-950">
              Client Portal
            </h1>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="text-xs text-blue-900">
              <p className="font-medium text-blue-950">{user.email}</p>
              <p className="flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.18em] text-blue-800">
                <span className="inline-block size-2.5 rounded-full bg-emerald-500" aria-hidden />
                Secure session
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-8 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2 rounded-lg border border-blue-200 bg-white px-6 py-5 shadow-sm opacity-0 animate-fade-in-up transition-shadow duration-200 hover:border-blue-300/60 hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Account status
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <p className="font-serif text-3xl text-blue-950">
                {timeGreeting}, {clientName}
              </p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-800">
                Client
              </span>
            </div>
            <p className="mt-3 text-xs text-blue-900">
              {documents?.length
                ? `You have ${documents.length} document${documents.length === 1 ? "" : "s"} in your account.`
                : "No documents in your account yet."}
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-white px-6 py-5 text-xs text-blue-900 shadow-sm opacity-0 animate-fade-in-up animation-delay-75 transition-shadow duration-200 hover:border-blue-300/60 hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Session
            </p>
            <div className="mt-3 space-y-1.5">
              <p>
                Last sign-in:{" "}
                <span className="text-blue-950">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "Just now"}
                </span>
              </p>
              <p>Environment: Production</p>
              <p>Access level: Client</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-white px-6 py-5 shadow-sm opacity-0 animate-fade-in-up animation-delay-150 transition-shadow duration-200 hover:border-blue-300/60 hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-blue-950">
                Secure document room
              </h2>
              <p className="text-xs text-blue-900">
                Mandate letters, quarterly letters, and research memoranda.
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded border border-red-200 bg-red-50/80 p-3 text-xs text-red-800">
              Failed to load documents: {error.message}
            </p>
          )}

          {!error && (!documents || documents.length === 0) && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-5 py-6 text-center">
              <p className="text-sm font-medium text-blue-950">
                Your document room is ready
              </p>
              <p className="mt-1 text-xs text-blue-800">
                Mandate letters, quarterly letters, and research memoranda will
                appear here once shared by your relationship team.
              </p>
            </div>
          )}

          {!error && documents && documents.length > 0 && (
            <div className="overflow-hidden rounded border border-blue-200">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-blue-50">
                  <tr className="border-b border-blue-200 text-[11px] uppercase tracking-[0.18em] text-blue-900">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc: any, idx: number) => (
                    <tr
                      key={doc.id}
                      className="border-b border-blue-100 last:border-0 odd:bg-white even:bg-blue-50/50 transition-colors duration-150 hover:bg-blue-50"
                    >
                      <td className="px-4 py-3 font-medium text-blue-950">
                        {doc.title ?? `Document ${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-blue-900">
                        {doc.created_at
                          ? new Date(doc.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-[11px] text-blue-800">
                        {String(doc.id).slice(0, 8).toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-blue-200 bg-white px-6 py-5 shadow-sm opacity-0 animate-fade-in-up animation-delay-300 transition-shadow duration-200 hover:border-blue-300/60 hover:shadow-md">
          <div className="mb-4">
            <h2 className="font-serif text-lg font-semibold text-blue-950">
              Overview
            </h2>
            <p className="text-xs text-blue-900">
              Placeholder price series (not live data).
            </p>
          </div>
          <DashboardChart />
        </div>
      </section>
    </main>
  );
}
