# Backend Architecture Design

Project: Weekly Report Generator & Team Dashboard

This document defines the backend technical design before feature development. It intentionally avoids implementation code and UI details.

## Architecture Goals

- Keep authentication, reports, projects, dashboard, and user management as separate feature modules.
- Use Prisma as the single source of truth for database modeling.
- Enforce data ownership and access through role-based authorization.
- Support team members submitting weekly reports and managers/admins reviewing team activity.
- Make analytics queryable without coupling dashboard logic directly to report creation.
- Keep auditability through timestamps, report status history fields, and refresh-token tracking.

## Domain Model

### User

Represents a person who can access the system.

Why it exists:

- Authenticates users.
- Owns submitted weekly reports.
- Allows managers/admins to review team activity.
- Connects users to roles and projects.

Important fields:

- `id`: stable internal identifier.
- `name`: display name.
- `email`: unique login identifier.
- `passwordHash`: bcrypt hash, never plaintext.
- `roleId`: user's access role.
- `managerId`: optional self-reference for reporting hierarchy.
- `isActive`: supports soft account deactivation.
- `lastLoginAt`: useful for audit/admin views.
- `createdAt`, `updatedAt`.

Relationships:

- Many users belong to one role.
- A user may report to another user as manager.
- A user may manage many users.
- A user may submit many weekly reports.
- A user may review many weekly reports.
- A user may own many refresh tokens.
- A user may belong to many projects through `ProjectMember`.

Constraints and indexes:

- Unique email.
- Index `roleId`.
- Index `managerId`.
- Index `isActive`.

### Role

Represents authorization level.

Why it exists:

- Decouples access control from hard-coded users.
- Allows clear separation between team member, manager, and admin capabilities.
- Can be extended later with custom permissions if needed.

Important fields:

- `id`.
- `name`: enum-backed role name.
- `description`.
- `createdAt`, `updatedAt`.

Relationships:

- One role has many users.

Constraints and indexes:

- Unique `name`.

Suggested enum:

- `TEAM_MEMBER`
- `MANAGER`
- `ADMIN`

### Project

Represents a project, client workstream, product area, or report category.

Why it exists:

- Groups weekly reports by work context.
- Enables manager dashboards by project.
- Supports project-scoped access and analytics.

Important fields:

- `id`.
- `name`.
- `description`.
- `status`.
- `ownerId`: optional user responsible for the project.
- `createdAt`, `updatedAt`, `archivedAt`.

Relationships:

- A project may have many weekly reports.
- A project may have many members through `ProjectMember`.
- A project may have one owner user.

Constraints and indexes:

- Unique `name`.
- Index `status`.
- Index `ownerId`.
- Index `archivedAt`.

Suggested enum:

- `ACTIVE`
- `ARCHIVED`
- `ON_HOLD`

### ProjectMember

Join table between users and projects.

Why it exists:

- A user can work on multiple projects.
- A project can have many users.
- Enables project-level access rules.

Important fields:

- `id`.
- `userId`.
- `projectId`.
- `assignedAt`.

Relationships:

- Belongs to one user.
- Belongs to one project.

Constraints and indexes:

- Unique composite constraint on `userId` and `projectId`.
- Index `projectId`.
- Index `userId`.

### WeeklyReport

Represents one user's report for one reporting week.

Why it exists:

- Core operational record for submitted weekly progress.
- Feeds manager review, status workflow, and dashboard analytics.
- Keeps structured fields for querying and narrative fields for human review.

Important fields:

