# Amazon PPC Manager Training Program

An interactive student workbook and training platform for mastering Amazon PPC — built with Next.js 16, Tailwind v4, and shadcn/ui.

## Features

- **Structured Curriculum** — 4 phases, 10 modules, 8-12 weeks of progressive learning
- **Interactive Exercises** — Open-ended, calculation, and decision-based practice with live feedback
- **Auto-graded Quizzes** — Phase checkpoints with instant scoring and review
- **PPC Calculator Suite** — Metrics calculator, search term analyzer, and campaign builder
- **Capstone Project** — Build and present a complete PPC strategy
- **Progress Tracking** — Dashboard with visual progress, streak tracking, and milestones
- **Role-based Access** — Student, Instructor, and Admin views with appropriate tooling
- **Dark Mode** — Full light/dark theme support with system preference detection
- **Mobile Responsive** — Fluid layout with collapsible sidebar, touch-friendly interactions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand |
| Database | Prisma + SQLite/PostgreSQL |
| Auth | NextAuth.js |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API routes
├── components/    # React components
│   ├── layout/    # App shell, sidebar, navigation
│   ├── sections/  # Page sections (dashboard, curriculum, tools, etc.)
│   ├── shared/    # Reusable branded components
│   └── ui/        # shadcn/ui primitives
├── hooks/         # Custom React hooks
├── lib/           # Utilities, store, course data
└── styles/        # Design tokens and theme config
```

## Environment

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## License

MIT &copy; Amazon PPC Manager Training Program
