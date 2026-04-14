import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getStravaConnectionByUserId } from "@/lib/db";
import { SyncButton } from "@/components/sync-button";

function StravaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

const COMING_SOON = ["Training Peaks", "Garmin Connect", "Apple Health", "Oura Ring", "Wahoo", "Gmail"];

export default async function ConnectionsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const strava = await getStravaConnectionByUserId(user.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 pb-28 animate-page-enter">
      <h1 className="text-2xl font-semibold">discover.</h1>

      {/* Active providers */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Available
        </h2>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                <StravaIcon />
              </div>
              <div>
                <p className="text-sm font-medium">Strava</p>
                {strava ? (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {strava.firstname} {strava.lastname}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)]">Not connected</p>
                )}
              </div>
            </div>

            {strava ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Connected
                </span>
                <a
                  href="/api/auth/strava"
                  className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--color-surface-hover)]"
                >
                  Reconnect
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/strava"
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[#0A0D0F] transition hover:bg-[var(--color-accent-hover)]"
              >
                Connect
              </a>
            )}
          </div>

          {strava && (
            <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
              <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                Sync your activities so the AI can answer questions about your training.
              </p>
              <SyncButton />
            </div>
          )}
        </div>
      </section>

      {/* Coming soon */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMING_SOON.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 opacity-40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                <Zap size={15} />
              </div>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
