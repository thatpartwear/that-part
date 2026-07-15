import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CartCount } from "@/components/CartCount";
import { SignOutButton } from "@/components/SignOutButton";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon, UserIcon } from "@/components/icons";

export async function Navbar() {
  const supabase = await createClient();
  const user = await supabase.auth
    .getUser()
    .then(({ data }) => data.user)
    .catch(() => null); // Supabase not configured yet — treat as logged out.

  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          THAT PART
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Suspense fallback={<SearchIcon className="h-5 w-5" />}>
            <SearchBox />
          </Suspense>
          <Link
            href="/cart"
            aria-label="Cart"
            className="flex items-center hover:text-neutral-300"
          >
            <CartCount />
          </Link>
          {user ? (
            <>
              <Link
                href="/account"
                aria-label="Account"
                className="flex items-center hover:text-neutral-300"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Sign in"
              className="flex items-center hover:text-neutral-300"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