- `id`.
- `userId`: author.
- `projectId`: project/category being reported against.
- `weekStartDate`.
- `weekEndDate`.
- `title`.
- `summary`.
- `accomplishments`.
- `blockers`.
- `nextWeekPlan`.
- `hoursWorked`.
- `status`.
- `submittedAt`.
- `reviewedAt`.
- `reviewedById`.
- `reviewComment`.
- `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Belongs to one user.
- Belongs to one project.
- Optionally reviewed by one user.

Constraints and indexes:

- Unique composite constraint on `userId`, `projectId`, and `weekStartDate` to prevent duplicate project reports for the same week.
- Index `userId`.
- Index `projectId`.
- Index `status`.
- Index `weekStartDate`.
- Index `weekEndDate`.
- Index `reviewedById`.
- Index `createdAt`.
- Index `deletedAt`.

Suggested enum:

- `DRAFT`
- `SUBMITTED`
- `APPROVED`
- `REJECTED`
- `REVISION_REQUESTED`

Status rules:

- Team members can create and edit `DRAFT` reports.
- Team members can submit `DRAFT` reports.
- Submitted reports become manager/admin reviewable.
- Managers/admins can approve, reject, or request revision.
- Rejected or revision-requested reports can be edited by the owner and resubmitted.
- Approved reports should be immutable except by admin policy.

### RefreshToken

Stores refresh-token sessions.

Why it exists:

- Supports secure JWT refresh flow.
- Enables logout, logout-all, token rotation, and compromised-session revocation.
- Avoids storing long-lived JWTs only on the client.

Important fields:

- `id`.
- `userId`.
- `tokenHash`.
- `expiresAt`.
- `revokedAt`.
- `replacedByTokenId`.
- `createdAt`.
- `createdByIp`.
- `revokedByIp`.
- `userAgent`.

Relationships:

- Belongs to one user.
- May reference a replacement refresh token.

Constraints and indexes:

- Unique `tokenHash`.
- Index `userId`.
- Index `expiresAt`.
- Index `revokedAt`.

### Optional Future Table: ReportStatusHistory

Useful if the assessment expects audit-grade workflow tracking.

Why it exists:

- Tracks every status transition.
- Shows who changed report status and when.
- Preserves review history beyond the latest review fields on `WeeklyReport`.

Recommended fields:

- `id`.
- `reportId`.
- `fromStatus`.
- `toStatus`.
- `changedById`.
- `comment`.
- `createdAt`.

## Prisma Schema Design

The future Prisma schema should contain these models and enums:

```prisma
enum RoleName {
  TEAM_MEMBER
  MANAGER
  ADMIN
}

enum ProjectStatus {
  ACTIVE
  ON_HOLD
  ARCHIVED
}

enum ReportStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
  REVISION_REQUESTED
}

