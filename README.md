# Nexus CRUD Manager

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sohrabi11/nexus-crud-manager)]

A visually stunning, production-ready CRUD (Create, Read, Update, Delete) management dashboard built on Cloudflare Workers and Durable Objects. Manage projects with fields like Name, Status, Priority, Budget, and Due Date. Features a sleek glass-morphic design, responsive data grid, interactive slide-over forms, and a dashboard with analytics.

## Features

- **Dashboard Overview**: Key metrics (Total Projects, Active, Total Budget), recent activity, and quick actions.
- **Projects Manager**: Searchable, sortable data table with row actions (Edit, Delete) and slide-over forms for Create/Update.
- **Responsive Design**: Flawless across all devices with mobile-first approach.
- **Edge-Powered Backend**: Low-latency storage using Cloudflare Durable Objects and IndexedEntity pattern.
- **Modern UI**: Glass-morphism, smooth animations, hover states, and shadcn/ui components.
- **Form Validation**: Zod schemas with React Hook Form for robust data handling.
- **Optimistic Updates**: React Query for instant UI feedback and caching.
- **Analytics**: Beautiful charts with Recharts.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, React Query, React Hook Form, Zod, Framer Motion, Lucide React, Recharts, Sonner (Toasts), Zustand
- **Backend**: Hono, Cloudflare Workers, Durable Objects (GlobalDurableObject with IndexedEntity pattern)
- **Utilities**: clsx, tailwind-merge, date-fns, uuid
- **Deployment**: Cloudflare Workers (Edge runtime)

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd nexus_crud_manager
   bun install
   ```

2. **Development**:
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. **Type Generation** (Cloudflare bindings):
   ```bash
   bun run cf-typegen
   ```

## Development

- **Hot Reload**: `bun dev` starts Vite dev server with HMR.
- **Linting**: `bun lint` for code quality.
- **Build**: `bun build` for production bundle.
- **Preview**: `bun preview` for local production preview.
- **API Endpoints**: Test at `/api/projects` (list), `/api/projects` (POST create), etc.
- **Sidebar Navigation**: Toggle between Dashboard (`/`) and Projects (`/projects`).
- **Seeding**: Backend auto-seeds demo projects on first list request.

### Usage Examples

- **Create Project**: Navigate to Projects > "New Project" > Fill form > Save.
- **Edit/Delete**: Click row actions in the table.
- **Search/Sort**: Use table headers and search input.
- **Dashboard Metrics**: Auto-updates with live data.

Routes are defined in `src/main.tsx`. Extend by adding routes there.

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

Prerequisites:
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- Install Wrangler: `bun add -g wrangler`
- Login: `wrangler login`
- Select Workers & Pages project.

The app uses a single `GlobalDurableObject` binding (pre-configured). Assets are served as SPA.

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sohrabi11/nexus-crud-manager)]

## Architecture

- **Frontend**: React Router for SPA navigation, React Query for data fetching/mutations.
- **Backend**: Hono routes in `worker/user-routes.ts`. Extend `ProjectEntity` in `worker/entities.ts`.
- **Storage**: IndexedEntity pattern – Index for listing, individual DOs for entities.
- **Shared Types**: `shared/types.ts` for type-safety across FE/BE.
- **Sidebar Layout**: Responsive with shadcn/ui Sidebar.

## Extending the App

1. **New Fields**: Update `Project` type in `shared/types.ts`, Zod schema, and forms.
2. **New Routes**: Add to `worker/user-routes.ts` using `ProjectEntity` helpers.
3. **New Pages**: Add routes in `src/main.tsx`, use `AppLayout` for sidebar.
4. **Custom Entities**: Extend `IndexedEntity` in `worker/entities.ts`.

## Troubleshooting

- **CORS Issues**: Pre-configured for `/api/*`.
- **Types Missing**: Run `bun run cf-typegen`.
- **Build Errors**: Ensure `bun install` and no forbidden patterns (see template rules).
- **DO Storage**: Data persists across deploys via Durable Objects.

## License

MIT License. See [LICENSE](LICENSE) for details.