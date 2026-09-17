export type SnapshotTimestamp = string | number | Date | null | undefined;

/**
 * Calculates the age in milliseconds of the GitHub data snapshot.
 * Returns null if the timestamp is missing, unparseable, or non-positive.
 */
export function getSnapshotAge(
  syncedAt: SnapshotTimestamp
): number | null {
  if (syncedAt === null || syncedAt === undefined || syncedAt === "") {
    return null;
  }

  const timestamp =
    typeof syncedAt === "number"
      ? syncedAt
      : syncedAt instanceof Date
        ? syncedAt.getTime()
        : new Date(syncedAt).getTime();

  if (isNaN(timestamp) || timestamp <= 0) {
    return null;
  }

  const age = Date.now() - timestamp;
  return Math.max(0, age);
}

/**
 * Formats the age of the GitHub data snapshot for display in the UI as 'Synced X ago'.
 * 
 * Formatting rules:
 * - < 1 minute: "Synced just now"
 * - 1 minute: "Synced 1m ago"
 * - 2-59 minutes: "Synced {m}m ago"
 * - 1 hour: "Synced 1h ago"
 * - 2-23 hours: "Synced {h}h ago"
 * - 1 day: "Synced 1d ago"
 * - 2+ days: "Synced {d}d ago"
 * - Missing / null / invalid timestamp: falls back to "Synced just now" (or custom fallback)
 */
export function formatSnapshotAge(
  syncedAt: SnapshotTimestamp,
  fallback: string = "Synced just now"
): string {
  const age = getSnapshotAge(syncedAt);

  if (age === null) {
    return fallback;
  }

  const minutes = Math.floor(age / 60000);

  if (minutes < 1) {
    return "Synced just now";
  }

  if (minutes === 1) {
    return "Synced 1m ago";
  }

  if (minutes < 60) {
    return `Synced ${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours === 1) {
    return "Synced 1h ago";
  }

  if (hours < 24) {
    return `Synced ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Synced 1d ago";
  }

  return `Synced ${days}d ago`;
}

/**
 * Alias of formatSnapshotAge for backwards compatibility across existing components.
 */
export const formatSyncAge = formatSnapshotAge;

