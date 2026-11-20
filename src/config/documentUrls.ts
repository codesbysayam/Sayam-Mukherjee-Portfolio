import { CANONICAL_DOMAIN } from "./seo";

export const SITE_URL = CANONICAL_DOMAIN;

/**
 * Authoritative document and media URL registry.
 */
export const DOCUMENT_PATHS = {
  resume: "https://exciting-brown-6y14ojmv.edgeone.dev/",
  portrait: "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg",
  credentials: {
    dataforgeMemoryInMotion: "https://intact-black-0mk1uydx.edgeone.dev/",
    gdgKiitOperon: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    ignithon2: "https://marked-aquamarine-cozz1tva.edgeone.dev/",
    wccLaunchpad30: "https://heavy-sapphire-gc08crqu.edgeone.dev/",
    matlabWorkshopIeeeKiit: "https://increased-purple-oeuuxfwu.edgeone.dev/",
    kiitGradeReport: "https://diverse-plum-xc5wzkru.edgeone.dev/",
  },
} as const;

export const DOCUMENT_URLS = {
  resume: "https://exciting-brown-6y14ojmv.edgeone.dev/",
  portrait: "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg",
  credentials: {
    dataforgeMemoryInMotion: "https://intact-black-0mk1uydx.edgeone.dev/",
    gdgKiitOperon: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    ignithon2: "https://marked-aquamarine-cozz1tva.edgeone.dev/",
    wccLaunchpad30: "https://heavy-sapphire-gc08crqu.edgeone.dev/",
    matlabWorkshopIeeeKiit: "https://increased-purple-oeuuxfwu.edgeone.dev/",
    kiitGradeReport: "https://diverse-plum-xc5wzkru.edgeone.dev/",
  },
} as const;

export const DOCUMENT_AVAILABILITY = {
  resumePdf: true,
  credentialsPdf: {
    dataforgeMemoryInMotion: true,
    gdgKiitOperon: true,
    ignithon2: true,
    wccLaunchpad30: true,
    matlabWorkshopIeeeKiit: true,
    kiitGradeReport: true,
  },
} as const;

export default DOCUMENT_URLS;
