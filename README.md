# BTHS Action Website

A modern, responsive web platform for the Brooklyn Technical High School Action club, built to manage community service events, track member participation, and showcase executive team information.

## 🚀 Features

- **Event Management**: Browse upcoming and past community service events with detailed information
- **Member Dashboard**: Track service hours, points, and participation history
- **Executive Profiles**: Meet the team with interactive executive member profiles
- **Gallery**: Visual showcase of club activities and achievements
- **Authentication**: Secure login system with Auth0 integration
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Image Optimization**: Support for external image hosting with Next.js optimization

## 🛠️ Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/) and modern web technologies:

- **[Next.js](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Prisma](https://prisma.io)** - Database ORM and migrations
- **[NextAuth.js](https://next-auth.js.org)** - Authentication with Auth0
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[React Query](https://tanstack.com/query)** - Data fetching and caching
- **[MDX](https://mdxjs.com/)** - Markdown with React components
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── events/            # Event listing and detail pages
│   ├── executives/        # Executive team profiles
│   ├── gallery/           # Photo gallery
│   └── _components/       # Shared UI components
├── server/                # Backend API and database logic
│   ├── api/               # tRPC router definitions
│   └── auth/              # Authentication configuration
├── utils/                 # Utility functions and helpers
└── styles/                # Global CSS styles

scripts/
└── import-data.ts         # CSV data import script

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MySQL database (or compatible)
- Auth0 account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/x1yl/website.git
   cd website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your database URL, Auth0 credentials, and other required environment variables.

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Import initial data (optional)**
   ```bash
   pnpm db:import
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Management

### Available Scripts

- `pnpm db:studio` - Open Prisma Studio for database management
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate Prisma client and run migrations
- `pnpm db:migrate` - Deploy migrations to production
- `pnpm db:import` - Import data from CSV files

### Data Import

The project includes a data import script that can populate the database from CSV files:

```bash
pnpm db:import
```

Expected CSV files in `./data/` directory:
- `users.csv` - Member information
- `exec_details.csv` - Executive team details
- `events.csv` - Event information
- `event_attendees.csv` - Attendance records
- `deleted_users.csv` - Historical user data

## 🎨 Development

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

### Building

- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm preview` - Build and start production server

## 🌐 Deployment

The application is optimized for deployment on:

- **[Vercel](https://vercel.com)** (Recommended)
- **[Netlify](https://netlify.com)**
- **[Railway](https://railway.app)**
- **Docker** containers

### Environment Variables

Required for production:
- `DATABASE_URL` - MySQL connection string
- `NEXTAUTH_SECRET` - Random secret for session encryption
- `NEXTAUTH_URL` - Your domain URL
- `AUTH0_CLIENT_ID` - Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Auth0 application client secret
- `AUTH0_ISSUER` - Auth0 domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This website is developed for the Brooklyn Technical High School Action club.
