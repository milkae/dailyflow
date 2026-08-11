# DailyFlow - Habits, Meals, Recipes & Todos Tracker

A modern full-stack web application for tracking daily habits, meals, recipes, and todos. Built with **Next.js 16**, **React 19**, **Prisma**, and **TailwindCSS**.

## Features

### 📊 Dashboard

- Quick stats overview of habits and meals
- Today's habits and meals at a glance

### 🎯 Habits

- Create and track daily, weekly, or monthly habits
- Visual streak tracking and progress indicators
- Habit timeline with completion history
- Completion rate analytics
- Support for flexible frequency patterns (daily, weekly, monthly, specific days, intervals)

### 🍽️ Meals

- Log meals by type (breakfast, lunch, dinner, snack)
- Associate meals with recipes
- Date-based meal planning
- Quick meal history view

### 👨‍🍳 Recipes

- Create custom recipes with ingredients and instructions
- Parse recipes from URLs (auto-extraction of recipe data)

### ✅ Todos

- Create and track personal tasks
- Mark items complete and keep the dashboard focused on the current day

### 🔐 Authentication

- Secure authentication with Google OAuth
- Better Auth integration
- Protected routes and user-specific data

## Tech Stack

**Frontend:**

- [Next.js 16](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - UI library
- [TailwindCSS 4](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [React Query](https://tanstack.com/query) - Data fetching & caching
- [Recharts](https://recharts.org) - Data visualization

**Backend:**

- [Next.js Route Handlers and Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Server mutations and HTTP endpoints
- [Prisma ORM](https://www.prisma.io) - Database management
- [Better Auth](https://www.better-auth.com) - Authentication

**Database:**

- PostgreSQL

**Developer Tools:**

- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Zod](https://zod.dev) - Schema validation
- [Vitest](https://vitest.dev) - Testing framework
- [ESLint](https://eslint.org) - Code linting

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database
- Google OAuth credentials (for authentication)

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo>
cd dailyflow
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dailyflow
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

3. **Set up the database:**

```bash
npx prisma migrate dev
```

4. **Run the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                       # Next.js App Router
│   ├── (auth)/                # Sign-in flow
│   ├── (habits)/              # Habits feature routes, actions, components
│   ├── (meals)/               # Meals feature routes, actions, components
│   ├── (recipes)/             # Recipes feature routes, actions, components
│   ├── (todos)/               # Todos feature routes and actions
│   ├── _components/           # Shared app-level UI
│   ├── api/                   # Route handlers
│   ├── actions.ts             # Shared dashboard data
│   └── layout.tsx             # Root layout
├── generated/                 # Prisma client output
├── lib/                       # Utilities and configuration
├── prisma/                    # Database schema and migrations
└── utils/                     # Shared helpers
```

## Contributor Notes

### Feature Ownership by Route Group

- `app/(habits)`: habits routes, server actions, and UI
- `app/(meals)`: meals planning routes, actions, and meal-related UI
- `app/(recipes)`: recipes pages, parsing flow, and recipe CRUD
- `app/(todos)`: todos routes and server actions
- `app/actions.ts`: shared dashboard aggregation used by `app/page.tsx`

### Cache Invalidation Convention

- Mutations that impact dashboard cards should invalidate both:
	- the `dashboard` cache tag
	- the dashboard route (`/`)
- Feature pages should also revalidate their own route (for example `/habits`, `/meals`, `/todos`, `/recipes`) when list/detail surfaces depend on changed data.
- Prefer the shared helper in `lib/cache-invalidation.ts` to keep invalidation behavior consistent:
	- `invalidateDashboard()` for dashboard-only refresh
	- `invalidateDashboardAndPaths([...])` for dashboard + feature routes

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run tests with Vitest
```

## Key Implementation Details

### Server Actions

- Form submissions use Next.js Server Actions for type-safe mutations
- Input validation with Zod schemas
- Automatic cache revalidation with `revalidatePath()` and cache tags

### Data Fetching

- Server components for initial data loading
- React Query in the narrow client-side slice that needs it
- Shared cache tags and route revalidation for fresh dashboard data

### Authentication Flow

- Protected routes with session verification
- User-specific data isolation
- Google OAuth sign-in/sign-up

### Database

- Prisma ORM with PostgreSQL
- User data relationships (Habits, Meals, Recipes per user)
- User-scoped reads and writes across feature actions

## Deployment

### Vercel (Recommended)

```bash
pnpm install -g vercel
vercel
```

### Docker

```bash
docker build -t dailyflow .
docker run -p 3000:3000 dailyflow
```

### Manual Deployment

1. Set up a PostgreSQL database
2. Deploy to your hosting platform (AWS, DigitalOcean, Railway, etc.)
3. Set environment variables in production
4. Run database migrations: `npx prisma migrate deploy`

## Future Enhancements

- Meal planning calendar
- Nutrition tracking integration
- Social sharing of habits and recipes
- Mobile app with React Native
- Advanced analytics and insights

## License

MIT
