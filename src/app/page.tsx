import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeatureCards } from "@/components/feature-cards";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-glow)_0%,_transparent_50%)]" />
      <Navbar />
      <main className="relative mx-auto max-w-5xl px-6 pt-32 pb-24">
        <Hero />
        <FeatureCards />
      </main>
    </div>
  );
}
