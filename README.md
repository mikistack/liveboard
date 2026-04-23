# 🎨 LiveBoard — Real-Time Collaborative Workspace

![LiveBoard Cover](https://via.placeholder.com/1200x400/0f172a/38bdf8?text=LiveBoard+Real-Time+Collaboration)

LiveBoard is a high-performance, real-time collaborative whiteboard built for distributed teams. Experience seamless synchronization on an infinite canvas with premium drawing tools, multiplayer presence, and intelligent persistence.

## ✨ Key Features

- **🚀 Real-Time Synchronization**: Built on Socket.io and Redis for low-latency updates across unlimited clients.
- **✏️ Premium Drawing Engine**: Powered by Rough.js for a hand-drawn, professional aesthetic.
- **👥 Multiplayer Presence**: Live cursors with username labels and color-coded identification.
- **🧱 Persistent Workspaces**: Instant-save architecture using PostgreSQL and Prisma; your boards are always exactly where you left them.
- **🔐 Secure Authentication**: Multi-layered auth system featuring JWT (Access/Refresh tokens) and Google OAuth 2.0.
- **🌓 Modern Aesthetics**: Tailored dark-slate theme with glassmorphism effects and Tailwind CSS v4.
- **📸 Export High-Res**: Export your designs directly to PNG for easy sharing.
- **💎 Undo/Redo**: Full history stack for fearless creation.

## 🛠️ Tech Stack

**Front-End:**
- React 19 + Vite 6
- Tailwind CSS v4 (Alpha/Beta optimizations)
- Framer Motion (Micro-interactions)
- Zustand (State Management)
- Socket.io Client

**Back-End:**
- Node.js + Express 5
- Socket.io (Real-time engine)
- Prisma (ORM)
- PostgreSQL (Primary DB)
- Redis (Socket Adapter & Caching)

## 🚦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### Installation

1. **Clone and Install:**
   ```bash
   git clone https://github.com/mikistack/liveboard.git
   cd liveboard
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the `server/` directory based on `.env.example`.

3. **Infrastructure:**
   ```bash
   docker-compose up -d
   ```

4. **Run the App:**
   ```bash
   # Terminal 1 (Backend)
   cd server && npm run dev
   
   # Terminal 2 (Frontend)
   cd client && npm run dev
   ```

## 📈 14-Day Development Sprint

This project was built during a rigorous 14-day development sprint, logging daily features and architectural milestones. Check the commit history to see the progression from infrastructure day to final polish.

## 📄 License
MIT License — see the [LICENSE](LICENSE) file for details.