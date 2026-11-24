import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Expand,
  FolderGit2,
  Layers,
  Minimize2,
  Network,
  RotateCcw,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ENGINEERING_STACK_CATEGORIES,
  SKILLS_DATA,
  TOTAL_VERIFIED_TECHNOLOGIES,
  type EngineeringStackGroup,
  type SkillItem,
  type TechnologyItem,
} from "../../data/skills";
import { PROJECTS, type ProjectItem } from "../../data/projects";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

interface SkillConstellationProps {
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
  onNavigateToProject?: (projectId: string) => void;
}

interface PositionedDiscipline {
  group: EngineeringStackGroup;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  hubCurveControl: { x: number; y: number };
  accentColor: string;
}

interface PositionedTechNode {
  item: TechnologyItem;
  group: EngineeringStackGroup;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
}

const CANVAS_W = 1200;
const CANVAS_H = 760;
const HUB_CENTER = { x: 600, y: 380 };
const HUB_RADIUS = 54;
const CLUSTER_RADIUS = 27;

// Subtle category-specific secondary accents harmonizing with charcoal & acid lime
const CATEGORY_ACCENTS: Record<string, string> = {
  languages: "#c7e34a",
  frontend: "#72d6c9",
  "backend-data": "#e2b86b",
  "ml-cv": "#a4cb65",
  tools: "#8cb4e6",
  "core-cs": "#cda2cb",
};

const CORE_TECH_NAMES_PER_GROUP: Record<string, string[]> = {
  languages: ["TypeScript", "Python", "C++"],
  frontend: ["React", "Next.js 15", "KaTeX"],
  "backend-data": ["Node.js", "FastAPI", "PostgreSQL"],
  "ml-cv": ["YOLOv8", "ByteTrack", "PyTorch"],
  tools: ["GitHub", "Vitest", "Docker"],
  "core-cs": [
    "System Architecture",
    "Control Planes & Audit",
    "Data Structures & Algorithms",
  ],
};

// Symmetrical hexagonal sector coordinates tuned to avoid bottom/left crowding
const SECTOR_CONFIG: Record<
  string,
  {
    clusterX: number;
    clusterY: number;
    labelX: number;
    labelY: number;
    hubCtrl: { x: number; y: number };
    leafPositions: Array<[number, number]>;
  }
> = {
  languages: {
    clusterX: 465,
    clusterY: 222,
    labelX: 465,
    labelY: 266,
    hubCtrl: { x: 562, y: 264 },
    leafPositions: [
      [338, 178],
      [398, 106],
      [518, 98],
    ],
  },
  frontend: {
    clusterX: 735,
    clusterY: 222,
    labelX: 735,
    labelY: 266,
    hubCtrl: { x: 638, y: 264 },
    leafPositions: [
      [682, 98],
      [802, 106],
      [862, 178],
    ],
  },
  "backend-data": {
    clusterX: 848,
    clusterY: 380,
    labelX: 848,
    labelY: 425,
    hubCtrl: { x: 724, y: 380 },
    leafPositions: [
      [1018, 286],
      [1054, 380],
      [1018, 474],
    ],
  },
  "ml-cv": {
    clusterX: 735,
    clusterY: 538,
    labelX: 735,
    labelY: 495,
    hubCtrl: { x: 638, y: 496 },
    leafPositions: [
      [862, 582],
      [802, 654],
      [682, 662],
    ],
  },
  tools: {
    clusterX: 465,
    clusterY: 538,
    labelX: 465,
    labelY: 495,
    hubCtrl: { x: 562, y: 496 },
    leafPositions: [
      [518, 662],
      [398, 654],
      [338, 582],
    ],
  },
  "core-cs": {
    clusterX: 352,
    clusterY: 380,
    labelX: 352,
    labelY: 425,
    hubCtrl: { x: 476, y: 380 },
    leafPositions: [
      [164, 286],
      [148, 380],
      [162, 474],
    ],
  },
};

const SCOPE_LABELS: Record<TechnologyItem["evidenceScope"], string> = {
  project: "Verified in Shipped Projects",
  repository: "Verified in Public Repositories",
  coursework: "Academic Coursework (KIIT CSE)",
  toolchain: "Active Engineering Toolchain",
};

const SKILL_MATCH_ALIASES: Record<string, string> = {
  "Next.js 15": "Next.js",
  KaTeX: "KaTeX & D3.js",
  "D3.js": "KaTeX & D3.js",
  "SQL / PLpgSQL": "SQL / PostgreSQL",
  "Data Structures & Algorithms": "DSA",
  "Zod Validation": "Zod Schema Validation",
};

function measureCapsuleWidth(name: string): number {
  return Math.min(228, Math.max(88, Math.round(name.length * 7.5 + 34)));
}

function resolveSkillDetails(
  item: TechnologyItem,
  group: EngineeringStackGroup
): {
  skillItem: SkillItem | undefined;
  description: string;
  practicalApplication: string;
  projects: ProjectItem[];
  relatedTechNames: string[];
} {
  const alias = SKILL_MATCH_ALIASES[item.name] || item.name;
  const skillMatch = SKILLS_DATA.find(
    (s) =>
      s.id.toLowerCase() === item.id.toLowerCase() ||
      s.name.toLowerCase() === alias.toLowerCase() ||
      s.name.toLowerCase() === item.name.toLowerCase()
  );

  const projects: ProjectItem[] = item.evidenceProjects
    .map((pid) => PROJECTS.find((p) => p.id === pid))
    .filter((p): p is ProjectItem => Boolean(p));

  const allItemsByLower = new Map<string, string>();
  for (const grp of ENGINEERING_STACK_CATEGORIES) {
    for (const tech of grp.items) {
      allItemsByLower.set(tech.name.toLowerCase(), tech.name);
      const mapped = SKILL_MATCH_ALIASES[tech.name];
      if (mapped) {
        allItemsByLower.set(mapped.toLowerCase(), tech.name);
      }
    }
  }

  const relatedSet = new Set<string>();
  if (skillMatch) {
    for (const rel of skillMatch.relatedSkills) {
      const target =
        allItemsByLower.get(rel.toLowerCase()) ||
        (rel === "YOLO" ? "YOLOv8" : undefined) ||
        (rel === "DSA" ? "Data Structures & Algorithms" : undefined);
      if (target && target.toLowerCase() !== item.name.toLowerCase()) {
        relatedSet.add(target);
      }
    }
  }

  for (const sib of group.items) {
    if (relatedSet.size >= 5) break;
    if (sib.id !== item.id) relatedSet.add(sib.name);
  }

  return {
    skillItem: skillMatch,
    description: skillMatch?.description || group.description,
    practicalApplication: skillMatch?.repoEvidence
      ? `${item.evidenceSummary} ${skillMatch.repoEvidence}`
      : item.evidenceSummary,
    projects,
    relatedTechNames: Array.from(relatedSet).slice(0, 5),
  };
}

