"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ForzaAI
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Features
          </a>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
