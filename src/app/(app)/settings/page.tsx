import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStravaConnectionByUserId } from "@/lib/db";
import { EmbedButton } from "@/components/embed-button";

function StravaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You declined Strava access.",
  invalid_state: "Something went wrong during connection. Please try again.",
  auth_failed: "Could not connect to Strava. Please try again.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const stravaConn = await getStravaConnectionByUserId(user.id);
  const { error } = await searchParams;
  const errorMsg = error ? ERROR_MESSAGES[error] : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {errorMsg && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Connectors */}
      <section className="mt-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Connectors
        </h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <StravaIcon />
              </div>
              <div>
                <p className="text-sm font-medium">Strava</p>
                {stravaConn ? (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Connected as {stravaConn.firstname} {stravaConn.lastname}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)]">Not connected</p>
                )}
              </div>
            </div>

            {stravaConn ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
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
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                Connect
              </a>
            )}
          </div>

          {stravaConn && (
            <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
              <p className="mb-2 text-xs text-[var(--color-text-muted)]">
                Sync your activities so the AI can answer questions about your training.
              </p>
              <EmbedButton />
            </div>
          )}
        </div>
      </section>

      {/* Account */}
      <section className="mt-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Account
        </h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--color-surface-hover)]"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
