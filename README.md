# Sayam Mukherjee | Interactive Portfolio

A personal developer portfolio and engineering showcase built with React 19, TypeScript, Tailwind CSS, Vite, and an Express backend. The project highlights selected software projects, algorithmic problem solving, academic milestones, and pre-rendered GitHub activity telemetry.

**Live Website:** [sayammukherjee.in](https://sayammukherjee.in)  
**Portfolio Repository:** [codesbysayam/Sayam-Mukherjee-Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)  
**GitHub Profile:** [codesbysayam](https://github.com/codesbysayam)  
**Profile README Repository:** [codesbysayam/codesbysayam](https://github.com/codesbysayam/codesbysayam)

---

## Overview

Sayam Mukherjee's Interactive Portfolio is a personal portfolio built to showcase selected software projects, technical interests, academic background, and engineering work. The repository contains the website's source code and the supporting functionality implemented in the project.

- **Academic Program:** B.Tech in Computer Science & Engineering (Specialization: Artificial Intelligence & Machine Learning) at **KIIT University**, Bhubaneswar (2025–2029).
- **Core Focus:** Artificial Intelligence, Machine Learning, Full-Stack Development, Data Structures & Algorithms, Computer Vision, and Software Engineering.
- **Engineering Principles:** Clean modular code, verifiable data, authentic project representations, and responsive UI architecture.

---

## Implemented Features

- **Curated Project Showcase:** Detailed presentations of primary software projects with architecture overviews, technology stacks, live deployments, and case studies.
- **Pre-Rendered GitHub Activity Telemetry:** Scheduled GitHub Actions generate static JSON snapshots (`public/data/github.json`) of repository metadata and recent activity. The client renders this data without making client-side GitHub API requests, avoiding rate limits and token requirements for visitors.
- **Structured Credentials & Verification Archive:** Fullscreen certificate inspection system with verified records for hackathons (IGNITHON 2.0), research exhibits (DataForge 2026), workshops (MATLAB Workshop, IEEE KIIT), and academic grade reports.
- **Responsive Dark & Light Interface:** Liquid Glass visual design engineered with Tailwind CSS, custom design tokens, and smooth motion transitions using Motion (v12).
- **Interactive Assistant Proxy:** Server-side proxy endpoint communicating with the Gemini API to answer visitor queries regarding projects and background without exposing API credentials to the client.
- **GitHub Profile Synchronization:** Standalone profile assets maintained in `github-profile/` can be automatically synchronized to the public GitHub profile repository (`codesbysayam/codesbysayam`) via GitHub Actions.

---

## Technology Stack

### Frontend
- **Framework:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript 5.8
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (v4)
- **Animation & UI:** Motion (v12), Lucide React, Canvas Confetti
- **Data Visualization:** Recharts, D3
- **Markdown Rendering:** React Markdown

### Backend & Middleware
- **Runtime:** Node.js (v18+)
- **Server:** Express 4 (integrated with Vite middlewares in development)
- **Bundler:** esbuild (bundles `server.ts` to `dist/server.cjs` for production)
- **Deployment Adapter:** Vercel serverless entry point (`api/index.ts`) with custom security headers (`vercel.json`)
- **AI Integration:** `@google/genai` (server-side assistant endpoint)

### Tooling & Automation
- **Type Checking:** `tsc --noEmit`
- **Data Validation:** Python 3 validation script (`tools/python/portfolio_data_validator.py`)
- **Metrics Utility:** C metrics tool (`tools/c/portfolio_metrics.c`)
- **CI/CD Workflows:** GitHub Actions for scheduled snapshot generation and profile synchronization

---

## Primary Portfolio Projects

The portfolio highlights five primary software projects across AI/ML, systems, full-stack development, and algorithms:

| Project | Description | Stack | Repository / Links |
|:---|:---|:---|:---:|
| **[OPERON](https://github.com/codesbysayam/Operon)** | Operations platform exploring multi-agent workflows across Support, Finance, and HR, using human-in-the-loop checkpoints for critical decisions. | TypeScript, Node.js, Express, React, Multi-Agent AI, REST API | [`codesbysayam/Operon`](https://github.com/codesbysayam/Operon)<br>[Live Demo](https://operonpro.vercel.app) |
| **[SayamSolves](https://github.com/codesbysayam/sayam-solves)** | Open-source C++ repository documenting deliberate daily algorithmic problem solving across LeetCode, with time and space complexity notes. | C++, Data Structures, Algorithms, LeetCode | [`codesbysayam/sayam-solves`](https://github.com/codesbysayam/sayam-solves) |
| **[MAUSAM](https://github.com/codesbysayam/mausam)** | Weather intelligence and climate dashboard built for Smart India Hackathon (SIH 2026) by Team Algnite, unifying forecasts, AQI, UV index, soil moisture, and coastal tides. | TypeScript, React, Tailwind CSS, Weather APIs, Python | [`codesbysayam/mausam`](https://github.com/codesbysayam/mausam)<br>[Live Demo](https://mausamgovt.vercel.app) |
| **[Interactive Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)** | Full-stack personal portfolio and developer showcase featuring pre-rendered GitHub telemetry, responsive UI architecture, and verified credentials. | React 19, TypeScript, Tailwind CSS, Express, Vite, Motion | [`codesbysayam/Sayam-Mukherjee-Portfolio`](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)<br>[Live Site](https://sayammukherjee.in) |
| **[YOLO / Edge Computer Vision](https://github.com/codesbysayam)** | Edge computer vision pipeline combining lightweight YOLOv8 models with OpenCV frame processing to detect objects and compute spatial motion vectors on local hardware. | Python, YOLOv8, OpenCV, PyTorch, Computer Vision | [`codesbysayam`](https://github.com/codesbysayam) |

### Additional Selected Work & Event Context
- **Memory in Motion:** Research exhibit exploring in-context learning with recurrent memory, developed for DataForge 2026 at IIT Kharagpur under the *Explain the Frontier* pathway by Team ALGNITE (Sayam Mukherjee, Team Leader; Shinibali Kumar). [Project](https://memoryinmotion.vercel.app) · [Credential](https://intact-black-0mk1uydx.edgeone.dev/)
- **Deploy or Die (GDG on Campus KIIT × HowToAlgo):** Business process automation track developed by Team NEXUS (Sounak Chowdhury, Team Leader; Sayam Mukherjee; Aarush Roy; Jaydeep Dutta).
- **IGNITHON 2.0 (KIIT & KSAC):** Offline 12-hour hackathon participation by Team ALGNITE (Sayam Mukherjee, Team Leader; Shinibali Kumar), building AlertSetu and CampusConnect.

---

## Education

- **University:** KIIT University, Bhubaneswar
- **Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering
- **Specialization:** Artificial Intelligence and Machine Learning
- **Academic Duration:** 2025–2029 (Expected Graduation: 2029)
- **First-Year Academic Performance:** 9.06 overall CGPA (first-year undergraduate curriculum)
- **Secondary & Higher Secondary Education:**
  - CBSE Class 12 Board Examination: **86.2%**
  - CBSE Class 10 Board Examination: **92.6%**

---

## Verified Achievements

- 🏆 **Toycathon 2021:** Top 15 / National Finalist (Ministry of Education & AICTE, Government of India)
- 🎖️ **Technex'26, IIT BHU:** Finalist across 5 of 6 technical competition categories
- 📚 **Academic Excellence (KIIT University):** 9.06 overall CGPA in first year of B.Tech CSE AI & ML
- 🎯 **CBSE Class 10 Board:** 92.6%
- 🎯 **CBSE Class 12 Board:** 86.2%

---

## Content Creation

- **Historical Channels:**
  - *Technical AZ* (2021–2023): 2.06K+ subscribers (historical count)
  - *Daily Decipher* (2023–2026): 10K+ subscribers (historical count)
- **Current Channel:** [Obsidian Optics (@ObsidianOptics_in)](https://www.youtube.com/@ObsidianOptics_in)

---

## Repository Structure

```text
Sayam-Mukherjee-Portfolio/
├── api/
│   └── index.ts               # Vercel serverless entry point delegating to Express
├── github-profile/
│   ├── README.md              # Profile README template for codesbysayam/codesbysayam
│   └── SETUP.md               # GitHub Actions PAT configuration guide
├── public/
│   ├── data/
│   │   └── github.json        # Pre-rendered GitHub repository & event snapshot
│   ├── github-data.json       # Mirror snapshot for client compatibility
│   └── favicon.ico / icons    # Web manifest, icons, and static assets
├── scripts/
│   ├── generate_build_manifest.js  # Build manifest generator
│   └── sync-github-data.mjs   # GitHub API snapshot generator
├── server/
│   ├── certificatesStore.ts   # Server-side certificate vault loader and filter
│   └── routes/
│       └── assistant.ts       # Server-side Gemini AI assistant route handler
├── src/
│   ├── components/
│   │   ├── certificates/      # Reusable fullscreen certificate detail viewer & cards
│   │   ├── projects/          # Featured project cards and case study modals
│   │   ├── ProjectsShowcase.tsx # Search, filter, and Web Share enabled project explorer
│   │   └── ...                # Hero, About, Skills, Experience, and Contact components
│   ├── context/               # Global portfolio state and theme management
│   ├── data/                  # Canonical project data, certificates, and knowledge base
│   ├── services/              # Client services for GitHub snapshots, LeetCode, Codolio
│   ├── types/                 # TypeScript interfaces (projects, certificates, GitHub)
│   ├── App.tsx                # Main single-page application structure
│   └── main.tsx               # Client entry point
├── tools/
│   ├── c/                     # C language metrics utility (portfolio_metrics.c)
│   └── python/                # Python data integrity validator (portfolio_data_validator.py)
├── .github/
│   └── workflows/
│       ├── sync-github-data.yml    # Hourly GitHub data snapshot fetcher
│       └── sync-profile-readme.yml # Automated push to codesbysayam/codesbysayam
├── server.ts                  # Express server mounting API routes and Vite middleware
├── package.json               # Project scripts and dependencies
├── tsconfig.json              # TypeScript compiler configuration
├── vercel.json                # Vercel deployment headers and routing rules
└── vite.config.ts             # Vite configuration with React and Tailwind plugins
```

---

## GitHub Synchronization

This project implements two distinct synchronization workflows:

1. **Portfolio GitHub Data Snapshot (`.github/workflows/sync-github-data.yml`):**
   Runs hourly via GitHub Actions (or manually via `npm run sync:github`). It runs `scripts/sync-github-data.mjs` using the default repository `GITHUB_TOKEN`, fetching public repositories, language distribution, and push events. The resulting snapshot is written to `public/data/github.json`. Visitors load this pre-rendered JSON, ensuring zero client-side GitHub API rate limits.

2. **Profile README Sync (`.github/workflows/sync-profile-readme.yml`):**
   When changes to `github-profile/README.md` are pushed to the `main` branch, this workflow copies the file to the separate GitHub profile repository (`codesbysayam/codesbysayam`). This requires a GitHub secret named `PROFILE_REPO_TOKEN` with write access to the profile repository, as documented in [`github-profile/SETUP.md`](github-profile/SETUP.md).

---

## Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20 recommended)
- **Package Manager:** npm (or bun)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio.git
   cd Sayam-Mukherjee-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The development server starts at `http://localhost:3000` running Express with Vite middleware.

### Production Build

1. **Compile frontend assets and server bundle:**
   ```bash
   npm run build
   ```
   This generates the build manifest, bundles client assets via Vite to `dist/`, and bundles `server.ts` to `dist/server.cjs` via esbuild.

2. **Run the production server:**
   ```bash
   npm run start
   ```

### Additional Available Scripts

- **Type Check & Lint:**
  ```bash
  npm run lint
  ```
  Runs `tsc --noEmit` to validate all TypeScript code across the repository.

- **Manually Refresh GitHub Snapshot:**
  ```bash
  npm run sync:github
  ```
  Runs `scripts/sync-github.mjs` to fetch fresh telemetry and update local snapshot files.

- **Validate Portfolio Data:**
  ```bash
  npm run validate:data
  ```
  Executes the Python data verification script (`tools/python/portfolio_data_validator.py`).

---

## Environment Configuration

Copy `.env.example` to `.env` if you wish to configure optional server-side features:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|:---|:---|:---:|
| `GEMINI_API_KEY` | API key from Google AI Studio for the server-side AI assistant proxy. | No (optional) |
| `APP_URL` | Canonical origin URL for deployment. | No (optional) |

*Note: Visitors browsing the website or viewing projects do not require any API keys or environment variables.*

---

## Connect & Profiles

- **Website:** [sayammukherjee.in](https://sayammukherjee.in)
- **GitHub:** [@codesbysayam](https://github.com/codesbysayam)
- **LinkedIn:** [Sayam Mukherjee](https://www.linkedin.com/in/sayammukherjee-portfolio/)
- **LeetCode:** [@codesbysayam](https://leetcode.com/u/codesbysayam/)
- **Codolio:** [codesbysayam](https://codolio.com/profile/codesbysayam/)
- **YouTube:** [Obsidian Optics](https://www.youtube.com/@ObsidianOptics_in)
- **Contact Email:** [sayammukherjee1506@gmail.com](mailto:sayammukherjee1506@gmail.com)
- **Business Email:** [wrickbusiness@gmail.com](mailto:wrickbusiness@gmail.com)