model Role {
  id          String   @id @default(cuid())
  name        RoleName @unique
  description String?
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id              String         @id @default(cuid())
  name            String
  email           String         @unique
  passwordHash    String
  roleId          String
  role            Role           @relation(fields: [roleId], references: [id])
  managerId       String?
  manager         User?          @relation("UserManager", fields: [managerId], references: [id])
  directReports   User[]         @relation("UserManager")
  isActive        Boolean        @default(true)
  lastLoginAt     DateTime?
  reports         WeeklyReport[] @relation("ReportAuthor")
  reviewedReports WeeklyReport[] @relation("ReportReviewer")
  projectMembers  ProjectMember[]
  ownedProjects   Project[]      @relation("ProjectOwner")
  refreshTokens   RefreshToken[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([roleId])
  @@index([managerId])
  @@index([isActive])
}

model Project {
  id          String          @id @default(cuid())
  name        String          @unique
  description String?
  status      ProjectStatus   @default(ACTIVE)
  ownerId     String?
  owner       User?           @relation("ProjectOwner", fields: [ownerId], references: [id])
  members     ProjectMember[]
  reports     WeeklyReport[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  archivedAt  DateTime?

  @@index([status])
  @@index([ownerId])
  @@index([archivedAt])
}

model ProjectMember {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@unique([userId, projectId])
  @@index([userId])
  @@index([projectId])
}

model WeeklyReport {
  id              String       @id @default(cuid())
  userId          String
  user            User         @relation("ReportAuthor", fields: [userId], references: [id])
  projectId       String
  project         Project      @relation(fields: [projectId], references: [id])
  weekStartDate   DateTime
  weekEndDate     DateTime
  title           String
  summary         String
  accomplishments String
  blockers        String?
  nextWeekPlan    String?
  hoursWorked     Decimal?     @db.Decimal(5, 2)
  status          ReportStatus @default(DRAFT)
  submittedAt     DateTime?
  reviewedAt      DateTime?
  reviewedById    String?
  reviewedBy      User?        @relation("ReportReviewer", fields: [reviewedById], references: [id])
  reviewComment   String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?

  @@unique([userId, projectId, weekStartDate])
  @@index([userId])
  @@index([projectId])
  @@index([status])
  @@index([weekStartDate])
  @@index([weekEndDate])
  @@index([reviewedById])
  @@index([createdAt])
  @@index([deletedAt])
}

model RefreshToken {
  id                String         @id @default(cuid())
  userId            String
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash         String         @unique
  expiresAt         DateTime
  revokedAt         DateTime?
  replacedByTokenId String?
  replacedByToken   RefreshToken?  @relation("RefreshTokenRotation", fields: [replacedByTokenId], references: [id])
  replacesTokens    RefreshToken[] @relation("RefreshTokenRotation")
  createdAt         DateTime       @default(now())
  createdByIp       String?
  revokedByIp       String?
  userAgent         String?

  @@index([userId])
  @@index([expiresAt])
  @@index([revokedAt])
}
```

## REST API Design

Base path: `/api/v1`

### Auth

- `POST /auth/register`
  - Public or admin-controlled depending on product decision.
  - Creates a user with a default role, usually `TEAM_MEMBER`.

- `POST /auth/login`
  - Validates credentials.
  - Returns access token and refresh token.

- `POST /auth/refresh`
  - Accepts refresh token.
  - Rotates refresh token and returns a new access token.

- `POST /auth/logout`
  - Revokes current refresh token.

- `POST /auth/logout-all`
  - Revokes all active refresh tokens for the authenticated user.

- `GET /auth/me`
  - Returns authenticated user's profile, role, and basic permissions.

### Users

- `GET /users`
  - Admin only.
  - Supports filtering by role, active status, manager, and search.

- `GET /users/:id`
  - Admin can view anyone.
  - Manager can view direct reports.
  - User can view self.

- `PATCH /users/:id`
  - Admin manages user profile, role, active status, and manager assignment.
  - User may update limited own profile fields.

- `DELETE /users/:id`
  - Admin only.
  - Prefer soft deactivation over hard deletion.

- `GET /users/:id/reports`
  - Admin or manager for direct reports.
  - Self access for own reports.

### Roles

- `GET /roles`
  - Admin only, or authenticated users if roles are needed for UI metadata.

- `POST /roles`
  - Admin only.
  - Usually unnecessary if roles are enum-seeded.

- `PATCH /roles/:id`
  - Admin only.

### Projects

- `GET /projects`
  - Admin sees all.
  - Manager sees owned or assigned projects.
  - Team member sees assigned active projects.

- `POST /projects`
  - Admin and manager.

- `GET /projects/:id`
  - Project members, project owner, managers, admins.

- `PATCH /projects/:id`
  - Admin or project owner/manager.

- `DELETE /projects/:id`
  - Admin only.
  - Prefer archive by setting `status = ARCHIVED` and `archivedAt`.

- `GET /projects/:id/members`
  - Admin, manager, project owner.

- `POST /projects/:id/members`
  - Admin, manager, project owner.

- `DELETE /projects/:id/members/:userId`
  - Admin, manager, project owner.

### Weekly Reports

- `GET /reports`
  - Team member sees own reports.
  - Manager sees direct reports and project reports they manage.
  - Admin sees all.
  - Query parameters:
    - `status`
    - `projectId`
    - `userId`
    - `weekStartDate`
    - `weekEndDate`
    - `from`
    - `to`
    - `page`
    - `limit`
    - `sort`

- `POST /reports`
  - Team member, manager, admin.
  - Creates a `DRAFT` report unless request explicitly submits and passes submission validation.

- `GET /reports/:id`
  - Owner, manager with scope, project manager, or admin.

- `PUT /reports/:id`
  - Full update for report owner while status allows editing.
  - Admin can update under controlled policy.

- `PATCH /reports/:id`
  - Partial update for report owner while editable.

- `DELETE /reports/:id`
  - Soft delete.
  - Owner can delete drafts.
  - Admin can delete any report.

- `POST /reports/:id/submit`
  - Owner submits draft or revision-requested report.

- `POST /reports/:id/approve`
  - Manager/admin only.

- `POST /reports/:id/reject`
  - Manager/admin only.

- `POST /reports/:id/request-revision`
  - Manager/admin only.

### Dashboard Analytics

- `GET /dashboard/summary`
  - Returns aggregate counts:
    - total reports
    - submitted reports
    - approved reports
    - pending review
    - active projects
    - active users

- `GET /dashboard/reports-by-status`
  - Groups reports by `ReportStatus`.

- `GET /dashboard/reports-by-project`
  - Groups reports by project.

- `GET /dashboard/reports-over-time`
  - Weekly/monthly trend.

- `GET /dashboard/team-activity`
  - Manager/admin view of report submission activity by user.

- `GET /dashboard/my-summary`
  - Team member personal dashboard.

Dashboard scope:

- Team members only see their own analytics.
- Managers see direct reports and managed projects.
- Admins see all analytics.

## Role-Based Access Control

### Roles

`TEAM_MEMBER`

- Manage own profile fields.
- View assigned projects.
- Create own reports.
- Edit own draft/revision reports.
- Submit own reports.
- View own dashboard.

`MANAGER`

- All team member permissions.
- Create/manage projects they own or are assigned to manage.
- View reports for direct reports or managed projects.
- Approve, reject, or request revisions.
- View team/project dashboard analytics within scope.

`ADMIN`

- Full system access.
- Manage users, roles, projects, memberships, and all reports.
- View global dashboard analytics.
- Deactivate users and archive projects.

### Authorization Layers

- Authentication middleware verifies JWT and attaches `authUser`.
- Role middleware checks broad role permissions.
- Resource policy checks ownership and scope:
  - Is this report owned by the user?
  - Is this user the report author's manager?
  - Is this user assigned to or owner of the project?
  - Is this user an admin?

Use both role and resource checks. Role alone is not enough for manager-scoped data.

## Request Flow

1. Client sends request to `/api/v1/...`.
2. Express applies global middleware:
   - Helmet security headers.
   - CORS.
   - JSON body parser.
   - Morgan request logging.
3. Route-level authentication verifies access token.
4. Request validation checks params, query, and body using Zod.
5. Authorization checks role and resource-level access.
6. Controller receives validated data only.
7. Service layer applies business workflow rules.
8. Repository/data-access layer queries Prisma.
9. Response mapper returns safe DTOs.
10. Error handler returns consistent error responses.

Recommended response shape:

```json
{
  "data": {}
}
```

Recommended error shape:

```json
{
  "error": {
    "message": "Validation failed",
    "details": {}
  }
}
```

## Validation Rules

### Auth

Register:

- `name`: required, 2-100 characters.
- `email`: required, valid email, normalized lowercase, unique.
- `password`: required, minimum 8-12 characters, should require letters and numbers.
- `role`: ignored for public registration or admin-only if accepted.

Login:

- `email`: required valid email.
- `password`: required.

Refresh:

- `refreshToken`: required.
- Token must exist by hash, not be expired, not be revoked.

### User

- `email`: unique, lowercase.
- `roleId`: must reference existing role.
- `managerId`: must reference an active manager/admin and must not equal own user ID.
- `isActive`: admin only.

### Project

- `name`: required, 2-120 characters, unique.
- `description`: optional, max 1000 characters.
- `status`: must be valid `ProjectStatus`.
- `ownerId`: optional, must reference active user.
- Archived projects should not accept new reports.

### ProjectMember

- `userId`: active user only.
- `projectId`: active project only.
- Duplicate membership is blocked by composite unique constraint.

### WeeklyReport

- `projectId`: required and must be accessible to author.
- `weekStartDate`: required, should be start of week by product convention.
- `weekEndDate`: required, must be after `weekStartDate`.
- Week range should usually be exactly 7 days.
- `title`: required, 3-150 characters.
- `summary`: required for submission, max 5000 characters.
- `accomplishments`: required for submission, max 5000 characters.
- `blockers`: optional, max 3000 characters.
- `nextWeekPlan`: optional for draft, recommended/required for submission, max 3000 characters.
- `hoursWorked`: optional decimal, minimum 0, maximum 168.
- Duplicate report for same `userId`, `projectId`, and `weekStartDate` is blocked.
- Only editable statuses:
  - `DRAFT`
  - `REVISION_REQUESTED`
  - optionally `REJECTED`
- Submission sets `submittedAt`.
- Review actions set `reviewedAt`, `reviewedById`, and optional `reviewComment`.

### Pagination and Filtering

- `page`: default 1, minimum 1.
- `limit`: default 20, maximum 100.
- `sort`: allowlist fields only.
- Date filters must be valid ISO dates.
- Enum filters must match known enum values.

## Backend Folder Structure

Recommended structure under `apps/server/src`:

```text
src/
├── app.ts
├── server.ts
├── config/
│   ├── env.ts
│   ├── logger.ts
│   └── security.ts
├── constants/
│   ├── http.ts
│   └── permissions.ts
├── infrastructure/
│   ├── database/
│   │   └── prisma.ts
│   └── token/
│       └── jwt.ts
├── middleware/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── error-handler.ts
│   ├── not-found-handler.ts
│   └── validate-request.ts
├── routes/
│   └── index.ts
├── shared/
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── validation-error.ts
│   ├── types/
│   │   ├── api-response.ts
│   │   └── authenticated-request.ts
│   └── utils/
│       ├── async-handler.ts
│       └── pagination.ts
└── features/
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.routes.ts
    │   ├── auth.schemas.ts
    │   ├── auth.service.ts
    │   └── refresh-token.repository.ts
    ├── users/
    │   ├── users.controller.ts
    │   ├── users.routes.ts
    │   ├── users.schemas.ts
    │   ├── users.service.ts
    │   └── users.repository.ts
    ├── roles/
    │   ├── roles.controller.ts
    │   ├── roles.routes.ts
    │   ├── roles.schemas.ts
    │   ├── roles.service.ts
    │   └── roles.repository.ts
    ├── projects/
    │   ├── projects.controller.ts
    │   ├── projects.routes.ts
    │   ├── projects.schemas.ts
    │   ├── projects.service.ts
    │   └── projects.repository.ts
    ├── reports/
    │   ├── reports.controller.ts
    │   ├── reports.routes.ts
    │   ├── reports.schemas.ts
    │   ├── reports.service.ts
    │   ├── reports.repository.ts
    │   └── reports.policy.ts
    └── dashboard/
        ├── dashboard.controller.ts
        ├── dashboard.routes.ts
        ├── dashboard.schemas.ts
        ├── dashboard.service.ts
        └── dashboard.repository.ts
```

## Module Responsibilities

Controller:

- Reads validated request data.
- Calls service methods.
- Returns response DTOs.

Service:

- Owns business workflow rules.
- Coordinates repositories.
- Enforces status transitions.

Repository:

- Owns Prisma database queries.
- Avoids HTTP concerns.

Schemas:

- Zod validation for body, params, and query.
- Defines typed request contracts.

Policy:

- Encapsulates resource-level access rules.
- Especially important for reports and dashboard analytics.

Routes:

- Wires route paths to middleware and controllers.

## Development Order Recommendation

1. Finalize Prisma schema and migration.
2. Seed default roles.
3. Implement auth and refresh-token flow.
4. Implement users and role management.
5. Implement projects and memberships.
6. Implement weekly reports and status workflow.
7. Implement dashboard analytics.
8. Add integration tests for RBAC and report status transitions.
