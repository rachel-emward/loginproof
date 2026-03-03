"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase/client";

const IDLE_MINUTES = 15;
const IDLE_MS = IDLE_MINUTES * 60 * 1000;

/**
 * Redirects to login after IDLE_MINUTES of no user activity (mouse, keyboard, focus).
 * Supports SEC-style session timeout requirements.
 */
export function SessionTimeout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      await supabaseBrowserClient.auth.signOut();
      router.push("/login?timeout=1");
    }, IDLE_MS);
  }, [router]);

  useEffect(() => {
    resetTimer();
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    const onVisibility = () => {
      if (document.visibilityState === "visible") resetTimer();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", onVisibility);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer]);

  return <>{children}</>;
}
