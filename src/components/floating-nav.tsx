"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Settings, Plus } from "lucide-react";

interface FloatingNavProps {
  stravaConnected: boolean;
}

export function FloatingNav({ stravaConnected }: FloatingNavProps) {
  const pathname = usePathname();
  const [showConnections, setShowConnections] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowConnections(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isChat = pathname === "/chat";

  return (
    <div
      ref={containerRef}
      style={
        isChat
          ? { left: "max(1rem, calc(50% - 37rem))", transform: "translateX(0)" }
          : { left: "50%", transform: "translateX(-50%)" }
      }
      className="fixed bottom-6 z-50 transition-all duration-300 ease-out"
    >
      {/* Connections popover */}
      {showConnections && (
        <div className="absolute bottom-full left-1/2 mb-3 w-52 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-[#0F1214]/95 p-2 shadow-2xl backdrop-blur-xl">
          <p className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
            Connections
          </p>

          {/* Strava row */}
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-[#F5F7FA]">
              <StravaIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[#F5F7FA]">Strava</p>
              {stravaConnected ? (
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  <p className="text-[10px] text-[#6B7280]">Connected</p>
                </div>
              ) : (
                <p className="text-[10px] text-[#6B7280]">Not connected</p>
              )}
            </div>
          </div>

          {/* Add connection */}
          <div className="mt-1 border-t border-white/[0.05] pt-1">
            <Link
              href="/connections"
              onClick={() => setShowConnections(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#9BA3AF] transition-colors hover:bg-white/[0.05] hover:text-[#F5F7FA]"
            >
              <Plus size={12} />
              Add connection
            </Link>
          </div>
        </div>
      )}

      {/* Main dock */}
      <nav className="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#0F1214]/90 px-3 py-2.5 shadow-2xl backdrop-blur-xl">
        <NavItem href="/dashboard" active={pathname === "/dashboard"} label="Home">
          <Home size={18} />
        </NavItem>
        <NavItem href="/chat" active={pathname === "/chat"} label="Chat">
          <MessageCircle size={18} />
        </NavItem>
        <NavItem href="/settings" active={pathname === "/settings"} label="Settings">
          <Settings size={18} />
        </NavItem>

        <div className="mx-1.5 h-4 w-px bg-white/[0.08]" />

        {/* Connections chip */}
        <button
          onClick={() => setShowConnections((v) => !v)}
          title="Connections"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors ${
            showConnections
              ? "bg-white/10 text-[#F5F7FA]"
              : "text-[#6B7280] hover:bg-white/[0.05] hover:text-[#9BA3AF]"
          }`}
        >
          <div className="relative">
            <StravaIcon className="h-4 w-4" />
            {stravaConnected && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#0F1214] bg-green-400" />
            )}
          </div>
        </button>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
        active
          ? "bg-white/[0.12] text-[#F5F7FA]"
          : "text-[#6B7280] hover:bg-white/[0.05] hover:text-[#9BA3AF]"
      }`}
    >
      {children}
    </Link>
  );
}

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}
