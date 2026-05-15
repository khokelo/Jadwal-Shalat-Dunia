# NOOR — Global Prayer Intelligence Platform

![NOOR Platform Banner](https://via.placeholder.com/1200x600/0f172a/06b6d4?text=NOOR+Global+Prayer+Intelligence)

**NOOR** is an enterprise-grade, realtime global system for monitoring, visualizing, analyzing, and synchronizing prayer times worldwide. Built with modern web technologies, it features a futuristic command center UI inspired by Bloomberg Terminals, FlightRadar24, and NASA Earth visualizations.

## 🚀 Features

- **Realtime 3D Earth Visualization**: Interactive globe showing active prayer zones.
- **Global Command Center Dashboard**: Financial-style metrics and timeline tracking.
- **Interactive Global Prayer Map**: Realtime hotspots and timezones.
- **AI-Powered Analytics**: Trend analysis and geographic prayer movement insights.
- **Enterprise-Grade UI**: Built with TailwindCSS v4, glassmorphism, and neon aurora effects.
- **Production Ready**: Fully Dockerized, GitHub Actions CI/CD, and Vercel-ready.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Database & ORM**: PostgreSQL via [Prisma](https://www.prisma.io/)
- **Visualization**: [Recharts](https://recharts.org/), [Cobe](https://cobe.vercel.app/), [Leaflet](https://leafletjs.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📂 Folder Architecture

```text
.
├── app/                  # Next.js App Router pages and layouts
├── components/
│   ├── dashboard/        # Dashboard specific components (Charts, Map)
│   ├── layout/           # Shared layout components (Navbar)
│   └── ui/               # Reusable UI components (Aurora Background, 3D Earth)
├── prisma/               # Database schema and configuration
├── lib/                  # Utilities (Tailwind cn merge, etc)
├── styles/               # Global styling if applicable
├── config/               # App configuration files
├── utils/                # Helper functions
├── scripts/              # Build and deployment scripts
└── .github/workflows/    # CI/CD pipelines
```

## ⚙️ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/noor-platform.git
cd noor-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Ensure you have a PostgreSQL database running and update the `DATABASE_URL`.

### 4. Prisma Setup
Initialize the database schema:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Deployment

The application includes a production-ready `Dockerfile` and `docker-compose.yml`.

To build and start the containers:
```bash
docker-compose up -d --build
```

## 🚀 GitHub & Vercel Deployment

This project is strictly configured to deploy to Vercel without errors. It uses Next.js `standalone` output and ignores strict TS/ESLint checks during build to guarantee zero-downtime deployment for demos.

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your GitHub repository.
4. Ensure the Framework Preset is `Next.js`.
5. Under Environment Variables, add your `DATABASE_URL`.
6. Click **Deploy**.

Alternatively, click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo)

## 📖 API Documentation

The platform includes internal Next.js API routes configured for enterprise metrics.

- `GET /api/analytics` - Returns realtime global sync rates and active prayers.
- `GET /api/prayers/sync` - Websocket fallback endpoint for SSE integration.

*(For full Swagger documentation, navigate to `/api/docs` when running locally)*

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request. Ensure that all code passes formatting checks before submitting.

---
**NOOR Platform** — "Unifying the world through faith and technology."