function getEdgeCapsuleAnchor(
  px: number,
  py: number,
  node: PositionedTechNode
): { x: number; y: number } {
  const dx = node.x - px;
  const dy = node.y - py;
  const halfW = node.width / 2;
  const halfH = node.height / 2;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    return { x: node.x, y: node.y };
  }

  const scaleX = Math.abs(dx) > 0.001 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.001 ? halfH / Math.abs(dy) : Infinity;
  const t = Math.min(scaleX, scaleY);

  return {
    x: node.x - dx * Math.min(1, t),
    y: node.y - dy * Math.min(1, t),
  };
}

function getCircleRimPoint(
  cx: number,
  cy: number,
  r: number,
  tx: number,
  ty: number
): { x: number; y: number } {
  const angle = Math.atan2(ty - cy, tx - cx);
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  };
}

function resolveOverviewCollisions(
  nodes: PositionedTechNode[],
  disciplines: PositionedDiscipline[],
  hubCenter: { x: number; y: number }
): PositionedTechNode[] {
  const clone = nodes.map((n) => ({ ...n }));
  const marginX = 24;
  const marginY = 24;
  const padX = 14;
  const padY = 12;

  for (let iter = 0; iter < 24; iter++) {
    for (let i = 0; i < clone.length; i++) {
      const a = clone[i];

      // Capsule-vs-capsule AABB separation
      for (let j = i + 1; j < clone.length; j++) {
        const b = clone[j];
        const reqX = a.width / 2 + b.width / 2 + padX;
        const reqY = a.height / 2 + b.height / 2 + padY;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX = reqX - Math.abs(dx);
        const overlapY = reqY - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
            const sign = dx >= 0 ? 1 : -1;
            const shift = overlapX / 2 + 0.5;
            a.x -= sign * shift;
            b.x += sign * shift;
          } else {
            const sign = dy >= 0 ? 1 : -1;
            const shift = overlapY / 2 + 0.5;
            a.y -= sign * shift;
            b.y += sign * shift;
          }
        }
      }

      // Avoid cluster circles
      for (const d of disciplines) {
        const dx = a.x - d.x;
        const dy = a.y - d.y;
        const dist = Math.hypot(dx, dy) || 1;
        const minR = CLUSTER_RADIUS + Math.max(a.width / 2, 42) * 0.55 + 22;
        if (dist < minR) {
          const push = minR - dist;
          a.x += (dx / dist) * push;
          a.y += (dy / dist) * push;
        }
      }

      // Avoid central hub
      const hx = a.x - hubCenter.x;
      const hy = a.y - hubCenter.y;
      const hDist = Math.hypot(hx, hy) || 1;
      const minHubR = HUB_RADIUS + 60;
      if (hDist < minHubR) {
        const push = minHubR - hDist;
        a.x += (hx / hDist) * push;
        a.y += (hy / hDist) * push;
      }

      // Canvas safe bounds
      a.x = Math.max(marginX + a.width / 2, Math.min(CANVAS_W - marginX - a.width / 2, a.x));
      a.y = Math.max(marginY + a.height / 2, Math.min(CANVAS_H - marginY - a.height / 2, a.y));
    }
  }

  return clone;
}

