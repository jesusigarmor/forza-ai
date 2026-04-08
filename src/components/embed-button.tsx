"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function EmbedButton() {
  const [state, setState] = useState<State>("idle");
  const [count, setCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/embed", { method: "POST" });
      const data = await res.json() as { embedded?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCount(data.embedded ?? 0);
      setState("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--color-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw size={14} className={state === "loading" ? "animate-spin" : ""} />
        {state === "loading" ? "Syncing…" : "Sync & Embed"}
      </button>

      {state === "success" && (
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <CheckCircle size={13} />
          {count} activities embedded
        </span>
      )}
      {state === "error" && (
        <span className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={13} />
          {errorMsg}
        </span>
      )}
    </div>
  );
}
