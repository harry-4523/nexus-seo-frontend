# ⚡ NEXUS — AI SEO & AEO Intelligence Platform


A production-grade, real-browser-powered website intelligence platform that analyzes **SEO**, **AEO (Answer Engine Optimization)**, **Geographic Engagement**, and **Technical Health** of any URL — with a world-class 3D UI built with React, Three.js, GSAP, and Node.js.

---

## 🎯 Project Overview

NEXUS is not a mock tool. It uses **Puppeteer (headless Chromium)** to actually navigate to the target URL, scrapes real content, and runs deep analysis across four dimensions:

| Dimension | What It Analyzes |
|---|---|
| **SEO** | Title, meta, headings, keywords, links, images, schema, OG tags, canonical, readability |
| **AEO** | Structured data, FAQ schema, voice search readiness, featured snippet potential, E-A-T signals |
| **Geo** | Hreflang, HTML lang, CDN detection, currency/phone signals, regional traffic estimates |
| **Technical** | Core Web Vitals (LCP/FID/CLS), SSL, mobile viewport, security headers, compression, crawlability |

---

## 🏗️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite + TypeScript | UI framework |
| Three.js + @react-three/fiber | 3D hero scene (sphere, orbit rings, particles) |
| GSAP + ScrollTrigger | Page animations, counter animations, scroll effects |
| Tailwind CSS | Utility-first styling |
| Recharts | Bar charts, radar charts |
| Zustand | Global state management |
| React Router v6 | Client-side routing |
| Axios | API calls |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express + TypeScript | REST API server |
| Puppeteer | Real headless browser scraping |
| Cheerio | HTML parsing & DOM traversal |
| Natural (NLP) | TF-IDF keyword extraction, tokenization |
| PostgreSQL + Prisma ORM | Database & type-safe queries |
| JWT + bcryptjs | Authentication |
| Zod | Runtime validation |
| Winston | Logging |
| Helmet + Rate Limiting | Security |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (running locally or remote)
- Git

---

### Step 1 — Clone & Open in VS Code

```bash
cd nexus-seo
code .
```

---

### Step 2 — Backend Setup

```bash
cd backend

# 1. Install dependencies (Puppeteer downloads Chromium automatically ~170MB)
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env — set your PostgreSQL connection string:
#    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/nexus_seo"
#    JWT_SECRET=any_random_32_char_string_here

# 4. Create the database (in psql or pgAdmin):
#    CREATE DATABASE nexus_seo;

# 5. Run Prisma migrations (creates all tables)
npm run db:migrate

# 6. Generate Prisma client
npm run db:generate

# 7. Start development server
npm run dev
# → API running at http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
# In a NEW terminal tab
cd frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → UI running at http://localhost:5173
```

---

### Step 4 — Test It

1. Open **http://localhost:5173**
2. Enter any URL (e.g. `https://github.com`)
3. Click **Analyze** — watch the real scraping happen
4. Explore SEO, AEO, Geo, and Technical tabs

---

## 📁 Project Structure

```
nexus-seo/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express server entry point
│   │   ├── routes/
│   │   │   ├── analysis.routes.ts      # /api/analysis/* routes
│   │   │   └── auth.routes.ts          # /api/auth/* routes
│   │   ├── controllers/
│   │   │   ├── analysis.controller.ts  # Orchestrates full scan pipeline
│   │   │   └── auth.controller.ts      # Register / Login / Me
│   │   ├── services/
│   │   │   ├── scraper.service.ts      # Puppeteer browser scraping
│   │   │   ├── seo.analyzer.ts         # SEO scoring engine
│   │   │   ├── aeo.analyzer.ts         # AEO & structured data analysis
│   │   │   ├── geo.analyzer.ts         # Geographic signals & traffic estimates
│   │   │   └── technical.analyzer.ts   # Core Web Vitals & security checks
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts      # JWT guard & optional auth
│   │   └── types/
│   │       └── index.ts                # All shared TypeScript interfaces
│   ├── prisma/
│   │   └── schema.prisma               # Database schema
│   ├── .env.example                    # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx             # Hero page (Three.js + GSAP + 3D)
│   │   │   ├── Analyze.tsx             # URL input + live progress stages
│   │   │   ├── Results.tsx             # Full analysis dashboard with tabs
│   │   │   ├── History.tsx             # Saved scans list
│   │   │   └── Auth.tsx                # Login / Register
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Glassmorphism sticky nav
│   │   │   ├── Hero3D.tsx              # Three.js canvas (sphere + rings + stars)
│   │   │   ├── ScoreGauge.tsx          # Animated SVG score rings
│   │   │   ├── SEOPanel.tsx            # SEO tab content
│   │   │   ├── AEOPanel.tsx            # AEO tab content
│   │   │   ├── GeoPanel.tsx            # Geo tab + Recharts bar chart
│   │   │   └── TechnicalPanel.tsx      # Tech tab + Radar chart
│   │   ├── store/
│   │   │   └── analysis.store.ts       # Zustand global state
│   │   ├── api/
│   │   │   └── client.ts               # Axios API client
│   │   ├── types/
│   │   │   └── analysis.types.ts       # All frontend TypeScript types
│   │   ├── App.tsx                     # Router + layout
│   │   ├── main.tsx                    # React entry point
│   │   └── index.css                   # Tailwind + custom CSS (glassmorphism, glows, etc.)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--void` | `#030014` | Main background |
| `--cosmos` | `#0d0b21` | Card backgrounds |
| `--violet` | `#7c3aed` | Primary accent |
| `--violet-light` | `#a78bfa` | Secondary text accent |
| `--cyan` | `#06b6d4` | Secondary accent |
| `--pink` | `#ec4899` | Highlight accent |
| `--emerald` | `#10b981` | Success / good scores |
| `--solar` | `#f59e0b` | Warning / medium scores |
| `--nova` | `#ef4444` | Error / poor scores |