export function SkillConstellation({
  selectedTech,
  onSelectTech,
  onNavigateToProject,
}: SkillConstellationProps) {
  const reduced = usePrefersReducedMotion();
  const graphContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeDisciplineFilter, setActiveDisciplineFilter] = useState<string>("all");
  const [focusCategoryOnly, setFocusCategoryOnly] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mobileClusterId, setMobileClusterId] = useState<string>(
    ENGINEERING_STACK_CATEGORIES[0].id
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);

  // Track container width via ResizeObserver cleanly (used for responsive HUD cues)
  useEffect(() => {
    const el = graphContainerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      // Triggers layout-safe sizing awareness when container resizes
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close mobile bottom sheet on Escape
  useEffect(() => {
    if (!mobileSheetOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSheetOpen]);

  // Build Overview layout (6 clusters, 18 core nodes)
  const overviewGraph = useMemo(() => {
    const dNodes: PositionedDiscipline[] = [];
    const tNodes: PositionedTechNode[] = [];
    const coreLookup = new Map<string, PositionedTechNode>();

    for (const grp of ENGINEERING_STACK_CATEGORIES) {
      const cfg = SECTOR_CONFIG[grp.id];
      if (!cfg) continue;
      const accent = CATEGORY_ACCENTS[grp.id] || "#c7e34a";

      dNodes.push({
        group: grp,
        x: cfg.clusterX,
        y: cfg.clusterY,
        labelX: cfg.labelX,
        labelY: cfg.labelY,
        hubCurveControl: cfg.hubCtrl,
        accentColor: accent,
      });

      const curated = CORE_TECH_NAMES_PER_GROUP[grp.id] || [];
      const items = curated
        .map((n) => grp.items.find((item) => item.name === n))
        .filter((item): item is TechnologyItem => Boolean(item));

      items.forEach((item, idx) => {
        const pos = cfg.leafPositions[idx];
        if (!pos) return;
        const node: PositionedTechNode = {
          item,
          group: grp,
          x: pos[0],
          y: pos[1],
          width: measureCapsuleWidth(item.name),
          height: 32,
          accentColor: accent,
        };
        tNodes.push(node);
        coreLookup.set(item.name.toLowerCase(), node);
      });
    }

    const resolvedTechNodes = resolveOverviewCollisions(tNodes, dNodes, HUB_CENTER);
    return {
      disciplines: dNodes,
      techNodes: resolvedTechNodes,
      coreLookup,
    };
  }, []);

  // Check if Focus Cluster mode is showing a single discipline's FULL set of technologies
  const isFocusedClusterGraph =
    focusCategoryOnly && activeDisciplineFilter !== "all";

  const focusedClusterLayout = useMemo(() => {
    if (!isFocusedClusterGraph) return null;
    const targetGrp = ENGINEERING_STACK_CATEGORIES.find(
      (g) => g.id === activeDisciplineFilter
    );
    if (!targetGrp) return null;

    const accent = CATEGORY_ACCENTS[targetGrp.id] || "#c7e34a";
    const hub = { x: 220, y: 380 };
    const clusterNode: PositionedDiscipline = {
      group: targetGrp,
      x: 495,
      y: 380,
      labelX: 495,
      labelY: 432,
      hubCurveControl: { x: 358, y: 380 },
      accentColor: accent,
    };

    const count = targetGrp.items.length;
    const minY = 92;
    const maxY = 668;
    const stepY = count > 1 ? (maxY - minY) / (count - 1) : 0;

    const expandedNodes: PositionedTechNode[] = targetGrp.items.map((item, idx) => {
      const y = count === 1 ? 380 : minY + idx * stepY;
      const norm = count > 1 ? (idx / (count - 1)) * 2 - 1 : 0; // -1 .. +1
      const arcOffset = Math.cos((norm * Math.PI) / 2.2) * 145;
      const w = measureCapsuleWidth(item.name);
      return {
        item,
        group: targetGrp,
        x: Math.min(CANVAS_W - 40 - w / 2, 760 + arcOffset),
        y,
        width: w,
        height: 34,
        accentColor: accent,
      };
    });

    return {
      hubCenter: hub,
      discipline: clusterNode,
      techNodes: expandedNodes,
    };
  }, [isFocusedClusterGraph, activeDisciplineFilter]);

  // Resolve full inspector metadata across all 38 verified technologies
  const inspectorDetail = useMemo(() => {
    const queryTarget = selectedTech?.trim().toLowerCase();
    if (queryTarget) {
      for (const grp of ENGINEERING_STACK_CATEGORIES) {
        const match = grp.items.find((i) => i.name.toLowerCase() === queryTarget);
        if (match) {
          return {
            item: match,
            group: grp,
            accentColor: CATEGORY_ACCENTS[grp.id] || "#c7e34a",
            ...resolveSkillDetails(match, grp),
          };
        }
      }
    }

    const fallbackItem =
      ENGINEERING_STACK_CATEGORIES[0].items[0];
    const fallbackGroup = ENGINEERING_STACK_CATEGORIES[0];
    return {
      item: fallbackItem,
      group: fallbackGroup,
      accentColor: CATEGORY_ACCENTS[fallbackGroup.id] || "#c7e34a",
      ...resolveSkillDetails(fallbackItem, fallbackGroup),
    };
  }, [selectedTech]);

  const activeTechNodeId = selectedTech ? inspectorDetail.item.id : null;
  const relatedTechSet = useMemo(
    () => new Set(inspectorDetail.relatedTechNames.map((n) => n.toLowerCase())),
    [inspectorDetail]
  );

  // Sync mobile cluster selector when selectedTech changes externally (e.g. from matrix below)
  useEffect(() => {
    if (!selectedTech) return;
    const foundGrp = ENGINEERING_STACK_CATEGORIES.find((grp) =>
      grp.items.some((i) => i.name.toLowerCase() === selectedTech.toLowerCase())
    );
    if (foundGrp) {
      setMobileClusterId(foundGrp.id);
    }
  }, [selectedTech]);

  // Search filtering across all 38 technologies
  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const matchingIds = new Set<string>();
    const matchingGroups = new Set<string>();
    let firstMatch: { item: TechnologyItem; group: EngineeringStackGroup } | null = null;

    for (const grp of ENGINEERING_STACK_CATEGORIES) {
      for (const item of grp.items) {
        if (
          item.name.toLowerCase().includes(q) ||
          item.evidenceSummary.toLowerCase().includes(q) ||
          grp.label.toLowerCase().includes(q)
        ) {
          matchingIds.add(item.id);
          matchingGroups.add(grp.id);
          if (!firstMatch) firstMatch = { item, group: grp };
        }
      }
    }
    return { matchingIds, matchingGroups, firstMatch };
  }, [searchQuery]);

  // Compute active SVG viewBox from zoomLevel
  const svgViewBox = useMemo(() => {
    const vbW = CANVAS_W / zoomLevel;
    const vbH = CANVAS_H / zoomLevel;
    const center = isFocusedClusterGraph
      ? { x: 600, y: 380 }
      : activeDisciplineFilter !== "all" && zoomLevel > 1
      ? (() => {
          const d = overviewGraph.disciplines.find(
            (disc) => disc.group.id === activeDisciplineFilter
          );
          return d ? { x: (HUB_CENTER.x + d.x) / 2, y: (HUB_CENTER.y + d.y) / 2 } : HUB_CENTER;
        })()
      : HUB_CENTER;

    const minX = Math.max(0, Math.min(CANVAS_W - vbW, center.x - vbW / 2));
    const minY = Math.max(0, Math.min(CANVAS_H - vbH, center.y - vbH / 2));
    return `${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;
  }, [zoomLevel, isFocusedClusterGraph, activeDisciplineFilter, overviewGraph.disciplines]);

  const renderedGraph = useMemo(() => {
    if (focusedClusterLayout) {
      return {
        hub: focusedClusterLayout.hubCenter,
        disciplines: [focusedClusterLayout.discipline],
        techNodes: focusedClusterLayout.techNodes,
        modeLabel: `Focused · ${focusedClusterLayout.discipline.group.label}`,
        nodeSummary: `${focusedClusterLayout.techNodes.length} Nodes in Cluster`,
      };
    }

    const activeDisc =
      activeDisciplineFilter !== "all"
        ? overviewGraph.disciplines.find(
            (d) => d.group.id === activeDisciplineFilter
          )
        : null;

    const highlightedCount = activeDisc
      ? overviewGraph.techNodes.filter((n) => n.group.id === activeDisc.group.id).length
      : overviewGraph.techNodes.length;

    return {
      hub: HUB_CENTER,
      disciplines: overviewGraph.disciplines,
      techNodes: overviewGraph.techNodes,
      modeLabel: activeDisc
        ? `Cluster · ${activeDisc.group.label}`
        : "Overview · All 6 Disciplines",
      nodeSummary: activeDisc
        ? `${highlightedCount} Core Nodes Highlighted · ${overviewGraph.techNodes.length} Visible (${TOTAL_VERIFIED_TECHNOLOGIES} Indexed)`
        : `${overviewGraph.techNodes.length} Core Nodes (${TOTAL_VERIFIED_TECHNOLOGIES} Indexed)`,
    };
  }, [focusedClusterLayout, activeDisciplineFilter, overviewGraph]);

  const handleSelectTechNode = (
    itemName: string,
    groupId: string,
    openMobileSheet = false
  ) => {
    const isSame = selectedTech?.toLowerCase() === itemName.toLowerCase();
    if (isSame && !openMobileSheet) {
      onSelectTech(null);
      return;
    }
    onSelectTech(itemName);
    setMobileClusterId(groupId);
    if (openMobileSheet) {
      setMobileSheetOpen(true);
    }
  };

  const handleSelectDiscipline = (groupId: string) => {
    if (activeDisciplineFilter === groupId && !focusCategoryOnly) {
      setActiveDisciplineFilter("all");
      return;
    }
    setActiveDisciplineFilter(groupId);
    setMobileClusterId(groupId);

    const grp = ENGINEERING_STACK_CATEGORIES.find((g) => g.id === groupId);
    if (grp && grp.items.length > 0) {
      const currentInGroup =
        selectedTech &&
        grp.items.some((i) => i.name.toLowerCase() === selectedTech.toLowerCase());
      if (!currentInGroup) {
        onSelectTech(grp.items[0].name);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    // Auto-select & focus if user searches an indexed tech not in the 18 core nodes
    for (const grp of ENGINEERING_STACK_CATEGORIES) {
      const exact = grp.items.find((i) => i.name.toLowerCase().includes(trimmed));
      if (exact) {
        const isInCore = overviewGraph.coreLookup.has(exact.name.toLowerCase());
        if (!isInCore) {
          setActiveDisciplineFilter(grp.id);
          setFocusCategoryOnly(true);
        }
        setMobileClusterId(grp.id);
        onSelectTech(exact.name);
        break;
      }
    }
  };

  const handleResetView = () => {
    setActiveDisciplineFilter("all");
    setFocusCategoryOnly(false);
    setSearchQuery("");
    setZoomLevel(1);
    setHoveredId(null);
    onSelectTech(null);
  };

  const hasModifiedState =
    activeDisciplineFilter !== "all" ||
    focusCategoryOnly ||
    Boolean(selectedTech) ||
    searchQuery.trim().length > 0 ||
    zoomLevel !== 1;

  const activeMobileGroup =
    ENGINEERING_STACK_CATEGORIES.find((g) => g.id === mobileClusterId) ||
    ENGINEERING_STACK_CATEGORIES[0];

  const activeMobileFilteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeMobileGroup.items;
    return activeMobileGroup.items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.evidenceSummary.toLowerCase().includes(q)
    );
  }, [activeMobileGroup, searchQuery]);

  return (
    <section id="skill-constellation" className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            <Network className="w-3.5 h-3.5" aria-hidden="true" />
            <span>01 · Interactive Skill Constellation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight">
            Engineering Knowledge Graph &amp; Evidence Topology
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Six capability clusters anchored to core CSE &amp; AI/ML foundations. Click any discipline or technology node to inspect verified descriptions, practical use cases, and linked repositories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {selectedTech && (
            <button
              type="button"
              onClick={() => onSelectTech(null)}
              className="btn btn-secondary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs font-mono"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Selection</span>
            </button>
          )}
          {hasModifiedState && (
            <button
              type="button"
              onClick={handleResetView}
              className="btn btn-secondary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset View</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls Toolbar: Search + Category Bar + Focus Mode */}
      <div className="card p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search node across all 38 technologies…"
              aria-label="Search technology in skill constellation"
              className="w-full min-h-[44px] sm:min-h-[40px] pl-9 pr-10 py-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-base sm:text-xs font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear constellation search"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeDisciplineFilter !== "all" && (
              <button
                type="button"
                onClick={() => setFocusCategoryOnly((prev) => !prev)}
                aria-pressed={focusCategoryOnly}
                className={`hidden lg:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[6px] border text-xs font-mono transition-colors cursor-pointer ${
                  focusCategoryOnly
                    ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                    : "bg-[var(--surface)] text-[var(--text)] border-[var(--border-strong)] hover:border-[var(--accent)]"
                }`}
              >
                {focusCategoryOnly ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Show All Clusters</span>
                  </>
                ) : (
                  <>
                    <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Focus Category Nodes</span>
                  </>
                )}
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
                disabled={zoomLevel <= 0.85}
                aria-label="Zoom out skill graph"
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-[4px] text-[var(--text-secondary)] hover:text-[var(--text)] disabled:opacity-40 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className="px-1.5 text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.45, Number((z + 0.15).toFixed(2))))}
                disabled={zoomLevel >= 1.45}
                aria-label="Zoom in skill graph"
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-[4px] text-[var(--text-secondary)] hover:text-[var(--text)] disabled:opacity-40 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Buttons (Desktop 1024px+) */}
        <div
          className="hidden lg:flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter constellation by engineering discipline"
        >
          <button
            type="button"
            onClick={() => {
              setActiveDisciplineFilter("all");
              setFocusCategoryOnly(false);
            }}
            aria-pressed={activeDisciplineFilter === "all"}
            className={`min-h-[38px] px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeDisciplineFilter === "all"
                ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
            }`}
          >
            All Clusters ({ENGINEERING_STACK_CATEGORIES.length})
          </button>

          {ENGINEERING_STACK_CATEGORIES.map((grp) => {
            const isSelected = activeDisciplineFilter === grp.id;
            const accent = CATEGORY_ACCENTS[grp.id] || "#c7e34a";
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => handleSelectDiscipline(grp.id)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-3 rounded-[1px] shrink-0"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-contrast)" : accent,
                  }}
                />
                <span>
                  {grp.code} · {grp.label.split("&")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP & TABLET HYBRID WORKSPACE (Mobile stacked + bottom sheet; Tablet 768-1023px 2-col cluster explorer + inspector; Desktop 1024px+ radial SVG + inspector) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* MOBILE & TABLET CLUSTER EXPLORER (< 1024px — prevents ultra-shrunk SVG labels on tablet portrait & compact phones) */}
        <div className="md:col-span-7 lg:hidden flex flex-col">
        <div className="card p-4 sm:p-5 space-y-3.5 bg-[var(--surface-2)] flex-1">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] block">
                CSE · AI/ML — Systems Core
              </span>
              <span className="text-sm font-bold font-display text-[var(--text)]">
                6 Capability Clusters
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
              {TOTAL_VERIFIED_TECHNOLOGIES} Nodes
            </span>
          </div>

          {/* Horizontally scrollable touch cluster tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1"
            role="tablist"
            aria-label="Engineering capability clusters"
          >
            {ENGINEERING_STACK_CATEGORIES.map((grp) => {
              const isSelected = activeMobileGroup.id === grp.id;
              const accent = CATEGORY_ACCENTS[grp.id] || "#c7e34a";
              return (
                <button
                  key={grp.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setMobileClusterId(grp.id);
                    setActiveDisciplineFilter(grp.id);
                  }}
                  className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] border text-xs font-mono whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-3 rounded-[1px] shrink-0"
                    style={{
                      backgroundColor: isSelected ? "var(--accent-contrast)" : accent,
                    }}
                  />
                  <span>
                    {grp.code} · {grp.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expanded Mobile Cluster Technologies */}
          <div className="space-y-2.5 pt-1" role="tabpanel">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold font-display text-[var(--text)]">
                {activeMobileGroup.code}. {activeMobileGroup.label}
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                {activeMobileFilteredItems.length} Technologies
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {activeMobileGroup.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeMobileFilteredItems.map((item) => {
                const isSelected = inspectorDetail.item.id === item.id && Boolean(selectedTech);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const openSheet =
                        typeof window !== "undefined" &&
                        window.matchMedia("(max-width: 767px)").matches;
                      handleSelectTechNode(item.name, activeMobileGroup.id, openSheet);
                    }}
                    className={`min-h-[44px] w-full text-left px-3.5 py-2.5 rounded-[8px] border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)]"
                        : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-bold truncate">
                        {item.name}
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          isSelected
                            ? "text-[var(--accent-contrast)] opacity-80"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {item.evidenceProjects.length > 0
                          ? `${item.evidenceProjects.length} linked project${item.evidenceProjects.length > 1 ? "s" : ""}`
                          : "Academic coursework"}
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        {/* SVG Knowledge Graph Stage (>= 1024px) */}
        <div
          ref={graphContainerRef}
          className="hidden lg:flex lg:col-span-8 skill-graph p-4 sm:p-5 flex-col justify-between gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>{renderedGraph.modeLabel}</span>
            </div>
            <span className="tabular-nums">{renderedGraph.nodeSummary}</span>
          </div>

          <div className="relative w-full">
            <svg
              viewBox={svgViewBox}
              role="img"
              aria-label="Interactive skill constellation connecting CSE AI/ML hub to engineering disciplines and technologies"
              className="w-full h-auto block select-none"
            >
              <defs>
                <radialGradient id="constellationHubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.24" />
                  <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Subtle Orbital Concentric Guides */}
              {!isFocusedClusterGraph && (
                <g aria-hidden="true">
                  <motion.circle
                    cx={renderedGraph.hub.x}
                    cy={renderedGraph.hub.y}
                    r={148}
                    fill="none"
                    stroke="var(--graph-edge)"
                    strokeWidth="1"
                    strokeDasharray="4 7"
                    className={reduced ? "" : "skill-orbit-cw"}
                    initial={reduced ? { opacity: 0.7 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{
                      duration: reduced ? 0 : MOTION_DURATION.enter,
                      delay: reduced ? 0 : 0.08,
                    }}
                  />
                  <motion.circle
                    cx={renderedGraph.hub.x}
                    cy={renderedGraph.hub.y}
                    r={255}
                    fill="none"
                    stroke="var(--graph-edge)"
                    strokeWidth="1"
                    strokeDasharray="3 9"
                    className={reduced ? "" : "skill-orbit-ccw"}
                    initial={reduced ? { opacity: 0.5 } : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{
                      duration: reduced ? 0 : MOTION_DURATION.enter,
                      delay: reduced ? 0 : 0.12,
                    }}
                  />
                </g>
              )}

              <circle
                cx={renderedGraph.hub.x}
                cy={renderedGraph.hub.y}
                r={108}
                fill="url(#constellationHubGlow)"
              />

              {/* Hub -> Discipline Edges (curved cleanly away from cluster labels) */}
              {renderedGraph.disciplines.map((d, idx) => {
                const isHighlighted =
                  hoveredId === d.group.id ||
                  activeDisciplineFilter === d.group.id ||
                  (selectedTech && inspectorDetail.group.id === d.group.id) ||
                  Boolean(searchMatches?.matchingGroups.has(d.group.id));

                const isDimmed =
                  (activeDisciplineFilter !== "all" &&
                    activeDisciplineFilter !== d.group.id) ||
                  Boolean(searchMatches && !searchMatches.matchingGroups.has(d.group.id));

                const startRim = getCircleRimPoint(
                  renderedGraph.hub.x,
                  renderedGraph.hub.y,
                  HUB_RADIUS,
                  d.hubCurveControl.x,
                  d.hubCurveControl.y
                );
                const endRim = getCircleRimPoint(
                  d.x,
                  d.y,
                  CLUSTER_RADIUS + 2,
                  d.hubCurveControl.x,
                  d.hubCurveControl.y
                );

                const dPath = `M ${startRim.x.toFixed(1)} ${startRim.y.toFixed(1)} Q ${d.hubCurveControl.x} ${d.hubCurveControl.y} ${endRim.x.toFixed(1)} ${endRim.y.toFixed(1)}`;

                return (
                  <motion.path
                    key={`hub-edge-${d.group.id}`}
                    d={dPath}
                    className="skill-connection"
                    data-active={isHighlighted ? "true" : "false"}
                    style={{
                      opacity: isDimmed ? 0.2 : isHighlighted ? 1 : 0.72,
                    }}
                    initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: MOTION_DURATION.enter,
                            delay: 0.14 + idx * 0.04,
                            ease: MOTION_EASE.out,
                          }
                    }
                  />
                );
              })}

              {/* Discipline -> Technology Capsule Edges */}
              {renderedGraph.techNodes.map((node, idx) => {
                const parent = renderedGraph.disciplines.find(
                  (d) => d.group.id === node.group.id
                );
                if (!parent) return null;

                const isSelectedNode = activeTechNodeId === node.item.id;
                const isHoveredNode = hoveredId === node.item.id;
                const isHoveredCluster = hoveredId === node.group.id;
                const isRelated = relatedTechSet.has(node.item.name.toLowerCase());
                const isSearchMatch = searchMatches
                  ? searchMatches.matchingIds.has(node.item.id)
                  : false;

                const isActiveEdge =
                  isSelectedNode ||
                  isHoveredNode ||
                  isHoveredCluster ||
                  isSearchMatch;

                const isDimmed =
                  (activeDisciplineFilter !== "all" &&
                    activeDisciplineFilter !== node.group.id) ||
                  (searchMatches !== null && !isSearchMatch);

                const startRim = getCircleRimPoint(
                  parent.x,
                  parent.y,
                  CLUSTER_RADIUS + 2,
                  node.x,
                  node.y
                );
                const endAnchor = getEdgeCapsuleAnchor(parent.x, parent.y, node);
                const midX = (startRim.x + endAnchor.x) / 2;
                const ctrlY = startRim.y + (endAnchor.y - startRim.y) * 0.22;

                const dPath = `M ${startRim.x.toFixed(1)} ${startRim.y.toFixed(1)} Q ${midX.toFixed(1)} ${ctrlY.toFixed(1)} ${endAnchor.x.toFixed(1)} ${endAnchor.y.toFixed(1)}`;

                return (
                  <motion.path
                    key={`tech-edge-${node.item.id}`}
                    d={dPath}
                    className="skill-connection"
                    data-active={isActiveEdge ? "true" : "false"}
                    style={{
                      opacity: isDimmed
                        ? 0.16
                        : isActiveEdge
                        ? 1
                        : isRelated
                        ? 0.78
                        : 0.65,
                    }}
                    initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: MOTION_DURATION.enter,
                            delay: 0.24 + idx * 0.02,
                            ease: MOTION_EASE.out,
                          }
                    }
                  />
                );
              })}

              {/* Central Hub: CSE · AI/ML — SYSTEMS CORE */}
              <motion.g
                aria-label="Core Computer Science and AI/ML Foundation"
                initial={reduced ? false : { opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : MOTION_DURATION.enter, ease: MOTION_EASE.out }}
              >
                <circle
                  cx={renderedGraph.hub.x}
                  cy={renderedGraph.hub.y}
                  r={HUB_RADIUS + 8}
                  fill="none"
                  stroke="var(--graph-edge)"
                  strokeWidth={1}
                />
                <circle
                  cx={renderedGraph.hub.x}
                  cy={renderedGraph.hub.y}
                  r={HUB_RADIUS}
                  fill="var(--graph-node-bg)"
                  stroke="var(--graph-edge-active)"
                  strokeWidth={2}
                />
                <text
                  x={renderedGraph.hub.x}
                  y={renderedGraph.hub.y - 7}
                  textAnchor="middle"
                  fill="var(--graph-edge-active)"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1.2"
                >
                  CSE · AI/ML
                </text>
                <text
                  x={renderedGraph.hub.x}
                  y={renderedGraph.hub.y + 13}
                  textAnchor="middle"
                  fill="var(--graph-node-text)"
                  fontSize="12.5"
                  fontWeight="800"
                  fontFamily="var(--font-sans)"
                >
                  SYSTEMS CORE
                </text>
              </motion.g>

              {/* Six Capability Cluster Nodes */}
              {renderedGraph.disciplines.map((d, idx) => {
                const isFocused =
                  activeDisciplineFilter === d.group.id ||
                  hoveredId === d.group.id ||
                  (selectedTech && inspectorDetail.group.id === d.group.id);
                const isDimmed =
                  (activeDisciplineFilter !== "all" &&
                    activeDisciplineFilter !== d.group.id) ||
                  Boolean(searchMatches && !searchMatches.matchingGroups.has(d.group.id));

                const shortTitle =
                  d.group.id === "ml-cv"
                    ? "Machine Learning"
                    : d.group.id === "core-cs"
                    ? "Computer Science"
                    : d.group.id === "backend-data"
                    ? "Backend & Data"
                    : d.group.label;

                return (
                  <motion.g
                    key={`cluster-${d.group.id}`}
                    className="skill-cluster"
                    role="button"
                    tabIndex={0}
                    aria-pressed={activeDisciplineFilter === d.group.id}
                    aria-label={`${d.group.code} ${d.group.label} cluster`}
                    onClick={() => handleSelectDiscipline(d.group.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectDiscipline(d.group.id);
                      }
                    }}
                    onMouseEnter={() => setHoveredId(d.group.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ opacity: isDimmed ? 0.34 : 1 }}
                    initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: isDimmed ? 0.34 : 1, scale: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: MOTION_DURATION.fast,
                            delay: 0.14 + idx * 0.04,
                            ease: MOTION_EASE.out,
                          }
                    }
                  >
                    {/* Subtle depth ring */}
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={CLUSTER_RADIUS + 4}
                      fill="none"
                      stroke={isFocused ? d.accentColor : "transparent"}
                      strokeOpacity={0.35}
                      strokeWidth={1.2}
                    />
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={CLUSTER_RADIUS}
                      fill={
                        isFocused ? "var(--graph-active-fill)" : "var(--graph-node-bg)"
                      }
                      stroke={isFocused ? "var(--graph-active-fill)" : d.accentColor}
                      strokeOpacity={isFocused ? 1 : 0.55}
                      strokeWidth={isFocused ? 2 : 1.35}
                    />
                    <text
                      x={d.x}
                      y={d.y + 4}
                      textAnchor="middle"
                      fill={
                        isFocused ? "var(--graph-active-text)" : "var(--graph-node-text)"
                      }
                      fontSize="11.5"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {d.group.code}
                    </text>

                    {/* Clean Halo-Protected Cluster Title */}
                    <text
                      x={d.labelX}
                      y={d.labelY}
                      textAnchor="middle"
                      fill={isFocused ? "var(--graph-node-text)" : "var(--text-secondary)"}
                      stroke="var(--graph-surface)"
                      strokeWidth={5}
                      paintOrder="stroke"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {shortTitle}
                    </text>
                  </motion.g>
                );
              })}

              {/* Interactive Technology Capsules */}
              {renderedGraph.techNodes.map((node, idx) => {
                const isSelected = activeTechNodeId === node.item.id;
                const isHovered = hoveredId === node.item.id;
                const isSearchMatch = searchMatches
                  ? searchMatches.matchingIds.has(node.item.id)
                  : false;
                const isRelated =
                  Boolean(selectedTech) &&
                  relatedTechSet.has(node.item.name.toLowerCase());
                const isParentHovered = hoveredId === node.group.id;

                const isDimmed =
                  (activeDisciplineFilter !== "all" &&
                    activeDisciplineFilter !== node.group.id) ||
                  (searchMatches !== null && !isSearchMatch);

                const halfW = node.width / 2;
                const halfH = node.height / 2;

                return (
                  <motion.g
                    key={`tech-${node.item.id}`}
                    className="skill-node"
                    data-active={isSelected || isSearchMatch ? "true" : "false"}
                    data-related={
                      isRelated || isParentHovered ? "true" : "false"
                    }
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Inspect ${node.item.name} in ${node.group.label}`}
                    onClick={() =>
                      handleSelectTechNode(node.item.name, node.group.id, false)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectTechNode(node.item.name, node.group.id, false);
                      }
                    }}
                    onMouseEnter={() => setHoveredId(node.item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: isDimmed ? 0.25 : 1, scale: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: MOTION_DURATION.fast,
                            delay: 0.26 + idx * 0.018,
                            ease: MOTION_EASE.out,
                          }
                    }
                  >
                    <rect
                      x={node.x - halfW}
                      y={node.y - halfH}
                      width={node.width}
                      height={node.height}
                      rx={16}
                      className="skill-node-capsule"
                      style={
                        !isSelected && !isHovered && !isSearchMatch && isParentHovered
                          ? { stroke: node.accentColor, strokeWidth: 1.4 }
                          : undefined
                      }
                    />
                    {/* Category-aware subtle vertical bar accent inside capsule */}
                    <rect
                      x={node.x - halfW + 10}
                      y={node.y - 6}
                      width={2.5}
                      height={12}
                      rx={1.25}
                      fill={
                        isSelected || isHovered || isSearchMatch
                          ? "var(--graph-active-text)"
                          : node.accentColor
                      }
                      opacity={isSelected || isHovered ? 0.9 : 0.78}
                      aria-hidden="true"
                    />
                    <text
                      x={node.x + 5}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="skill-node-label"
                      fontFamily="var(--font-mono)"
                    >
                      {node.item.name}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Graph Legend / Relationship Note */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {searchMatches && searchMatches.matchingIds.size === 0 ? (
                <span className="text-[var(--warning)]">
                  No technologies match &ldquo;{searchQuery}&rdquo; — clear search to restore nodes
                </span>
              ) : (
                <>
                  <span>Click any cluster (01–06) to isolate</span>
                  <span aria-hidden="true">·</span>
                  <span>Click any capsule to inspect evidence</span>
                </>
              )}
            </div>
            <span className="tabular-nums">
              {selectedTech ? `Active: ${selectedTech}` : "Default Preview: TypeScript"}
            </span>
          </div>
        </div>

        {/* Right Detail Profile Panel (Desktop 1024px+ 4 cols / Tablet 768-1023px 5 cols / Mobile below cards) */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.aside
              key={inspectorDetail.item.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{
                duration: reduced ? 0 : MOTION_DURATION.fast,
                ease: MOTION_EASE.out,
              }}
              className="card p-5 flex-1 flex flex-col justify-between gap-5 border border-[var(--border-strong)] bg-[var(--surface-2)]"
              aria-live="polite"
              aria-label={`Capability profile for ${inspectorDetail.item.name}`}
            >
              <div className="space-y-4">
                {/* Category & Scope Metadata (unboxed typographic separators) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                    <span
                      className="w-1.5 h-3 rounded-[1px] shrink-0"
                      style={{ backgroundColor: inspectorDetail.accentColor }}
                      aria-hidden="true"
                    />
                    <span>
                      {inspectorDetail.group.code} · {inspectorDetail.group.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {SCOPE_LABELS[inspectorDetail.item.evidenceScope]}
                  </span>
                </div>

                {/* Technology Heading & Technical Description */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Compass
                        className="w-4 h-4 text-[var(--accent)] shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="text-xl font-extrabold font-display text-[var(--text)] tracking-tight truncate">
                        {inspectorDetail.item.name}
                      </h3>
                    </div>
                    {selectedTech && (
                      <CheckCircle2
                        className="w-4 h-4 text-[var(--accent)] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {inspectorDetail.description}
                  </p>
                </div>

                {/* Practical Application */}
                <div className="p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] block">
                    Practical Application
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {inspectorDetail.practicalApplication}
                  </p>
                </div>

                {/* Related Technologies */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                    Related Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectorDetail.relatedTechNames.map((relName) => (
                      <button
                        key={relName}
                        type="button"
                        onClick={() => onSelectTech(relName)}
                        className="min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                      >
                        {relName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Linked Shipped Projects */}
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                  <span className="uppercase tracking-wider">
                    Project Connections ({inspectorDetail.projects.length})
                  </span>
                  <span className="tabular-nums">Verified Evidence</span>
                </div>

                {inspectorDetail.projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {inspectorDetail.projects.slice(0, 3).map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-2.5"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="font-bold font-display text-[var(--text)] truncate">
                              {proj.title}
                            </span>
                            <span className="text-[var(--text-faint)]">·</span>
                            <span className="text-[11px] text-[var(--accent)] truncate">
                              {proj.categoryLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                            {proj.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${proj.title} GitHub repository`}
                            className="min-w-[40px] min-h-[40px] [@media(pointer:coarse)]:min-w-[44px] [@media(pointer:coarse)]:min-h-[44px] inline-flex items-center justify-center rounded-[6px] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--border-strong)] transition-colors"
                          >
                            <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                          {onNavigateToProject && (
                            <button
                              type="button"
                              onClick={() => onNavigateToProject(proj.id)}
                              className="min-h-[40px] [@media(pointer:coarse)]:min-h-[44px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-mono text-[11px] font-bold hover:bg-[var(--accent-strong)] transition-colors cursor-pointer"
                            >
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] p-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
                    Applied primarily within KIIT B.Tech CSE (AI &amp; ML) core coursework and algorithmic engineering practice.
                  </p>
                )}
              </div>
            </motion.aside>
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET DETAIL DRAWER (< 768px) */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`${inspectorDetail.item.name} capability details`}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSheetOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />

            <motion.div
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={{ duration: reduced ? 0 : 0.24, ease: MOTION_EASE.out }}
              className="relative z-10 w-full max-h-[84dvh] overflow-y-auto rounded-t-[18px] border-t border-[var(--border-strong)] bg-[var(--surface-2)] p-5 pb-7 space-y-4 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto" aria-hidden="true" />

              <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)]">
                    {inspectorDetail.group.code} · {inspectorDetail.group.label}
                  </div>
                  <h3 className="text-lg font-extrabold font-display text-[var(--text)]">
                    {inspectorDetail.item.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  aria-label="Close capability details"
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {inspectorDetail.description}
              </p>

              <div className="p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Practical Application
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {inspectorDetail.practicalApplication}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Related Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectorDetail.relatedTechNames.map((relName) => (
                    <button
                      key={`mob-rel-${relName}`}
                      type="button"
                      onClick={() => onSelectTech(relName)}
                      className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer"
                    >
                      {relName}
                    </button>
                  ))}
                </div>
              </div>

              {inspectorDetail.projects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                    Linked Projects ({inspectorDetail.projects.length})
                  </span>
                  <div className="space-y-2">
                    {inspectorDetail.projects.slice(0, 3).map((proj) => (
                      <div
                        key={`mob-proj-${proj.id}`}
                        className="p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold font-display text-[var(--text)] truncate">
                            {proj.title}
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)] truncate">
                            {proj.categoryLabel}
                          </div>
                        </div>
                        {onNavigateToProject && (
                          <button
                            type="button"
                            onClick={() => {
                              setMobileSheetOpen(false);
                              onNavigateToProject(proj.id);
                            }}
                            className="min-h-[44px] inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-[var(--accent-fill)] text-[var(--accent-contrast)] text-xs font-mono font-bold shrink-0 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTech(null);
                    setMobileSheetOpen(false);
                  }}
                  className="btn btn-secondary flex-1 !min-h-[44px] !text-xs font-mono"
                >
                  Clear Node
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  className="btn btn-primary flex-1 !min-h-[44px] !text-xs font-mono"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SkillConstellation;
