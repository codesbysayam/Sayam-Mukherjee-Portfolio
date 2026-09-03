# Sayam Mukherjee — Interactive AI Portfolio

> **AI & ML Student · Full Stack Developer · Content Creator · Future AI Engineer**

An interactive, AI-powered personal portfolio built to showcase my **projects, technical skills, learning journey, achievements, experience, coding activity, and creative work** — while providing visitors with an intelligent AI representative that can answer questions about my professional profile.

🌐 **Live Portfolio:** [www.sayammukherjee.in](https://www.sayammukherjee.in)

💻 **Repository:** [github.com/codesbysayam/Sayam-Mukherjee-Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)

---

## ✨ Overview

This portfolio goes beyond a traditional static resume website.

It is designed as a **living digital ecosystem** that combines:

* 🤖 AI-powered conversational interaction
* 💻 Modern React-based frontend architecture
* 📊 Interactive analytics and data visualization
* 📚 Learning and progress tracking
* 🚀 Project and technology showcase
* 🧠 Coding and developer activity
* 📝 Blog and content sections
* 📩 Contact and newsletter systems
* 🛠️ Administrative management tools
* 📄 Interactive resume experience
* 🎨 Motion-driven UI and micro-interactions

The goal is to create a portfolio that doesn't simply **tell visitors what I can build — it demonstrates it.**

---

# 🚀 Features

## 🤖 AI Portfolio Representative

An integrated AI assistant powered by Google's Gemini API.

Visitors can interact with the AI representative to learn about:

* My technical background
* Education
* Projects
* Skills
* Experience
* Learning journey
* Career interests
* Development focus

The AI is provided with a structured profile context to keep responses relevant to the portfolio.

### AI Stack

* Google Gemini API
* `@google/genai`
* Server-side API integration
* Structured system instructions
* Markdown-formatted responses
* Grounding-source extraction support

---

## 💼 Interactive Project Showcase

Projects are presented through an interactive showcase rather than a simple list.

Each project can contain:

* Project description
* Detailed overview
* Technology stack
* Category
* Project metrics
* GitHub repository
* Live demo
* Featured-project status
* Visual preview

Projects can be categorized into:

* 🤖 AI / Machine Learning
* 💻 Full Stack Development
* 🎨 Design / Media
* 📈 Finance / Analytics

---

## 📚 Learning Dashboard

A dedicated section representing my ongoing learning journey.

It tracks:

* Current learning focus
* Technical subjects
* Learning progress
* Books
* Resources
* Completion status
* LeetCode progress

Example learning areas include:

* Deep Neural Networks
* RNNs & LSTMs
* Transformers
* Data Structures & Algorithms
* Dynamic Programming
* Graph Algorithms
* Stock Technical Analysis

---

## 📊 Progress & Analytics

The portfolio includes interactive data visualization components built using **Recharts and D3**.

The analytics layer can represent:

* Visitor activity
* Countries
* Devices
* Traffic sources
* Page engagement
* Visit duration
* Daily visitor trends
* Conversion-related metrics

The architecture also includes an analytics API for recording and aggregating visitor activity.

> **Note:** Development/demo analytics may contain seeded data for demonstrating the dashboard.

---

## 🧑‍💻 Developer Activity

The portfolio includes developer-oriented visualizations such as:

* GitHub activity
* Coding statistics
* Programming-language distribution
* Repository highlights
* LeetCode progress
* Learning progress

These sections are designed to provide a broader picture of development activity beyond the traditional "Skills" section.

---

## 🎨 Content Creator Showcase

The portfolio also represents my work as a content creator and visual designer.

The system supports showcasing:

* Content creation
* Thumbnail design
* Creative projects
* Social platforms
* Digital media work
* Creator-focused services

---

## 🏆 Achievements & Certifications

Dedicated sections showcase:

* Academic achievements
* Competitions
* Workshops
* Certifications
* Industry exposure
* Extracurricular accomplishments

---

## 💬 Testimonials

The portfolio includes a testimonial workflow with:

* Testimonial submission
* Pending approval
* Admin approval
* Rejection
* Persistent testimonial storage
* Public testimonial display

This provides a structured way to manage feedback and professional recommendations.

---

## 📩 Contact System

Visitors can contact me directly through the portfolio.

The contact system supports:

* First name
* Last name
* Email
* Company
* Country
* Phone
* Subject
* Message
* Budget
* Timeline
* Attachment metadata

Submissions are stored through the backend API and can be managed through the administrative interface.

---

## 📰 Newsletter

The portfolio includes a newsletter subscription system.

Features include:

* Email collection
* Duplicate subscription detection
* Persistent subscriber records
* Subscriber management
* Admin deletion functionality

---

## 🛠️ Admin Dashboard

A dedicated administrative interface provides management functionality for portfolio data.

The backend exposes APIs for managing:

* Portfolio content
* Projects
* Blogs
* Certifications
* Skills
* Experience
* Achievements
* Learning data
* Testimonials
* Contact messages
* Newsletter subscribers
* Analytics

> The current authentication/2FA implementation is intended as a prototype/demo mechanism and should be replaced with production-grade authentication before handling sensitive production data.

---

# 🧱 Tech Stack

## Frontend

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| React 19        | UI architecture             |
| TypeScript      | Type-safe development       |
| Vite            | Development & build tooling |
| Tailwind CSS    | Styling                     |
| Motion          | Animations & transitions    |
| Lucide React    | Interface icons             |
| Recharts        | Data visualization          |
| D3.js           | Advanced visualization      |
| React Markdown  | Markdown rendering          |
| Canvas Confetti | Interactive effects         |

## Backend

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Node.js    | Runtime                      |
| Express    | API server                   |
| TypeScript | Backend development          |
| dotenv     | Environment configuration    |
| Adm-Zip    | Project export functionality |

## Artificial Intelligence

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| Google Gemini   | AI Portfolio Representative |
| `@google/genai` | Gemini API SDK              |

## Deployment

* Vercel
* Vite production build
* Express/server API architecture
* Environment-based configuration

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      VISITOR        │
                         │ Recruiter / Client  │
                         │ Developer / Student │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │     React + TypeScript     │
                    │        Vite Frontend       │
                    └─────────────┬──────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      Portfolio Sections      AI Assistant       Interactive
      Projects / Skills       Gemini API         Dashboards
      Experience / etc.                           Analytics
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                    ┌────────────────────────────┐
                    │       Express API          │
                    │       Server Layer          │
                    └─────────────┬──────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Gemini Service       Portfolio Data      Analytics
        AI Responses         Persistence         Tracking
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                    ┌────────────────────────────┐
                    │       JSON Data Store      │
                    │       data_store.json       │
                    └────────────────────────────┘
```

---

# 📁 Project Structure

```text
Sayam-Mukherjee-Portfolio/
│
├── api/
│   └── index.ts
│
├── public/
│   └── static/public assets
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── AboutSection.tsx
│   │   ├── AIChatBot.tsx
│   │   ├── AIEngineConsole.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── BlogsSection.tsx
│   │   ├── CodingProfiles.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ContentCreatorSection.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── GitHubActivityHeatmap.tsx
│   │   ├── LanguageRingChart.tsx
│   │   ├── LearningDashboard.tsx
│   │   ├── LearningJourney.tsx
│   │   ├── Loader.tsx
│   │   ├── ProgressDashboard.tsx
│   │   ├── ProjectsShowcase.tsx
│   │   ├── ResumeModal.tsx
│   │   ├── SEO.tsx
│   │   ├── SkillsSection.tsx
│   │   └── TestimonialsSection.tsx
│   │
│   ├── context/
│   │   └── PortfolioContext.tsx
│   │
│   ├── data.ts
│   ├── App.tsx
│   └── main.tsx
│
├── assets/
│
├── cf-worker/
│
├── data_store.json
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── README.md
```

---

# ⚡ Performance

Performance was considered during the frontend architecture.

The application uses:

### Code Splitting

Heavy interactive components are lazy-loaded using React's `lazy()` and `Suspense`.

```tsx
const AIChatBot = lazy(() => import("./components/AIChatBot"));
const LearningDashboard = lazy(() => import("./components/LearningDashboard"));
const ProjectsShowcase = lazy(() => import("./components/ProjectsShowcase"));
const BlogsSection = lazy(() => import("./components/BlogsSection"));
```

This prevents every interactive module from being loaded into the initial bundle.

### Optimized Scroll Reveals

Section reveal animations use `IntersectionObserver` instead of continuous scroll-position calculations.

### Performance Modes

The application detects:

* Mobile devices
* Reduced-motion preferences

and can adjust animation behavior accordingly.

---

# 🔐 Environment Variables

The Gemini API key should **never be committed to the repository**.

Create a local environment file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The backend loads the key through:

```ts
process.env.GEMINI_API_KEY
```

For deployment, configure the variable through your hosting provider's environment-variable system.

---

# 🛠️ Local Development

## 1. Clone the repository

```bash
git clone https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio.git
```

```bash
cd Sayam-Mukherjee-Portfolio
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 4. Start the development server

```bash
npm run dev
```

The application will start on:

```text
http://localhost:3000
```

---

# 📦 Production Build

Build the frontend and backend:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 🧪 Type Checking

Run TypeScript validation with:

```bash
npm run lint
```

---

# 🔌 API Endpoints

The backend currently exposes endpoints including:

```text
GET  /api/health

GET  /api/portfolio-data
POST /api/portfolio-data/update

POST /api/contact

GET  /api/admin/messages
POST /api/admin/messages/action

POST /api/newsletter/subscribe
GET  /api/admin/subscribers
POST /api/admin/subscribers/delete

POST /api/testimonials
POST /api/admin/testimonials/action

POST /api/analytics/visit
GET  /api/admin/analytics

POST /api/admin/login

GET  /api/github-stats

POST /api/gemini/chat

GET  /api/export-project
```

---

# 🤖 AI Request Flow

The AI assistant follows this general flow:

```text
Visitor
   │
   ▼
AI Chat Interface
   │
   ▼
/api/gemini/chat
   │
   ▼
Portfolio Context + Conversation
   │
   ▼
Google Gemini
   │
   ▼
AI-generated response
   │
   ▼
Portfolio AI Assistant
```

The server-side implementation keeps the Gemini API key away from the browser.

---

# 📈 Analytics Flow

```text
Visitor
   │
   ▼
Portfolio
   │
   ▼
/api/analytics/visit
   │
   ▼
Visitor Record
   │
   ▼
Data Store
   │
   ▼
/api/admin/analytics
   │
   ▼
Aggregated Metrics
   │
   ▼
Admin Dashboard
```

---

# 🎯 Design Philosophy

The portfolio follows a few core principles:

### 01 — Show, Don't Just Tell

Instead of only listing technologies, the portfolio demonstrates them through interactive systems.

### 02 — Build as You Learn

The learning dashboard reflects an ongoing engineering journey rather than presenting development as a finished process.

### 03 — AI-Native Interaction

AI is integrated into the portfolio experience itself instead of being treated as a separate decorative feature.

### 04 — Data-Driven Presentation

Charts, activity visualizations, progress indicators, and analytics make the portfolio more measurable and interactive.

### 05 — Performance Matters

Animations and interactive elements are designed with lazy loading, IntersectionObserver-based reveals, and reduced-motion considerations.

---

# 🧠 What This Project Demonstrates

This project demonstrates practical experience with:

* React architecture
* TypeScript
* Component-driven development
* REST API design
* Express.js
* AI API integration
* Prompt/system-instruction design
* Data visualization
* State management
* Lazy loading
* Responsive UI development
* Animation systems
* SEO fundamentals
* Backend persistence
* Analytics architecture
* Form handling
* Portfolio/CMS architecture
* Deployment configuration

---

# 🗺️ Roadmap

Potential future improvements include:

* [ ] Production-grade authentication
* [ ] Secure session/JWT implementation
* [ ] Real database integration
* [ ] Live GitHub API integration
* [ ] Real email delivery for contact submissions
* [ ] Production newsletter provider
* [ ] Advanced analytics infrastructure
* [ ] Automated CI/CD pipeline
* [ ] Automated testing
* [ ] Improved accessibility auditing
* [ ] Performance monitoring
* [ ] More AI-powered portfolio interactions

---

# 🔒 Security Note

This repository is primarily a portfolio/demo project.

Before using the administrative functionality in a production environment, the following should be implemented:

* Secure authentication
* Password hashing
* Proper session management
* CSRF protection where applicable
* Rate limiting
* Input validation
* API authorization
* Secure file handling
* Production database
* Secret management
* Audit logging

**Never commit API keys, passwords, tokens, or other secrets to the repository.**

---

# 👨‍💻 About Me

I'm **Sayam Mukherjee**, a Computer Science Engineering student specializing in **Artificial Intelligence & Machine Learning**.

My interests span:

* 🤖 Artificial Intelligence & Machine Learning
* 💻 Full Stack Development
* 🧠 Data Structures & Algorithms
* 📊 Data & Financial Analysis
* 🎨 Digital Content & Visual Design
* 🚀 Product Development

My long-term goal is to build **intelligent, scalable systems that solve meaningful real-world problems.**

---

# 🌐 Connect With Me

* 💼 LinkedIn: [Sayam Mukherjee](https://www.linkedin.com/in/sayam-mukherjee-b96209324/)
* 💻 GitHub: [@codesbysayam](https://github.com/codesbysayam)
* 📸 Instagram: [@*.wrick.*](https://www.instagram.com/_.wrick._/)
* 🎥 YouTube: [Obsidian Optics](https://www.youtube.com/@ObsidianOptics_in)
* 🌐 Portfolio: [sayammukherjee.in](https://www.sayammukherjee.in)

---

# ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

It helps support the project and motivates continued development.

---

## 📜 License

This project is currently published for portfolio and educational purposes.

Please contact me before reusing substantial portions of the design, content, branding, or personal information contained within this repository.

---

<div align="center">

### Built with curiosity, code, and a lot of experimentation.

**Sayam Mukherjee**

*AI & ML Student · Full Stack Developer · Future AI Engineer*

</div>
