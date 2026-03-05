import { BarChart3, Dumbbell, CalendarDays, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-[var(--color-accent-glow)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

export function FeatureCards() {
  return (
    <section id="features" className="mt-28 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FeatureCard
        icon={<BarChart3 size={20} />}
        title="Activity Insights"
        description="Analyze your past workouts to understand your progress and performance trends."
      />
      <FeatureCard
        icon={<Dumbbell size={20} />}
        title="Training Coaching"
        description="Receive personalized advice to optimize your training based on your data."
      />
      <FeatureCard
        icon={<CalendarDays size={20} />}
        title="Smart Training Plans"
        description="AI-generated training calendars tailored to your goals and current fitness level."
      />
      <FeatureCard
        icon={<MessageCircle size={20} />}
        title="Ask Anything"
        description="Get instant answers to your fitness questions from an AI that knows your data."
      />
    </section>
  );
}
