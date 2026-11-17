import operonImg from "../assets/images/project_operon_architecture_1794898591965.jpg";
import mausamImg from "../assets/images/project_mausam_telemetry_1794898593166.jpg";
import sayamSolvesImg from "../assets/images/project_sayamsolves_algorithms_1794898594111.jpg";
import yoloImg from "../assets/images/project_yolo_vision_1794898594386.jpg";
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
    alt: "OPERON multi-agent task dispatcher and human-in-the-loop architecture graph",
    caption: "Multi-agent workflow orchestration & approval state machine",
    aspect: "16:9",
  },
  mausam: {
    src: mausamImg,
    alt: "MAUSAM environmental and coastal meteorological telemetry map interface",
    caption: "Regional AQI, tide, and meteorological sensor aggregation (SIH 2026)",
    aspect: "4:3",
  },
  "sayam-solves": {
    src: sayamSolvesImg,
    alt: "Algorithmic graph pathfinding and binary tree structural visualization",
    caption: "C++20 algorithmic pattern archive with asymptotic complexity logs",
    aspect: "4:3",
  },
  yolo: {
    src: yoloImg,
    alt: "Edge computer vision urban street scene with bounding-box detection overlays",
    caption: "Local YOLOv8 + OpenCV spatial tracking & velocity estimation",
    aspect: "4:3",
  },
  portfolio: {
    src: portfolioImg,
    alt: "Sayam Mukherjee interactive engineering portfolio and telemetry architecture",
    caption: "Full-stack React, TypeScript & Express system exhibit",
    aspect: "16:9",
  },
};

export function getProjectMedia(projectId: string): ProjectMediaEntry {
  const normalized = projectId.toLowerCase();
  return PROJECT_MEDIA[normalized] || PROJECT_MEDIA.operon;
}
