"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import {
  clearApiToken,
  exchangeGithubToken,
  getApiToken,
} from "@/lib/api";

function AuthBridge({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function sync() {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        clearApiToken();
        if (!cancelled) {
          setError(null);
          setReady(true);
        }
        return;
      }
      if (session?.accessToken) {
        try {
          await exchangeGithubToken(session.accessToken);
          if (!cancelled) {
            setError(null);
            setReady(true);
          }
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : "API auth xato");
            setReady(true);
          }
        }
        return;
      }
      if (getApiToken()) {
        if (!cancelled) setReady(true);
        return;
      }
      if (!cancelled) {
        setError("GitHub access token topilmadi. Qayta login qiling.");
        setReady(true);
      }
    }
    void sync();
    return () => {
      cancelled = true;
    };
  }, [session, status]);

  if (status === "loading" || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--fg-muted)]">
        Yuklanmoqda...
      </div>
    );
  }

  if (error && status === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-400">{error}</p>
        <button
          type="button"
          className="rounded-lg bg-[var(--btn)] px-4 py-2 text-sm text-[var(--btn-fg)]"
          onClick={() => {
            clearApiToken();
            void signOut({ callbackUrl: "/login" });
          }}
        >
          Qayta login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  );
}
