import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col items-center text-center">
      <h1 className="max-w-3xl text-5xl leading-tight font-bold tracking-tight sm:text-6xl md:text-7xl">
        Your Training,{" "}
        <span className="bg-gradient-to-r from-[var(--color-accent)] to-orange-400 bg-clip-text text-transparent">
          Understood
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-[var(--color-text-secondary)]">
        Connect your Strava account and get AI-powered insights about your
        athletic performance.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/api/auth/strava"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-glow)] transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-xl hover:shadow-[var(--color-accent-glow)]"
        >
          <StravaIcon />
          Connect with Strava
        </Link>
        <a
          href="#features"
          className="inline-flex items-center rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}

function StravaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}
