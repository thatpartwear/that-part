"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MarketingOptInToggle({
  userId,
  initialValue,
}: {
  userId: string;
  initialValue: boolean;
}) {
  const [checked, setChecked] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(next: boolean) {
    setChecked(next);
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ marketing_opt_in: next })
      .eq("id", userId);
    setSaving(false);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        disabled={saving}
        onChange={(e) => handleChange(e.target.checked)}
      />
      <span>
        Email me about new arrivals and offers (5% off as a member)
      </span>
    </label>
  );
}
