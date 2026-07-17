import { createClient } from "@/lib/supabase/server";

export async function PerksBar() {
  let signedIn = false;
  let memberOptedIn = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      signedIn = true;
      const { data: profile } = await supabase
        .from("profiles")
        .select("marketing_opt_in")
        .eq("id", user.id)
        .maybeSingle<{ marketing_opt_in: boolean }>();
      memberOptedIn = profile?.marketing_opt_in ?? false;
    }
  } catch {
    // Supabase not configured yet.
  }

  const memberMessage = memberOptedIn
    ? "You're a member — 5% off is applied at checkout"
    : signedIn
      ? "Opt into emails in your account for 5% off"
      : "Sign up and opt into emails for 5% off";

  const items = (
    <>
      <span className="mx-4">Free shipping on orders over EGP 1,000.00</span>
      <span className="mx-4">·</span>
      <span className="mx-4">5% off orders over EGP 2,000.00</span>
      <span className="mx-4">·</span>
      <span className="mx-4">{memberMessage}</span>
      <span className="mx-4">·</span>
    </>
  );

  return (
    <div className="overflow-hidden border-b border-neutral-200 bg-white py-1.5">
      <div className="flex w-max animate-marquee-right whitespace-nowrap text-xs text-neutral-500">
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
