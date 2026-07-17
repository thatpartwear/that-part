"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// Supabase's confirmation/recovery emails land here instead of directly in
// the app. Depending on the project's auth flow, the session arrives as:
//  - an implicit-flow hash fragment (#access_token=...) — never sent to the
//    server, so only the browser client can see it (auto-processed on init)
//  - a PKCE `code` query param — exchanged client-side
//  - a `token_hash` + `type` pair — verified via an OTP call
// This page tries all three so it works regardless of the project's config.
function AuthConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const next = searchParams.get("next") ?? "/account";

    async function run() {
      const supabase = createClient();

      // @supabase/ssr's browser client is built around cookie/PKCE sessions
      // and doesn't auto-process an implicit-flow hash fragment the way
      // plain supabase-js does, so parse it ourselves.
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          router.replace(next);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next);
          return;
        }
      }

      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        if (!error) {
          router.replace(next);
          return;
        }
      }

      setFailed(true);
    }

    run();
  }, [router, searchParams]);

  useEffect(() => {
    if (failed) {
      router.replace("/login?error=invalid_link");
    }
  }, [failed, router]);

  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center">
      <p className="text-sm text-neutral-500">Confirming…</p>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm px-4 py-16 text-center">
          <p className="text-sm text-neutral-500">Confirming…</p>
        </div>
      }
    >
      <AuthConfirmInner />
    </Suspense>
  );
}
