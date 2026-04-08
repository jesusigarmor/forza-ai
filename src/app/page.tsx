import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeatureCards } from "@/components/feature-cards";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You declined Strava access. Try again when ready.",
  invalid_state: "Something went wrong. Please try again.",
  auth_failed: "Could not connect to Strava. Please try again.",
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMsg = error ? ERROR_MESSAGES[error] : null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage:
          'url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
      }}
    >
      {/* Dark base overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/75" />
      {/* Gradient — near-black at bottom where feature cards sit */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/95" />
      {/* Subtle orange vignette at top */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(252,76,2,0.12)_0%,transparent_70%)]" />
      {/* Existing orange accent glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-glow)_0%,_transparent_50%)]" />
      {errorMsg && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {errorMsg}
        </div>
      )}
      <Navbar />
      <main className="relative mx-auto max-w-5xl px-6 pt-32 pb-24">
        <Hero />
        <FeatureCards />
      </main>
    </div>
  );
}
