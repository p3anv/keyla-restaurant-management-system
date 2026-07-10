<div align="center">
  <img src="https://img.icons8.com/color/96/000000/restaurant.png" alt="Logo" width="80" height="80" />
  <h1>🍽️ Restaurant Management System</h1>
  <h3><i>Enterprise-Grade · Real-Time · Full-Stack</i></h3>
  
  <a href="https://keyla-restaurant-management-system-1.onrender.com">
    <img src="https://img.shields.io/badge/Live_Demo-🚀-brightgreen?style=for-the-badge&logo=render" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License" />
  
  <br />
  
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
</div>

---

## 📖 Overview

> **A full-fledged, real-time restaurant management platform built for speed, scale, and simplicity.**  
> From table-side ordering to kitchen displays and admin control—everything you need to run a modern restaurant.

### 🎯 Live Demo

🔗 **[Click Here to View the Live App](https://keyla-restaurant-management-system-1.onrender.com)**  
👤 **Admin Login**: `admin@restaurant.com` / `admin123`

---

## ✨ Features at a Glance

| 🍕 **Point of Sale** | 👨‍🍳 **Kitchen Display** | 🗂️ **Admin Dashboard** |
| :--- | :--- | :--- |
| ✅ Dynamic menu with modifiers | ✅ Real‑time WebSocket push | ✅ Full menu management |
| ✅ Cart with guest count & discounts | ✅ Course‑based ticket splitting | ✅ Inventory tracking & restock |
| ✅ Table selection & status tracking | ✅ Status workflow (Pending → Ready) | ✅ Staff (CRUD) & role management |

### Plus:
- 🪑 **Interactive Floor Plan** – Visual grid with manual table override.
- 🔐 **Enterprise Security** – JWT + Refresh Tokens + RBAC.
- 🚀 **End-to-End Type Safety** – Shared Zod schemas across frontend & backend.

---

## 🏗️ Architecture

This project is a **Turborepo monorepo** with strict separation of concerns.

| Component | Path | Stack |
| :--- | :--- | :--- |
| **Frontend** | `apps/web` | React 18, Vite, TypeScript, Tailwind, Zustand, React Query |
| **Backend API** | `apps/api` | Node.js, Express, Prisma, PostgreSQL, Redis, Socket.io |
| **Shared Types** | `packages/shared-types` | Zod schemas & TypeScript interfaces |

---

## 🚀 Deployment

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Render Static Site | [keyla-restaurant-frontend](https://keyla-restaurant-management-system-1.onrender.com) |
| **Backend** | Render Web Service | [keyla-restaurant-api](https://keyla-restaurant-management-system.onrender.com) |
| **Database** | Neon.tech | PostgreSQL (Serverless) |
| **Cache** | Upstash | Redis (Serverless) |

---

## 🛠️ Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v20+)
- PNPM (`npm install -g pnpm`)
- PostgreSQL & Redis (local or via Docker)

### 2. Clone & Install

```bash
git clone https://github.com/p3anv/keyla-restaurant-management-system.git
cd keyla-restaurant-management-system
pnpm install


3. Environment Setup

Backend (.env in apps/api/):
env

DATABASE_URL="postgresql://user:pass@localhost:5432/restaurant_db"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="your-access-secret-32chars"
JWT_REFRESH_SECRET="your-refresh-secret-32chars"
FRONTEND_URL="http://localhost:5173"

Frontend (.env in apps/web/):
env

VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"

4. Database Setup
bash

cd apps/api
pnpm prisma:migrate   # Run migrations
pnpm prisma:seed      # Seed admin & sample data

5. Run the Application
bash

# Terminal 1 – Backend
cd apps/api && pnpm dev

# Terminal 2 – Frontend
cd apps/web && pnpm dev

Open http://localhost:5173 🚀
🔌 API Snapshot (Core Endpoints)
Method	Endpoint	Description
POST	/api/v1/auth/login	User login
GET	/api/v1/menu	Fetch full menu (cached)
POST	/api/v1/orders	Create an order (ACID transaction)
PATCH	/api/v1/orders/:id/status	Update order status (Kitchen)
GET	/api/v1/tables	Fetch floor plan
PATCH	/api/v1/tables/:id	Update table status
GET	/api/v1/inventory	Fetch stock levels
🧪 Test the Live App Flow

    Login → admin@restaurant.com / admin123

    POS → Select a table → Add items → Place order

    Kitchen → Open in new tab → Order appears in real‑time

    Admin → Manage menu items, stock, and staff

🛡️ Security & Best Practices

    ✅ Passwords hashed with bcryptjs

    ✅ JWT short‑lived access tokens (15 min) + refresh tokens (7 days)

    ✅ CORS restricted to frontend origin

    ✅ Zod validation on all incoming payloads

    ✅ Role‑Based Access Control (RBAC) on every route

📁 Project Structure (Quick View)
text

restaurant-management-system/
├── apps/
│   ├── api/                # Backend (Express + Prisma)
│   │   ├── prisma/         # Schema & migrations
│   │   └── src/modules/    # Features (auth, orders, menu, etc.)
│   └── web/                # Frontend (React + Vite)
│       ├── src/features/   # Slices (pos, kitchen, admin)
│       └── src/stores/     # Zustand state
├── packages/
│   └── shared-types/       # Zod schemas & TS types
└── package.json            # Turborepo root

🤝 Contributing

This is a proprietary enterprise project. For internal use only.
Suggestions and feedback are welcome via the issues tracker.
📄 License

Proprietary – All rights reserved.
Built for enterprise deployment & educational demonstration.
🙌 Acknowledgments

Built with ❤️ using the T3 Stack philosophy (TypeScript, Tailwind, Prisma) plus React, Express, and Socket.io for real-time magic.
<div align="center"> <sub>🚀 Version 1.0.0 – Production Ready</sub> </div> ``
