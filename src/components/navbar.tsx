"use client";

import Link from "next/link";
import Image from "next/image";
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
          ? "border-b border-gray-100 bg-white/90 backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Kanji_for_chikara.jpg"
            alt="Chikara"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="text-xl font-bold tracking-tight text-gray-900">ForzaAI</span>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
