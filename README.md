<p align="center"><em>"Most developers build portfolios to show how they lived.<br>This one counts the seconds — as if the developer wrote his own death note, with his own hand, and published it for the world to watch."</em></p>

---

# Portfolio — Not a Website. A Web Application.

> Anyone can build a portfolio website. But what if your portfolio was a **full-stack web application** — one that you manage through an admin panel, powered by a real database, with authentication, image hosting, and dynamic content — all without paying a single cent for infrastructure?

That's exactly what this project is.

## 💡 Why a Web App Instead of a Website?

Most developers showcase their work with a static portfolio site — a few hard-coded pages, maybe some HTML & CSS, hosted on GitHub Pages. It works. But it says nothing about your ability to build **real software**.

This portfolio is different:

- **It's a full-stack application.** Server-side rendering, API routes, authentication, data fetching — the same patterns you'd use in production software.
- **Content is fully dynamic.** Projects, profile info, skills, daily notes — everything is fetched at runtime from a database. Zero hard-coded content.
- **It has an admin panel.** A secure, authenticated dashboard where you manage all your content — no code changes, no redeployments needed.
- **It uses Google Sheets as a free database.** Yes, you read that right. Google Sheets API provides a free, familiar, spreadsheet-based backend — no Postgres, no MongoDB, no hosting costs. Just a Google account.

Your portfolio should demonstrate that you can **build things**, not just style them.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js 16                    │
│              (App Router + React 19)            │
├──────────────────┬──────────────────────────────┤
│   Public Pages   │       Admin Panel            │
│  (SSR + ISR)     │   (Client-side, JWT Auth)    │
├──────────────────┴──────────────────────────────┤
│                  API Routes                     │
│   /api/projects  /api/profile  /api/daily-notes │
│   /api/auth/*    /api/footprints                │
├─────────────────────────────────────────────────┤
│              Google Sheets API                  │
│          (Free Database — $0/month)             │
├─────────────────────────────────────────────────┤
│    Cloudinary (Image Hosting & Optimization)    │
└─────────────────────────────────────────────────┘
```

## ✨ Features

| Feature | Description |
|---|---|
| **Admin Dashboard** | Manage projects, profile, daily notes — all from a sleek, authenticated UI |
| **Google Sheets CMS** | Your spreadsheet *is* your database. Free, familiar, and surprisingly powerful |
| **JWT Authentication** | Secure login with access + refresh tokens, device tracking, and token revocation |
| **Daily Notes** | A micro-blog system — post notes from admin, displayed on the About page |
| **Survival Counter** | Interactive hero that calculates how long you (and your visitors) have survived |
| **Footprint Canvas** | Visitors leave their mark — an interactive constellation of site visitors |
| **Image Optimization** | All images hosted via Cloudinary with automatic format/quality optimization |
| **ISR + Caching** | Pages revalidate every 60s — fresh content without sacrificing performance |
| **Framer Motion** | Smooth, physics-based animations throughout the entire experience |
| **Fully Responsive** | Designed for every screen — mobile, tablet, and desktop |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Google Sheets API](https://developers.google.com/sheets/api) — free tier |
| **Image Hosting** | [Cloudinary](https://cloudinary.com/) — free tier |
| **Auth** | `jose` (JWT) + `bcryptjs` |

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- A Google Cloud project with Sheets API enabled
- A Google Service Account with a private key
- A Cloudinary account (free tier is enough)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/pasindusampath/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Create .env.local with your credentials
cp .env.example .env.local   # then fill in the values below
```

#### Environment Variables

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-spreadsheet-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Authentication
JWT_SECRET=a-long-random-secret-string
```

#### Initialize the Database

Create a new Google Spreadsheet, share it with your service account email (Editor access), then run:

```bash
npm run setup:sheets
```

This creates all required sheets (`Projects`, `Profile`, `Skills`, `Users`, `DailyNotes`, etc.) with proper headers and seeds an initial admin user.

#### Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your portfolio is live.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — log in to manage content.

## 📂 Project Structure

```
├── app/
│   ├── (public)/          # Public-facing pages (Home, About, Projects, Contact)
│   ├── admin/             # Admin dashboard (client-side, auth-protected)
│   └── api/               # API routes (projects, profile, daily-notes, auth)
├── components/            # Reusable UI components
├── lib/                   # Core utilities
│   ├── google-sheets.ts   # All Google Sheets read/write operations
│   ├── auth.ts            # JWT signing, verification, password hashing
│   └── cloudinary.ts      # Image upload helper
├── scripts/
│   ├── setup-sheets.ts    # Database initialization & seeding script
│   └── generate-password.ts  # Admin password hash generator
└── types/                 # TypeScript interfaces
```

## 🔐 Admin Panel

The admin panel at `/admin` provides:

- **Projects** — Add, view, and manage portfolio projects with image uploads
- **Daily Notes** — Post quick notes that appear on the About page
- **Settings** — Update your profile info, bio, avatar, and social links

All changes are instantly reflected on the public site (within the 60s revalidation window).

## 💸 Cost

**$0/month.** Seriously.

| Service | Cost |
|---|---|
| Google Sheets API | Free |
| Cloudinary | Free tier (25 credits/month) |
| Vercel Hosting | Free tier |
| **Total** | **$0** |

## 📄 License

This project is licensed under the MIT License.

---

*Built by [Pasindu Sampath](https://github.com/pasindusampath) — because a portfolio should prove you can build software, not just design pages.*

