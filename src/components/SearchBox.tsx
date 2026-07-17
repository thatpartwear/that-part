"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/icons";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex items-center hover:text-neutral-500"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <SearchIcon className="h-5 w-5 flex-shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query.trim()) setOpen(false);
        }}
        placeholder="Search products…"
        className="w-32 border-b border-neutral-300 bg-transparent py-1 text-sm outline-none focus:border-black sm:w-48"
      />
    </form>
  );
}
