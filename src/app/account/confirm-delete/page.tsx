"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmDeletePage() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);
      setChecking(false);
    }

    check();
  }, [router]);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete account");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <p className="text-sm text-neutral-400">Checking…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-4 text-2xl font-bold">Delete account</h1>
      <p className="mb-3 text-sm text-neutral-300">
        You&apos;ve confirmed it&apos;s you by clicking the link sent to{" "}
        <strong>{email}</strong>. This last step permanently deletes your
        account and profile. Past orders are kept for our records but will no
        longer be linked to you. This can&apos;t be undone.
      </p>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-700"
        >
          {loading ? "Deleting…" : "Yes, permanently delete my account"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/account")}
          disabled={loading}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