### UI Effects Used
- **Glassmorphism** — `backdrop-filter: blur(20px)` with violet-tinted backgrounds
- **Gradient text** — animated CSS gradient via `background-clip: text`
- **Glow effects** — layered `box-shadow` with color-matched rgba values
- **GSAP timeline** — staggered reveals on landing page load
- **GSAP ScrollTrigger** — feature cards animate in on scroll
- **Three.js scene** — distorted sphere, orbit rings, star field, particles
- **SVG score rings** — GSAP-animated `strokeDashoffset` with counter
- **Radar chart** — Recharts `RadarChart` for technical scoring
- **Bar chart** — Recharts `BarChart` for geo traffic distribution

---

## 📊 Scoring System

```
Overall Score = SEO(35%) + AEO(25%) + Technical(25%) + Geo(15%)
```

Each dimension scores 0–100 based on weighted sub-factors.

### SEO Score Factors
| Factor | Weight |
|---|---|
| Title tag quality | 15% |
| Meta description | 15% |
| Heading structure | 15% |
| Image alt text | 10% |
| Internal/external links | 10% |
| Open Graph tags | 10% |
| Schema.org markup | 10% |
| Twitter Card | 5% |
| Canonical tag | 5% |
| Robots meta | 5% |

### AEO Score Factors
| Factor | Weight |
|---|---|
| JSON-LD structured data | 30% |
| FAQ content & schema | 20% |
| Voice search readiness | 20% |
| Featured snippet potential | 20% |
| E-A-T signals | 10% |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analysis/analyze` | Optional | Start a full URL scan |
| `GET` | `/api/analysis/scan/:id` | None | Fetch a scan result |
| `GET` | `/api/analysis/history` | Required | User's scan history |
| `DELETE` | `/api/analysis/scan/:id` | Required | Delete a scan |
| `POST` | `/api/auth/register` | None | Create account |
| `POST` | `/api/auth/login` | None | Get JWT token |
| `GET` | `/api/auth/me` | Required | Get current user |

---

## 🌟 Key Features (For Viva)

1. **Real Puppeteer scraping** — not mock data; actual headless Chrome visits the URL
2. **50+ on-page SEO checks** — comprehensive coverage of every ranking factor
3. **AEO dimension** — cutting-edge analysis for AI answer engines (ChatGPT, Gemini, Perplexity)
4. **Geographic traffic modeling** — hreflang, CDN, TLD, currency signal detection
5. **Core Web Vitals simulation** — LCP, FID, CLS derived from real scrape data
6. **JWT authentication** — full user system with scan history
7. **3D interactive hero** — Three.js sphere with physics-based distortion and orbit rings
8. **GSAP animations** — staggered text reveals, scroll-triggered cards, counter animations
9. **Radar chart + bar charts** — Recharts data visualization
10. **Rate limiting + Helmet security** — production-grade API protection
11. **PostgreSQL + Prisma** — type-safe relational database with migrations
12. **Glassmorphism UI** — consistent design system with gradient text, glow effects, backdrop blur

---

## 🚫 Troubleshooting

### Puppeteer install fails
```bash
# On Linux, install Chromium dependencies:
sudo apt-get install -y libgbm-dev libxkbcommon-dev libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
```

### PostgreSQL connection fails
```bash
# Check PostgreSQL is running:
sudo service postgresql status
# or on Mac:
brew services list | grep postgresql
```

### Port conflict
Change `PORT=5000` in `.env` and update the proxy in `frontend/vite.config.ts`.

---

## 🎓 Academic Notes

This project demonstrates:
- **Full-stack architecture** with clear separation of concerns
- **Real web scraping** with rate limiting and error handling
- **NLP techniques** (tokenization, TF-IDF, stop-word filtering) for keyword extraction
- **Database design** with relational models and Prisma migrations
- **RESTful API design** with validation, auth, and error handling
- **Modern React patterns** — hooks, Zustand state, code splitting by route
- **3D graphics programming** with Three.js and WebGL
- **Animation engineering** with GSAP timelines and ScrollTrigger
- **Security best practices** — JWT, bcrypt, helmet, CORS, rate limiting
