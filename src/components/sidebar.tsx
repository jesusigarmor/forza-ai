"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Settings } from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: <Home size={20} />, label: "Home" },
  { href: "/chat", icon: <MessageCircle size={20} />, label: "Chat" },
  { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
];

interface SidebarProps {
  user: { name: string };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-16 flex-col items-center border-r border-[var(--color-border-subtle)] bg-[var(--color-background)] py-6 md:flex">
        <Link
          href="/dashboard"
          className="mb-8 text-sm font-bold tracking-tighter text-[var(--color-text-primary)]"
        >
          F
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {item.icon}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text-secondary)]">
          {getInitials(user.name)}
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-[var(--color-border-subtle)] bg-[var(--color-background)]/95 py-2 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 ${
                isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
