import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "T-Shirts", href: "/shop?category=t-shirts" },
      { label: "Quarter-Zips", href: "/shop?category=quarter-zips" },
      { label: "Shorts", href: "/shop?category=shorts" },
      { label: "Sweatpants", href: "/shop?category=sweatpants" },
      { label: "Tank Tops", href: "/shop?category=tank-tops" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My account", href: "/account" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              THAT PART
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Performance sportswear for every workout.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-white">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} THAT PART. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
