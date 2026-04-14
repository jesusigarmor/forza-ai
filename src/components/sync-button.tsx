"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

interface SyncButtonProps {
  variant?: "default" | "prominent";
}

export function SyncButton({ variant = "default" }: SyncButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const res = await fetch("/api/embed", { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (variant === "prominent") {
    return (
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[#0A0D0F] transition hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
      >
        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        {loading ? "Syncing…" : "Sync Strava data"}
      </button>
    );
  }

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--color-surface-hover)] disabled:opacity-50"
    >
      <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
      {loading ? "Syncing…" : "Sync"}
    </button>
  );
}
