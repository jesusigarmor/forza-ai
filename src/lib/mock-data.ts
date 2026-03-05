import type {
  Activity,
  ChatMessage,
  DashboardStats,
  GoalEvent,
  SportStat,
  TrainingWeek,
  User,
} from "@/lib/types";

export const mockUser: User = {
  name: "Jesus Garcia",
  firstName: "Jesus",
  avatarUrl: "",
  lastSyncedAt: "2 hours ago",
};

export const mockStats: DashboardStats = {
  totalDistance: 1247,
  totalActivities: 186,
  weeklyDistance: 42.3,
  currentStreak: 5,
};

export const mockActivities: Activity[] = [
  {
    id: "1",
    sportType: "Run",
    name: "Morning Run",
    date: "Mar 3",
    distance: 8.2,
    duration: "42:15",
    pace: "5:09/km",
  },
  {
    id: "2",
    sportType: "Ride",
    name: "Evening Ride",
    date: "Mar 2",
    distance: 32.1,
    duration: "1:05:30",
    pace: "29.4 km/h",
  },
  {
    id: "3",
    sportType: "Swim",
    name: "Pool Swim",
    date: "Mar 1",
    distance: 1.5,
    duration: "35:00",
    pace: "1:52/100m",
  },
  {
    id: "4",
    sportType: "TrailRun",
    name: "Trail Run",
    date: "Feb 28",
    distance: 12.5,
    duration: "1:10:45",
    pace: "5:40/km",
  },
  {
    id: "5",
    sportType: "Ride",
    name: "Lunch Ride",
    date: "Feb 27",
    distance: 25.0,
    duration: "55:10",
    pace: "27.2 km/h",
  },
  {
    id: "6",
    sportType: "Run",
    name: "Tempo Run",
    date: "Feb 26",
    distance: 6.0,
    duration: "27:30",
    pace: "4:35/km",
  },
];

export const mockSportStats: SportStat[] = [
  {
    sport: "Run",
    icon: "running",
    metrics: [
      { label: "avg pace", value: "5:09/km" },
      { label: "cadence", value: "178 spm" },
    ],
  },
  {
    sport: "Bike",
    icon: "bike",
    metrics: [
      { label: "avg speed", value: "28.5 km/h" },
      { label: "avg power", value: "195W" },
    ],
  },
  {
    sport: "Swim",
    icon: "swim",
    metrics: [{ label: "avg pace", value: "1:52/100m" }],
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "How was my training this week compared to last week?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "assistant",
    content: `This week you ran **42.3 km** across 4 runs, which is a **15% increase** from last week's 36.8 km. Your average pace improved from 5:22/km to **5:09/km**.

Key highlights:
- Tuesday's tempo run was your **fastest 10K this month**
- You maintained a consistent cadence of **178 spm**
- Consider adding a rest day before your weekend long run`,
    timestamp: "10:30 AM",
  },
  {
    id: "3",
    role: "user",
    content: "What should I focus on for my half marathon next month?",
    timestamp: "10:32 AM",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Based on your recent training data, here are my recommendations for your half marathon prep...",
    timestamp: "10:32 AM",
  },
];

export const mockGoalEvents: GoalEvent[] = [
  { id: "triathlon-olympic", label: "Triathlon (Olympic)" },
  { id: "triathlon-sprint", label: "Triathlon (Sprint)" },
  { id: "triathlon-ironman", label: "Triathlon (Ironman)" },
  { id: "marathon", label: "Marathon" },
  { id: "half-marathon", label: "Half Marathon" },
  { id: "10k", label: "10K Race" },
  { id: "century-ride", label: "Century Ride" },
];

function buildMockWeek(
  weekNumber: number,
  startDay: number,
  month: string,
): TrainingWeek {
  const plans: [string, string][] = [
    ["Swim", "Swim 1.5km technique"],
    ["Run", "Easy Run 8km"],
    ["Ride", "Endurance Ride 45km"],
    ["Rest", "Rest"],
    ["Run", "Tempo Run 6km"],
    ["Ride", "Interval Ride 30km"],
    ["Swim", "Swim 1.5km technique"],
  ];

  return {
    weekNumber,
    days: plans.map(([sport, label], idx) => ({
      date: `${month} ${String(startDay + idx)}`,
      dayOfMonth: startDay + idx,
      sport: sport === "Rest" ? "Rest" : (sport as "Run" | "Ride" | "Swim"),
      label,
    })),
  };
}

export const mockTrainingPlan: TrainingWeek[] = [
  buildMockWeek(1, 1, "Jun"),
  buildMockWeek(2, 8, "Jun"),
  buildMockWeek(3, 15, "Jun"),
  buildMockWeek(4, 22, "Jun"),
];
