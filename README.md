# Theta Treats

A pastry e-commerce website with a mobile-first design.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL for metadata and links (defaults to `http://localhost:3000`) |
| `PAYMENT_PROVIDER` | No | `mock` or `razorpay` (defaults to `mock`) |
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot token for order notifications |
| `TELEGRAM_CHAT_ID` | No | Telegram chat ID for order notifications |

Apply database migrations from `supabase/migrations/` in your Supabase project before running the app.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Create a production build
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint
