import operonImg from "../assets/projects/operon-live.png";
import mausamImg from "../assets/projects/mausam-live.png";
import sightforgeImg from "../assets/projects/sightforge-cover.png";
import memoryInMotionImg from "../assets/projects/memory-in-motion-live.png";
import axiomImg from "../assets/projects/axiom-live.png";
import inkloomImg from "../assets/projects/inkloom-live.png";
import campusConnectImg from "../assets/projects/campus-connect-live.png";
import sayamSolvesImg from "../assets/projects/sayam-solves-cover.png";
import portfolioImg from "../assets/images/og_preview_image_1789846807253.jpg";

export interface ProjectMediaEntry {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  isMissing?: boolean;
}

export const PROJECT_MEDIA: Record<string, ProjectMediaEntry> = {
  operon: {
    src: operonImg,
    alt: "OPERON Control Center multi-agent task dispatcher across Support, Finance, HR, and Ops with human-in-the-loop approval gates",
    caption: "Live production interface: Multi-agent HITL approval state machine (operonpro.vercel.app)",
    aspect: "16:10",
  },
  mausam: {
    src: mausamImg,
    alt: "MAUSAM 3D atmospheric intelligence map with Indian stations, wind vectors, Doppler nowcasting, and Ask MAUSAM AI",
    caption: "Live deployment: SIH 2026 atmospheric & hazard platform by Team ALGNITE (mausamgovt.vercel.app)",
    aspect: "16:10",
  },
  sightforge: {
    src: sightforgeImg,
    alt: "SightForge dual-service YOLOv8 person detector, 17-keypoint pose estimator, and ByteTrack CVFrame canvas preview",
    caption: "Next.js 15 + FastAPI YOLOv8 COCO-0, 17-keypoint pose & ByteTrack atomic CVFrame pipeline",
    aspect: "16:10",
  },
  "memory-in-motion": {
    src: memoryInMotionImg,
    alt: "Memory in Motion visual research essay contrasting fixed-size recurrent memory and Hebbian fast weights",
    caption: "Live deployment: DataForge 2026 IIT Kharagpur mechanistic lab (memoryinmotion.vercel.app)",
    aspect: "16:10",
  },
  axiom: {
    src: axiomImg,
    alt: "AXIOM autonomous operations control plane with deterministic policy engine, sandbox simulation, and audit chain",
    caption: "Live deployment: WCC Launchpad 30 autonomous operations control plane (axiomwcc.vercel.app)",
    aspect: "16:10",
  },
  inkloom: {
    src: inkloomImg,
    alt: "INKLOOM constructed AI logo design and geometric composition system landing workspace",
    caption: "Live early-access workspace: Constructed AI logo systems (inkloom.art · forked master branch)",
    aspect: "16:10",
  },
  "campus-connect": {
    src: campusConnectImg,
    alt: "CampusConnect student event discovery catalog showing Hack the Campus, seat counters, and filters",
    caption: "Live deployment: College event discovery & organizer dashboard (campusconnect1273.vercel.app)",
    aspect: "16:10",
  },
  "sayam-solves": {
    src: sayamSolvesImg,
    alt: "SayamSolves C++20 DSA archive with LeetHub V2 synced solutions for LC 0005, 0033, and 0115",
    caption: "C++20 algorithmic archive synced via LeetHub V2 (3 repo files · 4 LeetCode baseline)",
    aspect: "16:10",
  },
  portfolio: {
    src: portfolioImg,
    alt: "Sayam Mukherjee interactive engineering portfolio and live GitHub telemetry architecture",
    caption: "Supporting meta codebase: sayammukherjee.in (React, TypeScript & Express)",
    aspect: "16:10",
  },
};

export function getProjectMedia(projectId: string): ProjectMediaEntry {
  const normalized = projectId.toLowerCase();
  if (PROJECT_MEDIA[normalized]) {
    return PROJECT_MEDIA[normalized];
  }
  if (import.meta.env.DEV) {
    console.warn(`[ProjectMedia] Missing media asset registration for project "${projectId}".`);
  }
  return {
    src: "",
    alt: `Preview image unavailable for ${projectId}`,
    caption: "Verified preview screenshot not registered for this project",
    aspect: "16:10",
    isMissing: true,
  };
}
