import operonImg from "../assets/projects/operon-cover.svg";
import mausamImg from "../assets/projects/mausam-og.png";
import sightforgeImg from "../assets/projects/sightforge-cover.svg";
import memoryInMotionImg from "../assets/projects/memory-in-motion-og.png";
import axiomImg from "../assets/projects/axiom-cover.svg";
import inkloomImg from "../assets/projects/inkloom-og.png";
import campusConnectImg from "../assets/projects/campus-connect-cover.jpg";
import sayamSolvesImg from "../assets/projects/sayam-solves-cover.svg";
import portfolioImg from "../assets/images/og_preview_image_1789846807253.jpg";

export interface ProjectMediaEntry {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
}

export const PROJECT_MEDIA: Record<string, ProjectMediaEntry> = {
  operon: {
    src: operonImg,
    alt: "OPERON multi-agent task dispatcher across Support, Finance, HR, and Ops with human-in-the-loop approval gates",
    caption: "Multi-agent operations platform & HITL approval state machine (operonpro.vercel.app)",
    aspect: "16:9",
  },
  mausam: {
    src: mausamImg,
    alt: "MAUSAM atmospheric observation, Doppler radar nowcasting, NAQI, and INCOIS coastal telemetry interface",
    caption: "SIH 2026 weather & hazard intelligence platform by Team ALGNITE (mausamgovt.vercel.app)",
    aspect: "16:9",
  },
  sightforge: {
    src: sightforgeImg,
    alt: "SightForge dual-service YOLOv8 person detector, 17-keypoint pose estimator, and ByteTrack CV pipeline",
    caption: "Next.js 15 + FastAPI YOLOv8 COCO-0, 17-keypoint pose & ByteTrack atomic CVFrame pipeline",
    aspect: "16:9",
  },
  "memory-in-motion": {
    src: memoryInMotionImg,
    alt: "Memory in Motion interactive mechanistic interpretability lab for fixed-size recurrent memory and BDH architecture",
    caption: "DataForge 2026 IIT Kharagpur mechanistic lab — O(1) state vs O(T) KV cache (memoryinmotion.vercel.app)",
    aspect: "16:9",
  },
  axiom: {
    src: axiomImg,
    alt: "AXIOM autonomous operations control plane with deterministic policy engine, sandbox simulation, and audit chain",
    caption: "WCC Launchpad 30 autonomous operations control plane & tamper-evident audit (axiomwcc.vercel.app)",
    aspect: "16:9",
  },
  inkloom: {
    src: inkloomImg,
    alt: "INKLOOM specialized AI workspace for constructed logo design with composition rules and clear-space lockups",
    caption: "Constructed AI logo systems & composition engine (inkloom.art · forked master branch)",
    aspect: "16:9",
  },
  "campus-connect": {
    src: campusConnectImg,
    alt: "CampusConnect student event discovery, registration, and organizer dashboard preview",
    caption: "College event discovery & live organizer seat synchronization (campusconnect1273.vercel.app)",
    aspect: "16:9",
  },
  "sayam-solves": {
    src: sayamSolvesImg,
    alt: "SayamSolves C++20 DSA archive with LeetHub V2 synced solutions for LC 0005, 0033, and 0115",
    caption: "C++20 algorithmic archive synced via LeetHub V2 (3 repo files · 4 LeetCode solved)",
    aspect: "16:9",
  },
  portfolio: {
    src: portfolioImg,
    alt: "Sayam Mukherjee interactive engineering portfolio and live GitHub telemetry architecture",
    caption: "Supporting meta codebase: sayammukherjee.in (React, TypeScript & Express)",
    aspect: "16:9",
  },
};

export function getProjectMedia(projectId: string): ProjectMediaEntry {
  const normalized = projectId.toLowerCase();
  return PROJECT_MEDIA[normalized] || PROJECT_MEDIA.operon;
}
