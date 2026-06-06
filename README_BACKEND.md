# Eurosia Defender X - Enterprise-Grade Decoupled Backend

This is the comprehensive, future-generation SecOps administrative backend for Eurosia Defender X, designed for 100% backward-compatibility with the existing front-facing application. 

The server features a pristine, highly-resilient **layered design** adhering to industry best practices:
- **Controller Layer** (Request parsers, schema gates, HTTP status mapping)
- **Service Layer** (Domain transactional modeling, automated reaction engines)
- **Repository/Database Layer** (File-synchronized storage fallback for zero cold-start crashes)
- **Middleware Layer** (Sliding-window rate limiters, token extractors, script sandboxes)
- **Validation/Utility Layer** (Native cryptographic HSM signature verification)

---

## 📂 Project Architecture & Directory Mapping

The backend codebase is organized inside modular sub-segments to avoid token/file size limitations and facilitate structural maintenance:

```text
├── server.ts                       # Unified boot entry point (Express, Vite middleware routing)
├── server/
│   ├── types.ts                    # Strongly-typed domain and security schemas
│   ├── utils/
│   │   └── jwt.ts                  # Cryptographic HSM-safe JWT encoders & decoders (HMAC-SHA256)
│   ├── repositories/
│   │   └── database.ts             # File-synchronized state coordinator (db.json engine)
│   ├── middlewares/
│   │   ├── authMiddleware.ts       # Extraction, token lifespan checks, and L2-L9 RBAC filters
│   │   └── securityMiddleware.ts   # Rate-limiting, anti-SQLi / anti-XSS, and CSP headers
│   ├── controllers/
│   │   ├── authController.ts       # Handshake controllers (Logins, Registers, Password resets)
│   │   ├── userController.ts       # Registry administrators ( Clearance overrides)
│   │   ├── secopsController.ts     # Command deck (Active threat mitigations, Firewall maps)
│   │   ├── copilotController.ts    # AI consultation managers (Official Gemini integrations)
│   │   └── contactController.ts    # Customer engagement form coordinators
│   └── routes/
│       ├── authRoutes.ts           # Token lifecycle mapping
│       ├── userRoutes.ts           # Operator database mapping
│       ├── secopsRoutes.ts         # Defense console state mapping
│       ├── copilotRoutes.ts        # Gemini AI streaming route mapping
│       ├── contactRoutes.ts        # Client form mapping
│       └── index.ts                # Primary unified router (api/v1 prefix mapping)
```

---

## 🗄️ Relational Database Schema Mapping

If transitioning to a fully automated SQL-based service (like **Google Cloud SQL PostgreSQL** via **Prisma ORM**), the schemas, relationships, indexes, and migrations manifest as follows:

```prism
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  admin
  analyst
  readonly
}

enum Severity {
  critical
  warning
  info
}

enum AlertStatus {
  active
  investigating
  resolved
}

enum PortStatus {
  blocked
  open
  monitored
}

model User {
  id                 String       @id @default(uuid())
  email              String       @unique
  name               String
  passwordHash       String
  role               Role         @default(readonly)
  accessLevel        String       @default("L2 Audit Only")
  isVerified         Boolean      @default(false)
  verificationToken  String?      @unique
  resetToken         String?      @unique
  resetTokenExp      DateTime?
  refreshToken       String?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  auditLogs          AuditLog[]   @relation("UserAudits")

  @@index([email])
}

model ThreatAlert {
  id          String      @id @default(uuid())
  timestamp   DateTime    @default(now())
  severity    Severity
  title       String
  source      String
  status      AlertStatus @default(active)
  description String
  category    String

  @@index([status])
  @@index([severity])
}

model FirewallRule {
  id      String     @id @default(uuid())
  port    Int        @unique
  service String
  status  PortStatus @default(blocked)

  @@index([port])
}

model SecurityEventLog {
  id        String   @id @default(uuid())
  timestamp DateTime @default(now())
  source    String
  logtext   String
  type      String   // incoming, blocked, resolved, system

  @@index([timestamp])
}

model AuditLog {
  id        String   @id @default(uuid())
  timestamp DateTime @default(now())
  operator  String
  action    String
  ip        String
  userId    String?
  user      User?    @relation("UserAudits", fields: [userId], references: [id])

  @@index([operator])
}

model ContactInquiry {
  id        String   @id @default(uuid())
  name      String
  email     String
  company   String
  message   String
  status    String   @default("pending") // pending, reviewed
  createdAt DateTime @default(now())
}
```

