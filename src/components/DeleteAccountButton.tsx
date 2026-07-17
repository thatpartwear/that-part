"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Step = "idle" | "confirm" | "sent";

export function DeleteAccountButton({ email }: { email: string }) {
  const [step, setStep] = useState<Step>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendLink() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/account/confirm-delete`,
      },
    });

    if (error) {
      setError(
        error.message.toLowerCase().includes("rate limit")
          ? "Too many emails sent recently — please wait a while and try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    setStep("sent");
    setLoading(false);
  }

  if (step === "idle") {
    return (
      <div className="mt-12 border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="text-sm text-red-600 underline hover:text-red-500"
        >
          Delete account
        </button>
      </div>
    );
  }

  if (step === "sent") {
    return (
      <div className="mt-12 border-t border-neutral-200 pt-6">
        <p className="text-sm text-neutral-600">
          Check your inbox at <strong>{email}</strong> and click the link to
          finish deleting your account.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-neutral-200 pt-6">
      <p className="mb-3 text-sm text-neutral-600">
        This permanently deletes your account and profile. Past orders are
        kept for our records but will no longer be linked to you. This
        can&apos;t be undone.
      </p>
      <p className="mb-3 text-sm text-neutral-500">
        We&apos;ll email a confirmation link to <strong>{email}</strong>{" "}
        to verify it&apos;s really you before deleting anything.
      </p>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSendLink}
          disabled={loading}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-300"
        >
          {loading ? "Sending…" : "Send confirmation link"}
        </button>
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={loading}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
