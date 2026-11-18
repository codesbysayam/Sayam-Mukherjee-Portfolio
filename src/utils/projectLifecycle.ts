import type { ProjectItem } from "../data/projects";
import type { GitHubRepo } from "../services/github";

export type ProjectLifecycleState = "Active" | "Archived" | "Maintenance";

export interface ProjectLifecycleBadge {
  state: ProjectLifecycleState;
  label: ProjectLifecycleState;
  pushedLabel: string;
  title: string;
  badgeClass: string;
}

const ACTIVE_WINDOW_DAYS = 44;

function parseTimestamp(value?: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function computeProjectLifecycle(
  project: ProjectItem,
  repo?: GitHubRepo | null,
  referenceTime?: number
): ProjectLifecycleBadge {
  if (repo?.archived) {
    return {
      state: "Archived",
      label: "Archived",
      pushedLabel: "Repository archived on GitHub",
      title: "Lifecycle: Archived — read-only repository snapshot",
      badgeClass:
        "bg-[#151713]/92 text-[#D4D6CA] border border-[#565A4E] backdrop-blur-sm",
    };
  }

  const pushTs = parseTimestamp(repo?.pushed_at || repo?.updated_at);
  const nowTs = referenceTime ?? Date.now();

  if (pushTs !== null) {
    const effectiveNow = Math.max(nowTs, pushTs);
    const daysSincePush = Math.floor((effectiveNow - pushTs) / (1000 * 60 * 60 * 24));
    const pushedDate = new Date(pushTs).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (daysSincePush <= ACTIVE_WINDOW_DAYS) {
      return {
        state: "Active",
        label: "Active",
        pushedLabel: `Updated ${pushedDate}`,
        title: `Lifecycle: Active — pushed within ${daysSincePush === 0 ? "the last day" : `${daysSincePush} days`}`,
        badgeClass:
          "bg-[#C7E34A] text-[#20231D] border border-[#A9C52F] shadow-sm",
      };
    }

    return {
      state: "Maintenance",
      label: "Maintenance",
      pushedLabel: `Last push ${pushedDate}`,
      title: `Lifecycle: Maintenance — last pushed ${daysSincePush} days ago`,
      badgeClass:
        "bg-[#20231D]/92 text-[#F4F4ED] border border-[#565A4E] backdrop-blur-sm",
    };
  }

  const fallbackActiveIds = new Set(["mausam", "sightforge", "memory-in-motion"]);
  if (fallbackActiveIds.has(project.id)) {
    return {
      state: "Active",
      label: "Active",
      pushedLabel: "Active codebase",
      title: "Lifecycle: Active development",
      badgeClass:
        "bg-[#C7E34A] text-[#20231D] border border-[#A9C52F] shadow-sm",
    };
  }

  return {
    state: "Maintenance",
    label: "Maintenance",
    pushedLabel: "Stable release",
    title: "Lifecycle: Maintenance — stable public release",
    badgeClass:
      "bg-[#20231D]/92 text-[#F4F4ED] border border-[#565A4E] backdrop-blur-sm",
  };
}
