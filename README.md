This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## PostgreSQL Backend (Optional)

This project includes an optional PostgreSQL backend that can be used instead of the default JSON+localStorage implementation.

### Setup

1. Install PostgreSQL on your system
2. Create a database and user:
   ```sql
   CREATE USER lifeapp_user WITH PASSWORD 'your_password';
   CREATE DATABASE lifeapp OWNER lifeapp_user;
   ```
3. Copy `.env.local.example` to `.env.local` and configure your database connection:
   ```bash
   cp .env.local.example .env.local
   ```
4. Update the DATABASE_URL in `.env.local` with your actual database credentials
5. Run the database initialization script (see `docs/postgresql-middleware-design.md` for details)
6. To enable the PostgreSQL backend, set `DATA_PROVIDER=postgresql` in your `.env.local` file

### Switching between backends

- To use the default JSON+localStorage backend: Leave `DATA_PROVIDER` unset or set to `json`
- To use the PostgreSQL backend: Set `DATA_PROVIDER=postgresql`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
