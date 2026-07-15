"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = "idle" | "confirm" | "code-sent";

export function DeleteAccountButton({ email }: { email: string }) {
  const [step, setStep] = useState<Step>("idle");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSendCode() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep("code-sent");
    setLoading(false);
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setError("That code is invalid or expired. Try again.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete account");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (step === "idle") {
    return (
      <div className="mt-12 border-t border-neutral-800 pt-6">
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="text-sm text-red-400 underline hover:text-red-300"
        >
          Delete account
        </button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="mt-12 border-t border-neutral-800 pt-6">
        <p className="mb-3 text-sm text-neutral-300">
          This permanently deletes your account and profile. Past orders are
          kept for our records but will no longer be linked to you. This
          can&apos;t be undone.
        </p>
        <p className="mb-3 text-sm text-neutral-400">
          We&apos;ll email a verification code to <strong>{email}</strong> to
          confirm it&apos;s really you.
        </p>
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSendCode}
            disabled={loading}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-700"
          >
            {loading ? "Sending code…" : "Send verification code"}
          </button>
          <button
            type="button"
            onClick={() => setStep("idle")}
            disabled={loading}
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-neutral-800 pt-6">
      <p className="mb-3 text-sm text-neutral-300">
        Enter the 6-digit code sent to <strong>{email}</strong> to permanently
        delete your account.
      </p>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="w-32 rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm tracking-widest text-white"
        />
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || code.length !== 6}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-700"
        >
          {loading ? "Deleting…" : "Confirm & delete"}
        </button>
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={loading}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
      <button
        type="button"
        onClick={handleSendCode}
        disabled={loading}
        className="mt-3 text-sm text-neutral-400 underline hover:text-white"
      >
        Resend code
      </button>
    </div>
  );
}
