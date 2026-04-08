export interface User {
  name: string;
  firstName: string;
  avatarUrl: string;
  lastSyncedAt: string;
}

export interface DashboardStats {
  totalDistance: number;
  totalActivities: number;
  weeklyDistance: number;
  currentStreak: number;
}

export type SportType = "Run" | "Ride" | "Swim" | "TrailRun" | "Walk" | "Hike";

export interface Activity {
  id: string;
  sportType: SportType;
  name: string;
  date: string;
  distance: number;
  duration: string;
  pace: string;
}

export interface SportStat {
  sport: string;
  icon: string;
  metrics: { label: string; value: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface TrainingDay {
  date: string;
  dayOfMonth: number;
  sport: SportType | "Rest";
  label: string;
}

export interface TrainingWeek {
  weekNumber: number;
  days: TrainingDay[];
}

export interface GoalEvent {
  id: string;
  label: string;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile: string;
  profile_medium: string;
  city: string;
  country: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp (seconds)
  athlete: StravaAthlete;
}
