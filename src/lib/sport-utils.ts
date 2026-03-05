import type { SportType } from "@/lib/types";

export function sportColor(sport: SportType | "Rest"): string {
  const colors: Record<string, string> = {
    Run: "text-[var(--color-run)]",
    TrailRun: "text-[var(--color-run)]",
    Walk: "text-[var(--color-run)]",
    Hike: "text-[var(--color-run)]",
    Ride: "text-[var(--color-bike)]",
    Swim: "text-[var(--color-swim)]",
    Rest: "text-[var(--color-rest)]",
  };
  return colors[sport] ?? "text-[var(--color-text-muted)]";
}

export function sportBgColor(sport: SportType | "Rest"): string {
  const colors: Record<string, string> = {
    Run: "bg-[var(--color-run)]/15 text-[var(--color-run)]",
    TrailRun: "bg-[var(--color-run)]/15 text-[var(--color-run)]",
    Walk: "bg-[var(--color-run)]/15 text-[var(--color-run)]",
    Hike: "bg-[var(--color-run)]/15 text-[var(--color-run)]",
    Ride: "bg-[var(--color-bike)]/15 text-[var(--color-bike)]",
    Swim: "bg-[var(--color-swim)]/15 text-[var(--color-swim)]",
    Rest: "bg-[var(--color-rest)]/15 text-[var(--color-rest)]",
  };
  return colors[sport] ?? "bg-[var(--color-surface)] text-[var(--color-text-muted)]";
}

export function sportIcon(sport: SportType | "Rest"): string {
  const icons: Record<string, string> = {
    Run: "🏃",
    TrailRun: "🥾",
    Walk: "🚶",
    Hike: "⛰️",
    Ride: "🚴",
    Swim: "🏊",
    Rest: "😴",
  };
  return icons[sport] ?? "🏅";
}
