# Eurosia Defender X Server Core: Enterprise Decentralized Backend

A production-grade, enterprise-ready, layered backend microservice architecture meticulously crafted using **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. Equipped with dual Access/Refresh token handling, secure Role-Based Access Control (RBAC), security middlewares, metadata/SEO parameters editors, automated sitemap generators, and isolated audit ledger trails.

---

## 🏗️ Architecture Design Patterns

This backend project implements the industry-recognized **Layered Architectural Pattern** (Controller-Service-Repository), ensuring high separation of concerns, easy testing, and stellar scalability:

1.  **Entry point / App configuration** (`app.js`, `server.js`): Sets up Helmet, CORS access policies, JSON parsing, Morgan logging, and global uncaught exception routers.
2.  **Routing Layer** (`src/routes/*`): Segregates and maps HTTP verbs and sub-paths to appropriate middlewares and structural controller actions.
3.  **Middlewares** (`src/middlewares/*`): Secure request validation filters handling authentication token matching, payload sanity filters, and custom RBAC checks.
4.  **Controllers** (`src/controllers/*`): Translates requests parameters and invokes data mutations, returning standardized JSON protocols.
5.  **ORM / Database client** (`src/config/db.js`): Pre-instantiated PrismaClient pooling PostgreSQL transactions securely.

---

## 🗄️ Database Schemas & Prisma Models

We define the complete network relations schema inside `prisma/schema.prisma` consisting of **20 unified entities**:

1.  **User**: Core operator registration ledger.
2.  **Role**: Operator classification tags (`admin`, `analyst`, `readonly`).
3.  **Permission**: Granular feature flags.
4.  **UserRole**: Junction model supporting standard user-role mappings.
5.  **Session**: Active token session logs.
6.  **RefreshToken**: Secure crypto refresh recycles.
7.  **PasswordResetToken**: Forgotten passcode overrides.
8.  **EmailVerificationToken**: Signup compliance validators.
9.  **Profile**: Extensible personal demographic data.
10. **ContactMessage**: Client contact/support queries.
11. **Notification**: Incident alarm center items.
12. **ActivityLog**: Operator contextual modifications.
13. **AuditLog**: Decoupled, immutable compliance transaction records.
14. **AdminSetting**: Console setting profiles.
15. **SEOSetting**: Main meta Crawler and index configurations indices.
16. **PageSEO**: Individual URL search indexing rules.
17. **Redirect**: 301/302 crawler redirect routes.
18. **SitemapUrl**: Dynamic sitemap links.
19. **FileUpload**: Digital assets tracking.
20. **SystemLog**: Centralized perimeter event database logs.

---

## 🚀 Deployment and Setup

### Local Setup
1. Enter backend folder:
   ```bash
   cd backend
   ```
2. Install premium dependencies:
   ```bash
   npm install
   ```
3. Initialize context configurations:
   ```bash
   cp .env.example .env
   ```
4. Perform database migration and client asset creation using Prisma:
   ```bash
   npx prisma migrate dev --name init_defender
   npx prisma generate
   ```
5. Boot system:
   ```bash
   npm run dev
   ```

### Docker Orchestration (Production Ready)
Deploy the postgres container and API node synchronously via Compose:
```bash
docker-compose up -d --build
```

---

## 📡 REST API Specifications

Our transceivers return standard, consistent, unified JSON packets:
`{"success": true/false, "message": "...", "data": {}, "errors": []}`

### Core Authentication (`/api/v1/auth`)
*   `POST /register` - Operator Registration.
*   `POST /login` - Handshake Session Init.
*   `POST /logout` - Close Active Handshake.
*   `POST /refresh` - Recycle Active Access Code.
*   `POST /forgot-password` - Request verification overrides.
*   `POST /reset-password` - Update passcode with override token.
*   `POST /verify-email` - Confirm compliance email token codes.
*   `GET /me` - Extract active operator demographic parameters (JWT required).
*   `POST /change-password` - Manual revision of passwords.

### SecOps Telemetry and Control (`/api/v1/secops`)
*   `GET /metrics` - Dynamic metric statistics tracker.
*   `GET /alerts` - Active threat indicator lists.
*   `GET /firewall` - Firewall rules.
*   `PATCH /firewall/:id` - Block / unblock ports (Requires `admin`).
*   `GET /audit-logs` - Immutable SOC2 audit logs.
*   `GET /logs` - Central Event registers.
*   `POST /logs` - Inject custom incident events.
*   `POST /posture` - Modify perimeter dynamic posture vectors.

### Search Engine Optimizations Admin (`/api/v1/seo`)
*   `GET /global` - Get Google tracker variables, Robots rules, and structured schema schemas.
*   `POST /global` - Revise central SEO configurations.
*   `GET /pages` - List all per-url paths.
*   `POST /pages/:path(*)` - Edit titles, descriptions, and dynamic keywords on folders.
*   `GET /redirects` - Fetch 301 redirection rules.
*   `POST /redirects` - Set active redirection rules.
*   `DELETE /redirects/:id` - Delete redirection rules.
*   `GET /broken-links` - Monitor and log crawl errors.
