# weekly-report-generator

Production-ready monorepo foundation for a Weekly Report Generator and team dashboard.

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Axios, React Hook Form, Zod, Recharts, Framer Motion
- Backend: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, bcrypt, Zod, Helmet, Morgan, CORS
- Tooling: npm workspaces, ESLint flat config, Prettier, shared TypeScript settings

## Repository Structure

```text
weekly-report-generator/
├── apps/
│   ├── client/
│   └── server/
├── docs/
├── diagrams/
├── presentation/
├── demo/
├── .github/
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create local environment files:

```bash
cp .env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

3. Start PostgreSQL and update `DATABASE_URL` in `apps/server/.env`.

4. Generate the Prisma client:

```bash
npm run prisma:generate --workspace apps/server
```

5. Start both applications:

```bash
npm run dev
```

## Common Scripts

- `npm run dev` starts all workspace development servers.
- `npm run build` builds all workspaces.
- `npm run lint` runs ESLint across all workspaces.
- `npm run typecheck` runs TypeScript validation.
- `npm run format` applies Prettier formatting.

## Architecture Principles

- Feature-first source organization for scalable ownership.
- Runtime configuration validated with Zod.
- Express middleware separated from routes, config, and infrastructure.
- Prisma isolated behind a database client module.
- Frontend API, routing, providers, UI primitives, and shared utilities are separated.
- No business features are implemented in this foundation.
