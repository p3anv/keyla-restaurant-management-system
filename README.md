<div align="center">
  <img src="https://img.icons8.com/color/96/000000/restaurant.png" alt="Logo" width="80" height="80" />
  <h1>🍽️ Restaurant Management System</h1>
  <h3><i>Enterprise-Grade · Real-Time · Full-Stack</i></h3>

  <p>
    <a href="https://keyla-restaurant-management-system-1.onrender.com">
      <img src="https://img.shields.io/badge/Live_Demo-🚀-brightgreen?style=for-the-badge&logo=render" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

<hr>

<h2>📖 Overview</h2>
<blockquote>
<strong>A full-fledged, real-time restaurant management platform built for speed, scale, and simplicity.</strong><br/>
From table-side ordering to kitchen displays and admin control—everything you need to run a modern restaurant.
</blockquote>

<h2>🎯 Live Demo</h2>
<p>
🔗 <a href="https://keyla-restaurant-management-system-1.onrender.com"><strong>Click Here to View the Live App</strong></a><br/>
👤 <strong>Admin Login:</strong> <code>admin@restaurant.com</code> / <code>admin123</code>
</p>

<h2>✨ Features at a Glance</h2>

<table>
<thead>
<tr>
<th>🍕 Point of Sale</th>
<th>👨‍🍳 Kitchen Display</th>
<th>🗂️ Admin Dashboard</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<ul>
<li>Dynamic menu with modifiers</li>
<li>Cart with guest count & discounts</li>
<li>Table selection & status tracking</li>
</ul>
</td>
<td>
<ul>
<li>Real-time WebSocket push</li>
<li>Course-based ticket splitting</li>
<li>Status workflow (Pending → Ready)</li>
</ul>
</td>
<td>
<ul>
<li>Full menu management</li>
<li>Inventory tracking & restock</li>
<li>Staff CRUD & role management</li>
</ul>
</td>
</tr>
</tbody>
</table>

<h3>Plus</h3>
<ul>
<li>🪑 Interactive Floor Plan – Visual grid with manual table override.</li>
<li>🔐 Enterprise Security – JWT + Refresh Tokens + RBAC.</li>
<li>🚀 End-to-End Type Safety – Shared Zod schemas across frontend & backend.</li>
</ul>

<h2>🏗️ Architecture</h2>

<table>
<thead><tr><th>Component</th><th>Path</th><th>Stack</th></tr></thead>
<tbody>
<tr><td><strong>Frontend</strong></td><td><code>apps/web</code></td><td>React 18, Vite, TypeScript, Tailwind, Zustand, React Query</td></tr>
<tr><td><strong>Backend API</strong></td><td><code>apps/api</code></td><td>Node.js, Express, Prisma, PostgreSQL, Redis, Socket.io</td></tr>
<tr><td><strong>Shared Types</strong></td><td><code>packages/shared-types</code></td><td>Zod schemas &amp; TypeScript interfaces</td></tr>
</tbody>
</table>

<h2>🚀 Deployment</h2>
<table>
<thead><tr><th>Service</th><th>Platform</th><th>URL</th></tr></thead>
<tbody>
<tr><td>Frontend</td><td>Render Static Site</td><td><a href="https://keyla-restaurant-management-system-1.onrender.com">keyla-restaurant-frontend</a></td></tr>
<tr><td>Backend</td><td>Render Web Service</td><td><a href="https://keyla-restaurant-management-system.onrender.com">keyla-restaurant-api</a></td></tr>
<tr><td>Database</td><td>Neon.tech</td><td>PostgreSQL (Serverless)</td></tr>
<tr><td>Cache</td><td>Upstash</td><td>Redis (Serverless)</td></tr>
</tbody>
</table>

<h2>🛠️ Quick Start (Local Development)</h2>
<h3>1. Prerequisites</h3>
<ul>
<li>Node.js (v20+)</li>
<li>PNPM (<code>npm install -g pnpm</code>)</li>
<li>PostgreSQL &amp; Redis (local or Docker)</li>
</ul>

<h3>2. Clone &amp; Install</h3>
<pre><code class="language-bash">git clone https://github.com/p3anv/keyla-restaurant-management-system.git
cd keyla-restaurant-management-system
pnpm install</code></pre>

<h3>3. Environment Setup</h3>
<p><strong>Backend (apps/api/.env)</strong></p>
<pre><code>DATABASE_URL="postgresql://user:pass@localhost:5432/restaurant_db"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="your-access-secret-32chars"
JWT_REFRESH_SECRET="your-refresh-secret-32chars"
FRONTEND_URL="http://localhost:5173"</code></pre>

<p><strong>Frontend (apps/web/.env)</strong></p>
<pre><code>VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"</code></pre>

<h3>4. Database Setup</h3>
<pre><code class="language-bash">cd apps/api
pnpm prisma:migrate
pnpm prisma:seed</code></pre>

<h3>5. Run the Application</h3>
<pre><code class="language-bash"># Backend
cd apps/api && pnpm dev

# Frontend
cd apps/web && pnpm dev</code></pre>

<p>Open <code>http://localhost:5173</code> 🚀</p>

<h2>🔌 API Snapshot</h2>
<table>
<thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
<tbody>
<tr><td>POST</td><td><code>/api/v1/auth/login</code></td><td>User login</td></tr>
<tr><td>GET</td><td><code>/api/v1/menu</code></td><td>Fetch full menu (cached)</td></tr>
<tr><td>POST</td><td><code>/api/v1/orders</code></td><td>Create an order (ACID transaction)</td></tr>
<tr><td>PATCH</td><td><code>/api/v1/orders/:id/status</code></td><td>Update order status</td></tr>
<tr><td>GET</td><td><code>/api/v1/tables</code></td><td>Fetch floor plan</td></tr>
<tr><td>PATCH</td><td><code>/api/v1/tables/:id</code></td><td>Update table status</td></tr>
<tr><td>GET</td><td><code>/api/v1/inventory</code></td><td>Fetch stock levels</td></tr>
</tbody>
</table>

<h2>🧪 Test the Live App Flow</h2>
<ol>
<li>Login using <code>admin@restaurant.com</code> / <code>admin123</code>.</li>
<li>Select a table, add menu items and place an order.</li>
<li>Open Kitchen in another tab to see real-time updates.</li>
<li>Manage menu, inventory and staff from Admin.</li>
</ol>

<h2>🛡️ Security &amp; Best Practices</h2>
<ul>
<li>bcryptjs password hashing</li>
<li>JWT access &amp; refresh tokens</li>
<li>CORS protection</li>
<li>Zod validation</li>
<li>Role-Based Access Control (RBAC)</li>
</ul>

<h2>📁 Project Structure</h2>
<pre><code>restaurant-management-system/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   └── shared-types/
└── package.json</code></pre>

<h2>🤝 Contributing</h2>
<p>This is a proprietary enterprise project. Suggestions and feedback are welcome via the Issues section.</p>

<h2>📄 License</h2>
<p><strong>Proprietary – All rights reserved.</strong></p>

<h2>🙌 Acknowledgments</h2>
<p>Built with ❤️ using the T3 Stack philosophy, React, Express, Prisma and Socket.io.</p>

<hr>

<div align="center">
<sub>🚀 Version 1.0.0 – Production Ready</sub>
</div>





Helloo ??
