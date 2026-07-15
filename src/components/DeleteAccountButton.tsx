"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  if (!confirming) {
    return (
      <div className="mt-12 border-t border-neutral-800 pt-6">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm text-red-400 underline hover:text-red-300"
        >
          Delete account
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-neutral-800 pt-6">
      <p className="mb-3 text-sm text-neutral-300">
        This permanently deletes your account and profile. Past orders are
        kept for our records but will no longer be linked to you. This
        can&apos;t be undone.
      </p>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-700"
        >
          {loading ? "Deleting…" : "Yes, delete my account"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
