export function getSnapshotAge(
  syncedAt: string | null
): number | null {
  if (!syncedAt) return null;

  const age = Date.now() - new Date(syncedAt).getTime();

  return Math.max(0, age);
}

export function formatSnapshotAge(
  syncedAt: string | null
): string {
  const age = getSnapshotAge(syncedAt);

  if (age === null) {
    return "Sync pending";
  }

  const minutes = Math.floor(age / 60000);

  if (minutes < 1) {
    return "Synced just now";
  }

  if (minutes < 60) {
    return `Synced ${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Synced ${hours}h ago`;
  }

  return `Synced ${Math.floor(hours / 24)}d ago`;
}