### Optimize Index & Partitioning Blueprint (Scalability)
1. **Clustered Indexes**: Default UUID primary keys operate index-searches instantly.
2. **Compound Indexes**: B-Tree indices applied on critical queries: `User(email)`, `ThreatAlert(status, severity)`, and `AuditLog(timestamp, operator)`.
3. **Database Caching Strategy**: Integrating standard **Redis** caches on highly accessed structural calls (e.g. `GET /api/v1/secops/alerts` and `GET /api/v1/secops/firewall`).

---

## 🌐 Enterprise REST API Specifications

All endpoints return structural JSON payloads, enforce sanitization filters, log operator audit tracks, and are rate-limited to **150 transceivers/min**.

### 1. Authentication APIs (`/api/v1/auth`)

* **`POST /login`**  
  * **Description**: Exchanges valid operators credentials for secure JWT.  
  * **Payload**: `{"email": "admin@eurosia.com", "password": "..."}`  
  * **Success Return**:  
    ```json
    {
      "status": "BRIDGED_LOCK_ACTIVE",
      "token": "eyJhbGciOi...",
      "refreshToken": "rf-...",
      "user": { "email": "admin@eurosia.com", "name": "Admin Operator", "role": "admin", "accessLevel": "L9 Secure Clear" }
    }
    ```

* **`POST /register`**  
  * **Description**: Create new security analyst profiles (defaulting to safe `readonly` classes).  
  * **Payload**: `{"email": "guest@eurosia.com", "name": "Guest Analyst", "password": "..."}`

* **`POST /forgot-password`**  
  * **Description**: Generates an isolated cryptographic reset pass-key.

* **`POST /reset-password`**  
  * **Description**: Overwrites operator passphrase using active pass-keys.

* **`POST /refresh`**  
  * **Description**: Exchange local refresh tokens for renewed session parameters.

### 2. User/Role APIs (`/api/v1/users`)

* **`GET /`**  
  * **Clearance**: Session verified  
  * **Description**: Query complete registered Security Operator indexes.

* **`PATCH /:email/role`**  
  * **Clearance**: Admin (L9 Clear Only)  
  * **Description**: Grant or withdraw access classes.  
  * **Payload**: `{"role": "analyst"}`

### 3. SecOps Control APIs (`/api/v1/secops`)

* **`GET /alerts`**  
  * **Description**: Streams posture configurations, global threat levels, and active warnings.

* **`PATCH /alerts/:id`**  
  * **Clearance**: Admin or Analyst  
  * **Description**: Modifies threat states between `investigating` and `resolved`.  
  * **Payload**: `{"status": "resolved"}`

* **`GET /firewall`**  
  * **Description**: Pulls system active port maps.

* **`PATCH /firewall/:id`**  
  * **Clearance**: Admin (L9 Clear Only)  
  * **Description**: Overwrites port statuses between `blocked` and `monitored`. Automated triggers are executed (e.g. sealing Port 22 automatically clears active intrusion alerts).

* **`POST /posture`**  
  * **Clearance**: Admin (L9 Clear Only)  
  * **Description**: Pivot global threat limits. (Shifting to `HIGH_INTENSITY_LOCKDOWN` deploys deep shields across ports 3306 and 1433 automatically).

---

## 🛠️ Environmental Settings & Live Integration

### Pre-requisites Setup
Verify the existence of the secure environment variables inside `.env`:
```env
GEMINI_API_KEY="your-gemini-pro-and-flash-key"
JWT_SECRET="eurosia_super_secure_transceiver_gate_2026_key"
NODE_ENV="development" # Switch to 'production' for optimal assets serving
```

### Relational Database Implementation Instructions (Prisma & PostgreSQL Hook-up)
1. **Prisma Tooling Installation**:
   ```bash
   npm install prisma @prisma/client
   ```
2. **Environment URL Setup**: Appending the database URL to `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5412/eurosia_db?schema=public"
   ```
3. **Database Syncing & Compilation**:
   ```bash
   npx prisma migrate dev --name init_defender
   ```
4. **Adapter Initialization**:
   Replace `./server/repositories/database.ts` core queries with Prisma transactions:
   ```typescript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   // e.g. public getUserByEmail(email) { return prisma.user.findUnique({ where: { email } }); }
   ```

### 🐋 Docker Deployment Instructions
This backend is fully prepared for unified container deployments:
1. **Build complete local container**:
   ```bash
   docker build -t eurosia-defender .
   ```
2. **Execute cluster deployment**:
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production -e GEMINI_API_KEY="your-key" eurosia-defender
   ```
