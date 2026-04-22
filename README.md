# DailyFlow - Habits, Meals & Recipes Tracker

A modern full-stack web application for tracking daily habits, meals, and recipes. Built with **Next.js 16**, **React 19**, **Prisma**, and **TailwindCSS**.

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

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Server endpoints
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
BETTER_AUTH_URL=http://localhost:3000
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
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── habits/            # Habits feature
│   ├── meals/             # Meals feature
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── layout/            # Navigation, header, footer
│   ├── ui/                # shadcn/ui components
│   └── providers/         # Context providers
├── features/              # Feature-specific logic
│   ├── habits/            # Habits feature (components, actions)
│   ├── meals/             # Meals feature
│   └── recipes/           # Recipes feature
├── lib/                   # Utilities and configuration
│   ├── auth.ts            # Auth setup
│   ├── prisma.ts          # Prisma client
│   └── validators.ts      # Zod schemas
├── prisma/                # Database schema and migrations
└── utils/                 # Helper functions
```

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
- Automatic cache revalidation with `revalidatePath()`

### Data Fetching

- Server components for initial data loading
- React Query for client-side data management
- Optimistic updates in UI

### Authentication Flow

- Protected routes with session verification
- User-specific data isolation
- Google OAuth sign-in/sign-up

### Database

- Prisma ORM with PostgreSQL
- User data relationships (Habits, Meals, Recipes per user)
- Soft deletion support for data safety

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
