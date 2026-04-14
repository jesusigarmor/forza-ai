export { db } from './client';
export { createUser, getUserByEmail, getUserById } from './app-users';
export type { AppUser } from './app-users';
export {
  upsertStravaConnection,
  getStravaConnectionByUserId,
  updateStravaTokens,
} from './strava-connections';
export type { StravaConnection } from './strava-connections';
export {
  upsertActivities,
  getActivitiesByUserId,
  hasActivities,
  getActivityStats,
  getSportBreakdown,
  getActivitiesNeedingDetail,
  applyActivityDetail,
  upsertBestEfforts,
  getBestEffortsByUserId,
} from './activities';
export type { DbActivity, ActivityStats, SportBreakdown, DbBestEffort } from './activities';
export {
  upsertAthleteStats,
  getAthleteStats,
  upsertAthleteZones,
  getAthleteZones,
} from './athlete-data';
export type { DbAthleteStats, DbAthleteZones } from './athlete-data';
