 "use client";

 import { useState } from "react";
 import { useRouter } from "next/navigation";
 import { supabaseBrowserClient } from "@/lib/supabase/client";

 export function LogoutButton() {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   const handleLogout = async () => {
     setLoading(true);
     await supabaseBrowserClient.auth.signOut();
     setLoading(false);
     router.push("/login");
   };

   return (
     <button
       type="button"
       onClick={handleLogout}
       disabled={loading}
      className="inline-flex items-center rounded border border-amber-500 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-700 transition duration-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
     >
       {loading ? "Logging out…" : "Logout"}
     </button>
   );
 }

