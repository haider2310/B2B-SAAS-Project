# B2B SaaS CRM - Architecture & Modules

This document outlines the core modules of the application, corresponding to the development roadmap (M1-M6).

## Modules

### M1: Foundation
- **Authentication:** NextAuth.js with Prisma Adapter.
- **Multi-tenancy:** `Tenant` model links all resources.
- **RBAC:** `UserRole` enum (ADMIN, SALES_REP, etc.).
- **Database:** SQLite (dev) / PostgreSQL (prod) via Prisma.

### M2: CRM Core
- **Entities:** Leads, Companies, Contacts.
- **Timelines:** Unified history view (Activities, Calls, Notes) for each entity.
- **Relations:** Companies can have multiple Contacts and Deals.

### M3: Sales Pipeline
- **Deals:** Kanban-style pipeline with stages (Prospecting -> Closed).
- **Tasks:** To-do lists linked to entities and users.

### M4: Automation Engine
- **Inbound Endpoints:** Webhook receivers with payload mapping.
- **Event Logs:** Audit trail of all system actions.
- **Deduplication:** Configurable logic to prevent duplicate leads.

### M5: Outbound Integrations
- **Event Bus:** Internal pub/sub system for system events.
- **Webhooks:** Outbound subscriptions to trigger external tools (Zapier, Slack).
- **Retries:** Automatic retry mechanism for failed deliveries.

### M6: Support & Scale
- **Support Tickets:** Internal ticketing system for customer issues.
- **Call Logging:** Interface to log and view calls.
- **Analytics:** Dashboard with KPI cards and charts.
- **Export:** CSV export functionality for data reporting.
- **Testing:** Basic unit test coverage.

## Folder Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (CRM, Analytics, Layout).
- `/lib`: Utilities (Database, Auth, Event Bus).
- `/prisma`: Database schema and migrations.
- `/tests`: Unit and integration tests.
