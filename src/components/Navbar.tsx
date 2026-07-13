import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CartCount } from "@/components/CartCount";
import { SignOutButton } from "@/components/SignOutButton";

export async function Navbar() {
  const supabase = await createClient();
  const user = await supabase.auth
    .getUser()
    .then(({ data }) => data.user)
    .catch(() => null); // Supabase not configured yet — treat as logged out.

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          THAT PART
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/shop" className="hover:text-neutral-500">
            Shop
          </Link>
          <Link href="/cart" className="hover:text-neutral-500">
            <CartCount />
          </Link>
          {user ? (
            <>
              <Link href="/account" className="hover:text-neutral-500">
                Account
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="hover:text-neutral-500">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
