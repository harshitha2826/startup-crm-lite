# Startup CRM Lite

![Startup CRM Lite Logo](file:///C:/Users/harshitha/.gemini/antigravity-ide/brain/69c238ce-e354-41a1-81c2-4893eb9aaf92/startup_crm_logo_1784728521272.png)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Performance & Scaling](#performance--scaling)
- [Security Considerations](#security-considerations)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Accessibility (a11y)](#accessibility-a11y)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview
Startup CRM Lite is a lightweight, production‑grade Customer Relationship Management (CRM) web application built with a **MERN** (MongoDB, Express, React, Node) stack and **Vite** as the frontend bundler. It provides lead management, status tracking, analytics dashboards, and role‑based access control for small‑to‑medium teams.

## Features
- **Lead Management** – Create, read, update, delete (CRUD) leads with rich metadata (status, source, notes).
- **Status Workflow** – Drag‑and‑drop or API‑driven status updates with real‑time aggregation.
- **Analytics & Reporting** – Summary and monthly statistics, conversion rates, and source breakdown.
- **Search & Autocomplete** – Debounced search bar with server‑side filtering.
- **Authentication & Authorization** – JWT‑based auth, role‑based permissions (admin/user).
- **Responsive UI** – Glass‑morphism, dark mode, and premium design system using a curated brand palette.
- **RESTful API** – Fully documented endpoints with validation via `express‑validator`.
- **Docker Ready** – Optional Dockerfile and `docker‑compose.yml` for containerised deployment.

## Architecture Diagram
![Architecture Diagram](https://raw.githubusercontent.com/harshitha2826/startup-crm-lite/main/docs/architecture.png)
*The diagram is stored in `docs/architecture.png`. It illustrates the separation of concerns between the frontend (React/Vite), backend (Express), and the MongoDB database.*

## Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | **React 18** + **Vite** | Fast HMR, lightweight bundling |
| Styling | **Vanilla CSS** with custom brand variables (no Tailwind) | Full design control, premium look |
| State Management | **React Context API** | Simplicity for this scale |
| Backend | **Node.js 20** + **Express 5** | Minimalistic API server |
| Database | **MongoDB Atlas** | Managed, scalable NoSQL |
| Auth | **JWT** (`jsonwebtoken`) | Stateless token authentication |
| Validation | **express‑validator** | Declarative request validation |
| Linting/Formatting | **ESLint** + **Prettier** | Consistent code style |
| Testing | **Jest** (future) | Unit & integration tests |
| CI/CD | **GitHub Actions** (template) | Automated builds & deployments |

## Folder Structure
```
startup-crm-lite/
├─ .env                 # Development environment variables
├─ .env.production      # Production environment variables (included in repo for reference)
├─ backend/             # Express API
│   ├─ configdatabase.js   # DB connection helper
│   ├─ server.js           # Entry point, middleware registration
│   ├─ middleware/         # auth, error handling, validation
│   ├─ models/             # Mongoose schemas (User, Lead)
│   ├─ controllers/        # Business logic for auth & leads
│   └─ routes/             # Express route definitions
├─ src/                 # React application
│   ├─ assets/            # Images, icons
│   ├─ components/        # Reusable UI components (Layout, StatusBadge, etc.)
│   ├─ constants/         # Colour tokens, API endpoints
│   ├─ context/           # React context providers (Auth, Leads)
│   ├─ data/              # Mock data / static JSON
│   ├─ hooks/             # Custom React hooks
│   ├─ pages/             # Page components (Dashboard, Leads, Login)
│   ├─ routes/            # React Router definitions
│   ├─ services/          # API service wrappers (axios)
│   ├─ utils/             # Helper utilities
│   ├─ App.jsx            # Root component
│   ├─ index.css          # Global CSS with brand theme variables
│   └─ main.jsx           # Vite entry point
├─ public/               # Static assets served by Vite
├─ docs/                 # Documentation assets (architecture diagram, UI mockups)
├─ package.json          # Project metadata & scripts
└─ vite.config.js       # Vite configuration
```

## Setup & Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitha2826/startup-crm-lite.git
   cd startup-crm-lite
   ```
2. **Install dependencies** (both frontend and backend share the same `node_modules` folder)
   ```bash
   npm ci
   ```
3. **Create environment files**
   - Copy the example files:
     ```bash
     cp .env.example .env
     cp backend/.env.example backend/.env
     ```
   - Edit `.env` and `backend/.env` with your MongoDB connection string and JWT secret.
4. **Run the development servers** (frontend & backend concurrently)
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

## Environment Configuration
- **`.env`** (project root) – Vite‑specific variables such as `VITE_API_URL`.
- **`backend/.env`** – Server‑side variables:
  ```
  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/crm?retryWrites=true&w=majority
  JWT_SECRET=your_very_secret_key
  PORT=5000
  ```
- **`.env.production`** – Example production values (do not commit real secrets).

## Running the Application
- **Development** – `npm run dev` (starts both Vite dev server and Express with `nodemon`).
- **Production Build** –
  ```bash
  npm run build        # Builds the React app into /dist
  npm start            # Starts the Express server serving static files
  ```
- **Docker (optional)** – See `Dockerfile` and `docker-compose.yml` for containerised deployment.

## Testing
> *Testing is planned for the next sprint. The repository includes a Jest configuration placeholder.*
- To run existing tests (if any): `npm test`
- Future tests will cover:
  - Unit tests for utility functions and React components.
  - Integration tests for API endpoints using Supertest.
  - End‑to‑end tests with Playwright.

## API Documentation
The API follows REST conventions under the `/api` namespace.
### Authentication
- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Return a JWT token.
### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads` | List leads (supports pagination, filters) |
| `POST` | `/api/leads` | Create a lead |
| `GET` | `/api/leads/:id` | Get a single lead |
| `PUT` | `/api/leads/:id` | Update lead fields |
| `PATCH` | `/api/leads/:id/status` | Update only the status |
| `DELETE` | `/api/leads/:id` | Soft‑delete a lead |
| `GET` | `/api/leads/stats/summary` | Aggregated summary stats |
| `GET` | `/api/leads/stats/monthly` | Monthly lead counts |
| `GET` | `/api/leads/search?q=…` | Autocomplete search |
All protected routes require an `Authorization: Bearer <token>` header.
Full OpenAPI spec is available at `docs/openapi.yaml` (future work).

## Deployment Guide
1. **Provision a MongoDB Atlas cluster** and obtain the connection URI.
2. **Set environment variables** on the host (e.g., using a `.env.production` file or CI secret store).
3. **Build the frontend**:
   ```bash
   npm run build
   ```
4. **Start the backend** (Node) on a process manager such as `pm2` or via a Docker container.
5. **Configure a reverse proxy** (NGINX) to route `/:frontend` to the static assets and `/api` to the Express server.
6. **Enable HTTPS** – use Let’s Encrypt certificates.
7. **Health checks** – expose `/api/health` for Kubernetes readiness probes.

### Docker Example
```Dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY package*.json ./
RUN npm ci --production
EXPOSE 5000
CMD ["node", "backend/server.js"]
```
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - backend/.env
```

## Performance & Scaling
- **Indexing** – MongoDB indexes on `email` (User) and `status`/`createdAt` (Lead) for fast queries.
- **Pagination** – API uses limit/skip; consider cursor‑based pagination for large datasets.
- **Caching** – Future addition of Redis for session storage and frequent read‑through caches.
- **Horizontal Scaling** – Stateless Express server allows easy scaling behind a load balancer.

## Security Considerations
- **Input Validation** – All request payloads validated with `express-validator`.
- **Rate Limiting** – Implemented via `express-rate-limit` (default 100 requests per 15 min).
- **Helmet** – Secures HTTP headers.
- **MongoDB Sanitization** – Prevents query injection attacks.
- **JWT Expiration** – Tokens expire after 7 days; refresh token flow planned.
- **CORS** – Configured to allow only trusted origins.

## Internationalisation (i18n)
The UI currently ships in English. The architecture supports adding `react-i18next` for future multilingual support.

## Accessibility (a11y)
- Semantic HTML elements used throughout.
- Keyboard navigation tested for major components.
- Color contrast meets WCAG AA standards with the new brand palette.

## Monitoring & Logging
- **Morgan** – HTTP request logging.
- **Winston (future)** – Centralised log management with file and console transports.
- **Health Endpoint** – `/api/health` returns `{ status: "ok" }`.
- **Prometheus Exporter (future)** – Metrics for request latency, error rates.

## Troubleshooting
| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| `401 Unauthorized` on API calls | Missing/invalid JWT | Ensure `Authorization: Bearer <token>` header is set; re‑login if token expired. |
| Frontend fails to load data | `VITE_API_URL` not set correctly | Verify `.env` contains correct API base URL. |
| MongoDB connection error | Wrong URI or network issue | Check `MONGODB_URI` in `backend/.env` and ensure IP whitelisting. |
| Build fails (`npm run build`) | Missing environment variable | Provide required vars (`VITE_API_URL`) before building. |

## FAQ
**Q:** *Can I use a different database?*  
**A:** Yes, replace Mongoose models with an ORM of your choice and adjust `configdatabase.js`.

**Q:** *How to add new lead status values?*  
**A:** Update `VALID_STATUSES` in `routes/leadRoutes.js` and adjust the UI components that render status chips.

**Q:** *Is Docker mandatory?*  
**A:** No, but it simplifies deployment and ensures environment parity.

## Contributing
We welcome community contributions!
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Follow the coding style – run `npm run lint` before committing.
4. Write tests for new functionality.
5. Submit a Pull Request with a clear description.

Please read `CONTRIBUTING.md` for detailed guidelines.

## Roadmap
- **v2.0** – Real‑time updates via WebSockets, advanced analytics dashboards.
- **v2.1** – Role‑based permission matrix, multi‑tenant support.
- **v3.0** – Full TypeScript migration, CI/CD pipelines, automated e2e tests.

## License
This project is licensed under the **MIT License** – see `LICENSE` for details.

## Acknowledgements
- **Vite** – Lightning‑fast dev server.
- **MongoDB Atlas** – Free tier for rapid prototyping.
- **Open-source community** – Thanks to the contributors of all npm packages used.

---
*Generated by Antigravity AI on 2026‑07‑20.*
