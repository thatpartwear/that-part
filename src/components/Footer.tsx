import Link from "next/link";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/icons";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/thatpartwear/", Icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/thatpartwear", Icon: FacebookIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@thatpartwear", Icon: TiktokIcon },
];

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Men", href: "/shop?gender=men" },
      { label: "Women", href: "/shop?gender=women" },
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
      { label: "Wishlist", href: "/wishlist" },
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
    <footer className="mt-auto border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold tracking-tight">
              THAT PART
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Performance sportswear for every workout.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-neutral-500 hover:text-black"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 hover:text-black active:font-semibold active:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} THAT PART. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="hover:text-black active:font-semibold active:text-black"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-black active:font-semibold active:text-black"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
