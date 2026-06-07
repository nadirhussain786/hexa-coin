# Hexa Coin — Telegram Mini App

A full-stack **Telegram Mini App** built on **Next.js 15 + Supabase + TON blockchain**. Users earn HXCO tokens by opening hexagon tiles, playing 10 skill-based mini games, completing social tasks, and inviting friends. An admin panel manages users, withdrawals, tasks, and game statistics.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
  - [User App](#user-app)
  - [Games](#games)
  - [Admin Panel](#admin-panel)
- [Database Schema](#database-schema)
- [RPC Functions](#rpc-functions)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Database Migrations](#database-migrations)
- [Project Structure](#project-structure)
- [Server Actions Reference](#server-actions-reference)
- [Telegram Bot](#telegram-bot)
- [Design System](#design-system)
- [Deployment](#deployment)

---

## Overview

**Hexa Coin** is a gamified crypto-earning Telegram Mini App. Players tap hexagon tiles to reveal randomised rewards (HXCO tokens, TON, discounts, free plays), play 10 mini games (each gated behind a short ad), complete social tasks, and refer friends to earn referral bonuses. All balances are tracked in a PostgreSQL database via Supabase, with atomic balance mutations handled by SECURITY DEFINER RPC functions to prevent race conditions.

| Type | Value |
|------|-------|
| Platform | Telegram Web App (Mini App) |
| Native token | **HXCO** (in-app reward token) |
| Second token | **TON** (The Open Network) |
| Target device | Mobile-first (375 px → 430 px), responsive up to desktop |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org) | 15 (latest) | App Router, Server Actions, SSR |
| [React](https://react.dev) | 19.0.0 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | 5.7.2 | Static typing |
| [Tailwind CSS](https://tailwindcss.com) | 3.4.17 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12.6.3 | Spring physics animations, AnimatePresence |
| [shadcn/ui](https://ui.shadcn.com) | — | Accessible UI primitives (Dialog, Button, Tabs …) |
| [Radix UI](https://www.radix-ui.com) | various | Headless primitives (Dialog, Tabs, Toast …) |
| [Lucide React](https://lucide.dev) | 0.468.0 | Icon set |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | 1.0.7 | Tailwind animation plugin |

### Backend / Data

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Supabase](https://supabase.com) | latest | PostgreSQL database, Auth, RLS, RPC |
| [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) | latest | Cookie-based server-side Supabase client |
| [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) | latest | Client-side Supabase client |
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) | — | Serverless mutations |

### Blockchain / Telegram

| Technology | Version | Purpose |
|-----------|---------|---------|
| [@tonconnect/ui-react](https://docs.ton.org/develop/dapps/ton-connect/web) | 2.4.4 | TON wallet connect (TonKeeper, TonHub …) |
| [Telegram Web App SDK](https://core.telegram.org/bots/webapps) | — | User identity, haptics, theme variables |
| [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) | 0.66.0 | Telegram bot for app launch button |

### Dev Tools

| Tool | Purpose |
|------|---------|
| [Prettier](https://prettier.io) | Code formatting |
| [date-fns](https://date-fns.org) | Date utilities |
| [vaul](https://vaul.emilkowal.ski) | Drawer / bottom-sheet component |

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                 Telegram Mini App (WebView)             │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Next.js 15 App Router               │  │
│  │                                                  │  │
│  │  app/(app)/          ← user-facing routes        │  │
│  │    layout.tsx        ← TonConnect + UserContext  │  │
│  │    page.tsx          ← Home (balance + Hex Chase)│  │
│  │    task/             ← Tasks                     │  │
│  │    invite/           ← Referrals                 │  │
│  │    reward/           ← Withdraw earnings         │  │
│  │    games/            ← Games hub + 11 games      │  │
│  │                                                  │  │
│  │  app/admin/          ← admin panel (protected)   │  │
│  │                                                  │  │
│  │  app/actions/        ← Server Actions            │  │
│  │  app/admin/actions/  ← Admin server actions      │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                             │
│                    Server Actions                       │
│                    (Next.js RSC)                        │
│                          │                             │
│  ┌───────────────────────▼──────────────────────────┐  │
│  │                   Supabase                        │  │
│  │                                                  │  │
│  │  Tables:                                         │  │
│  │   users · user_balances · hex_permissions        │  │
│  │   game_sessions · mini_games                     │  │
│  │   withdrawals · user_referrals                   │  │
│  │   tasks · user_tasks                             │  │
│  │                                                  │  │
│  │  RPC Functions (SECURITY DEFINER):               │  │
│  │   open_hex · play_mini_game · create_withdrawal  │  │
│  │   complete_task · get_dashboard_stats            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **`SECURITY DEFINER` RPCs** — All balance-mutating operations (opening a hex, playing a game, withdrawing, completing a task) go through PostgreSQL stored procedures that enforce daily limits, check bans, and perform atomic credit/debit. This prevents race conditions and client-side spoofing.
- **Three-tier user identity** — `Telegram.WebApp.initDataUnsafe.user` → localStorage cache → anonymous UUID. Works both inside Telegram and in a plain browser (dev mode).
- **`UserContext`** — A single React context provides `user`, `balance`, `permission`, `isLoading`, and `refreshBalance()` to all user-facing pages without prop drilling.
- **`"use server"` boundary** — Every file imported by a client component that touches `next/headers` or Supabase server client carries a `"use server"` directive at the top.
- **Row-Level Security** — All Supabase tables have RLS enabled. Users can only read/mutate their own rows. Admin bypass uses the service-role key from server-side actions only.

---

## Features

### User App

#### Home Page (`/`)
- **Live HXCO & TON balance** — both cards animate when the value changes (spring counter)
- **Quick-stats strip** — total games (11), max HXCO per play (50), daily play limit (3×)
- **Hex Chase featured card** — animated orbiting gold dot, floating particle dots, animated progress bar for daily opens, one-tap "Play Now" button
- **Recent rewards** — last 3 hex-opening sessions with reward type and timestamp
- **Ambient hex particles** — 6 floating hexagon shapes in the fixed background

#### Header (all pages)
- Live HXCO badge with shimmer sweep animation
- Animated logo with ping ring
- User avatar with online indicator
- Gradient accent line at the bottom

#### Navigation (bottom tabs)
- 4 tabs: **Hex** (Home) · **Task** · **Invite** · **Reward**
- Sliding glass pill background (`layoutId` spring animation)
- Active icon lifts and glows, glowing dot indicator

---

### Games

#### Hex Chase (`/games/hex-chase`) — Flagship
- Grid of 19 hexagonal tiles, each hiding a randomised reward
- Reward pool: **HXCO tokens**, **TON**, **Discount**, **Free Hex**, **Empty**
- Daily open limit enforced server-side via `open_hex` RPC (default 2/day per user)
- Permission system: admin can set custom `daily_limit`, `ad_required`, `ton_cost` per user
- TonConnect wallet integration for TON-cost opens
- 3D card-flip reveal animation with particle burst

#### Games Hub (`/games`) — Mini Games
All 10 mini games share the same flow:

```
Games Hub → Game card → Ad Gate (watch ad → SVG ring countdown) → Play game → Reward Dialog
```

**Daily limit**: 3 plays per game per user (enforced by `play_mini_game` RPC + client-side guard)
**Rewards**: 5–50 HXCO per play based on score percentage tiers:

| Score % | HXCO Reward |
|---------|-------------|
| ≥ 90%   | 50 HXCO     |
| ≥ 70%   | 35 HXCO     |
| ≥ 50%   | 20 HXCO     |
| ≥ 30%   | 10 HXCO     |
| > 0%    | 5 HXCO      |
| 0%      | 0 HXCO      |

| Game | Slug | Type | Mechanic |
|------|------|------|----------|
| Memory Match | `memory-match` | Skill | 4×4 grid, 8 emoji pairs, 60 second timer |
| Tap the Hex | `tap-hex` | Reflex | Spawn & tap hexagons, 15 seconds, max 20 taps |
| Rock Paper Scissors | `rock-paper-scissors` | Luck | Best of 3 vs CPU with W/L/D history |
| Math Quiz | `math-quiz` | Skill | 5 questions (+/−/×), 4 choices, 10 s each |
| Color Sequence | `color-sequence` | Memory | Simon Says, 4 colors, 10 levels |
| Reflex Test | `reflex-test` | Reflex | 5 rounds, tap when dot goes green, reaction-time scoring |
| Number Guess | `number-guess` | Logic | 1–100, 7 tries, hot/warm/cold hints |
| Word Scramble | `word-scramble` | Vocab | 5 scrambled crypto words, 20 s each |
| Coin Flip | `coin-flip` | Luck | 3 rounds, heads/tails prediction, 3D flip animation |
| Spin the Wheel | `spin-wheel` | Lucky | SVG 8-segment wheel, 1 spin per play, direct HXCO prize |

**Ad Gate** features:
- Pulsing game icon with animated rings
- SVG circular countdown ring (gradient stroke, dash-offset progress)
- Live countdown number in ring center
- 7-second ad simulation, closes automatically

**Reward Dialog** features:
- Tier-specific card colours & glows (gold ≥90%, violet ≥70%, cyan ≥40%, grey <40%)
- `requestAnimationFrame` HXCO counter counting up from 0
- CSS confetti burst (32 pieces with `--tx`/`--rot` custom properties)
- Pulse rings behind trophy orb on win

---

#### Task Page (`/task`)
- Fetches all active tasks + user completion status from DB
- Separates **Daily tasks** (reset each day) from **One-time tasks**
- Section dividers with gradient lines
- Animated progress bar + percentage badge
- **Go** button opens external link (Twitter, Telegram, etc.)
- **Claim** button calls `complete_task` RPC atomically (credits balance + marks done)
- Completion state: green icon + checked border
- Loading: staggered skeleton cards

#### Invite Page (`/invite`)
- Real referral link: `APP_URL?start=REFERRAL_CODE`
- SVG circular referral progress ring (shows `referrals / 10` as arc)
- Live referral count + TON earned from Supabase `user_referrals` table
- Copy-to-clipboard with checkmark feedback
- Share on Telegram (deep-link) and Twitter/X
- "How It Works" step-by-step guide
- Animated hero with pulse rings around share icon

#### Reward Page (`/reward`)
- Live HXCO and TON balance cards with corner glow
- Referral gate info strip (requires 10 referrals to withdraw)
- Withdrawal form (TON or HXCO, wallet address, amount)
  - 15-day cooldown enforced from last confirmed withdrawal
  - `create_withdrawal` RPC atomically deducts balance and records request
- Withdrawal history list with status badges: Pending / Processing / Completed / Rejected / Failed

---

### Admin Panel (`/admin`)

Protected by localStorage session + `verifyAdmin` server action (checks `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars).

#### Dashboard Tab
- Summary cards: Total Users, Active Users (30d), Total Withdrawals, Pending Withdrawals, Completed, HXCO Distributed, Hex Opens Today
- Data via `get_dashboard_stats` RPC

#### Withdrawals Tab
- Table of all withdrawal requests with filters (status, search)
- **Approve** action: sets status → `confirmed`, records `tx_hash`
- **Reject** action: sets status → `rejected`, records reason, refunds balance
- Pagination

#### Users Tab
- Table of all registered users (Telegram username, name, status, role, balance)
- Search & filter by status
- **Edit user**: update name, email, role, status
- **View details**: full profile + withdrawal history
- **Adjust balance**: manually credit/debit HXCO or TON
- Pagination

#### Hex Permissions Tab
- Per-user permission overrides for Hex Chase
- Fields: `daily_limit`, `ad_required`, `ton_cost`, `is_banned`
- Create, edit, delete permissions
- Filter by username / status

#### Tasks Tab
- Create / edit / delete tasks
- Fields: title, description, reward (HXCO + TON), type (one_time / daily), action URL, action type, icon, sort order, active toggle

#### Mini Games Tab
- Summary cards: total plays, plays today, total HXCO paid out
- Top 5 most-played games bar chart with emoji icons
- Refresh button

#### Settings Tab
- Placeholder for future app settings (min withdrawal amounts, fee rates, etc.)

---

## Database Schema

### Tables

```sql
users
  id              UUID PK
  telegram_id     BIGINT UNIQUE NOT NULL
  username        TEXT
  first_name      TEXT
  last_name       TEXT
  avatar_url      TEXT
  email           TEXT
  referral_code   TEXT UNIQUE          -- auto-generated: "HEX" + 8-char MD5 suffix
  status          TEXT                  -- active | inactive | banned | pending
  role            TEXT                  -- admin | sub-admin | user
  registered_at   TIMESTAMPTZ
  created_at      TIMESTAMPTZ

user_balances
  id              UUID PK
  user_id         UUID FK → users       UNIQUE
  balance_hxco    DECIMAL(18,4) ≥ 0
  balance_ton     DECIMAL(18,8) ≥ 0
  updated_at      TIMESTAMPTZ           -- auto-updated by trigger

hex_permissions
  id              UUID PK
  user_id         UUID FK → users       UNIQUE
  daily_limit     INTEGER DEFAULT 2
  ad_required     INTEGER DEFAULT 0
  ton_cost        DECIMAL(10,4) DEFAULT 0
  is_banned       BOOLEAN DEFAULT false

game_sessions                          -- every Hex Chase tile opening
  id              UUID PK
  user_id         UUID FK → users
  hex_index       INTEGER
  reward_type     TEXT                  -- HXCO | TON | Discount | Free Hex | Empty
  reward_value    DECIMAL(18,8)
  opened_at       TIMESTAMPTZ

mini_games                             -- every mini game play
  id              UUID PK
  user_id         UUID FK → users
  game_type       TEXT                  -- one of 10 game slugs
  score           INTEGER
  reward_hxco     INTEGER
  played_at       TIMESTAMPTZ

withdrawals
  id              UUID PK
  user_id         UUID FK → users
  amount          DECIMAL(18,8) > 0
  currency        TEXT                  -- TON | HXCO
  address         TEXT
  request_date    TIMESTAMPTZ
  status          TEXT                  -- pending | processing | confirmed | rejected | failed
  tx_hash         TEXT
  reason          TEXT

user_referrals
  id              UUID PK
  referrer_id     UUID FK → users
  referred_id     UUID FK → users       UNIQUE
  rewarded        BOOLEAN DEFAULT false
  created_at      TIMESTAMPTZ

tasks
  id              UUID PK
  title           TEXT
  description     TEXT
  reward_hxco     INTEGER ≥ 0
  reward_ton      DECIMAL(10,8)
  task_type       TEXT                  -- one_time | daily
  action_url      TEXT
  action_type     TEXT                  -- link | telegram | twitter | none
  icon            TEXT                  -- Lucide icon name
  sort_order      INTEGER
  is_active       BOOLEAN DEFAULT true

user_tasks
  id              UUID PK
  user_id         UUID FK → users
  task_id         UUID FK → tasks
  completed_at    TIMESTAMPTZ
  rewarded        BOOLEAN
  UNIQUE (user_id, task_id)
```

### Indexes

```sql
idx_game_sessions_user_date    ON game_sessions(user_id, opened_at DESC)
idx_withdrawals_user_status    ON withdrawals(user_id, status, request_date DESC)
idx_user_referrals_referrer    ON user_referrals(referrer_id)
idx_user_tasks_user            ON user_tasks(user_id)
idx_mini_games_user_date       ON mini_games(user_id, played_at DESC)
idx_mini_games_game_type       ON mini_games(game_type)
```

---

## RPC Functions

All functions run as `SECURITY DEFINER` (bypass RLS, run with owner privileges).

### `open_hex(user_id, hex_index, reward_type, reward_value)`
1. Fetches `hex_permissions` — raises `user_banned` or `permission_not_found`
2. Counts today's `game_sessions` — raises `daily_limit_reached` if at cap
3. Inserts `game_sessions` row
4. Credits `user_balances` atomically (HXCO or TON)
5. Returns `{ success, opens_today, daily_limit }`

### `play_mini_game(user_id, game_type, score, reward_hxco, daily_limit=3)`
1. Counts today's `mini_games` rows for this `game_type`
2. Raises `daily_limit_reached` if at cap
3. Inserts `mini_games` row
4. Credits `balance_hxco` if `reward_hxco > 0`
5. Returns `{ success, plays_today, daily_limit }`

### `create_withdrawal(user_id, amount, address, currency='TON')`
1. Attempts to deduct `amount` from `balance_ton` or `balance_hxco` (atomic UPDATE with balance check)
2. Raises `insufficient_balance` if rows updated = 0
3. Inserts `withdrawals` row

### `complete_task(user_id, task_id)`
1. Fetches active task — raises `task_not_found`
2. Checks `one_time` already completed → raises `already_completed`
3. Checks `daily` completed today → raises `already_completed_today`
4. Inserts `user_tasks` row (upsert for daily)
5. Credits HXCO and/or TON atomically
6. Returns `{ success, reward_hxco, reward_ton }`

### `get_dashboard_stats()`
Returns JSON with: `totalUsers`, `activeUsers`, `totalWithdrawals`, `pendingWithdrawals`, `completedWithdrawals`, `totalHxcoDistributed`, `hexOpensToday`

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### Required

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe to expose) | Supabase Dashboard → Project Settings → API |
| `ADMIN_EMAIL` | Admin login email for the admin panel | Set to any email you choose |
| `ADMIN_PASSWORD` | Admin login password | Set a strong password |
| `NEXT_PUBLIC_APP_URL` | Full URL where your app is hosted | e.g. `https://your-app.vercel.app` |
| `BOT_TOKEN` | Telegram bot token | [@BotFather](https://t.me/BotFather) → `/newbot` |

### Optional (future)

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key for admin-level DB access | Supabase → Settings → API |
| `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` | TonConnect manifest JSON URL | Your hosted `tonconnect-manifest.json` |

### Full `.env.local` example

```env
# ── Supabase ────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# ── Admin panel credentials ─────────────────────────────
ADMIN_EMAIL=admin@hexacoin.app
ADMIN_PASSWORD=SuperSecurePassword123!

# ── App ─────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# ── Telegram Bot ────────────────────────────────────────
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUVwxyz
```

> **Security note:** `ADMIN_EMAIL` and `ADMIN_PASSWORD` are server-only and never sent to the client. `BOT_TOKEN` must never be committed to git or exposed client-side.

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- A [Supabase](https://supabase.com) project (free tier works)
- A [Telegram Bot](https://t.me/BotFather) token

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/nadirhussain786/hexa-coin.git
cd hexa-coin

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Run database migrations (see section below)

# 5. Start development server
npm run dev
# App is at http://localhost:3000
# Admin panel is at http://localhost:3000/admin
```

---

## Database Migrations

Run each SQL file in the Supabase Dashboard **SQL Editor** in order, or use the Supabase CLI.

### Using Supabase Dashboard

1. Open your project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Run each file in order:

```
supabase/migrations/001_initial_schema.sql   ← tables & triggers
supabase/migrations/002_rpc_functions.sql    ← RPC stored procedures
supabase/migrations/003_seed.sql             ← default tasks
supabase/migrations/004_rls.sql              ← Row Level Security policies
supabase/migrations/005_mini_games.sql       ← mini_games table + play_mini_game RPC
```

### Using Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push
```

### Seed Data (`003_seed.sql`)

Creates 5 default tasks:
- Follow us on Twitter (+50 HXCO, one-time)
- Join our Telegram (+100 HXCO, one-time)
- Invite a Friend (+75 HXCO, one-time)
- Open your first Hex (+25 HXCO, one-time)
- Daily Login Bonus (+10 HXCO, daily)

You can add more tasks via the admin panel → Tasks tab.

---

## Project Structure

```
hexa-coin/
├── app/
│   ├── (app)/                          # User-facing app (route group)
│   │   ├── layout.tsx                  # TonConnect provider + UserContext + nav
│   │   ├── page.tsx                    # Home: balance cards + Hex Chase CTA
│   │   ├── components/
│   │   │   └── HexHeader.tsx           # Fixed header with live HXCO balance
│   │   ├── games/
│   │   │   ├── page.tsx                # Games hub (re-exports GamePage)
│   │   │   ├── components/
│   │   │   │   ├── GamePage.tsx        # Games grid (11 games)
│   │   │   │   ├── GameAdGate.tsx      # Ad gate with SVG ring countdown
│   │   │   │   └── GameRewardDialog.tsx # Reward dialog with confetti
│   │   │   ├── hex-chase/              # Flagship hex-tile game
│   │   │   ├── memory-match/
│   │   │   ├── tap-hex/
│   │   │   ├── rock-paper-scissors/
│   │   │   ├── math-quiz/
│   │   │   ├── color-sequence/
│   │   │   ├── reflex-test/
│   │   │   ├── number-guess/
│   │   │   ├── word-scramble/
│   │   │   ├── coin-flip/
│   │   │   └── spin-wheel/
│   │   ├── task/
│   │   │   ├── page.tsx                # Task list with progress bar
│   │   │   └── components/TaskCard.tsx
│   │   ├── invite/
│   │   │   └── components/InvitePage.tsx  # Referral with SVG progress ring
│   │   └── reward/
│   │       └── components/
│   │           ├── RewardPage.tsx       # Balance + withdrawal UI
│   │           ├── WithdrawalForm.tsx   # Withdrawal form
│   │           └── WithdrawalHistory.tsx
│   ├── admin/                          # Admin panel (protected)
│   │   ├── page.tsx
│   │   ├── actions/                    # Admin-only server actions
│   │   └── components/
│   │       ├── AdminDashboard.tsx      # Main tabbed admin layout
│   │       ├── MiniGameStats.tsx       # Mini games analytics
│   │       ├── UserManagement.tsx
│   │       ├── WithdrawalManagement/
│   │       ├── HexPermission/
│   │       └── TaskManagement.tsx
│   ├── actions/                        # Shared server actions
│   │   ├── addOrGetTelegramUser.ts     # Upsert user on login
│   │   ├── recordHexOpen.ts            # Calls open_hex RPC
│   │   ├── playMiniGame.ts             # Calls play_mini_game RPC
│   │   ├── getUserTasks.ts             # Tasks with completion status
│   │   ├── completeTask.ts             # Calls complete_task RPC
│   │   ├── getWithdrawals.ts           # User withdrawal history
│   │   └── getUserData.ts              # Full user profile + balance + permission
│   ├── globals.css                     # Cosmic design tokens + keyframes
│   └── layout.tsx                      # Root layout
├── components/
│   ├── HexTabs.tsx                     # Bottom navigation bar
│   ├── TonConnectProvider.tsx          # TonConnect UI wrapper
│   └── ui/                             # shadcn/ui components
├── contexts/
│   └── user-context.tsx                # UserContext (user, balance, permission)
├── hooks/
│   ├── use-mini-game.ts                # Game state + finishGame + reward calc
│   ├── use-telegram-user.ts            # Telegram SDK identity hook
│   ├── use-toast.ts
│   └── use-window-size.ts
├── lib/
│   ├── animations.ts                   # Framer Motion variants
│   └── utils.ts                        # cn() + helpers
├── types/
│   └── index.ts                        # All TypeScript interfaces
├── utils/
│   └── supabase/
│       ├── client.ts                   # Browser Supabase client
│       └── server.ts                   # Server Supabase client (uses cookies)
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rpc_functions.sql
│       ├── 003_seed.sql
│       ├── 004_rls.sql
│       └── 005_mini_games.sql
├── bot/
│   └── start-bot.js                    # Telegram bot (launch button)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── .env.example
```

---

## Server Actions Reference

### User Actions (`app/actions/`)

| Action | Description |
|--------|-------------|
| `addOrGetTelegramUser(tgUser)` | Upserts user by `telegram_id`, auto-creates `user_balances` + `hex_permissions` |
| `getUserData(telegramId)` | Returns full user object + balance + hex permission |
| `getUserBalanceById(userId)` | Returns `user_balances` row |
| `recordHexOpen(userId, hexIndex, rewardType, rewardValue)` | Calls `open_hex` RPC |
| `getRecentSessions(userId, limit)` | Last N `game_sessions` |
| `playMiniGame(userId, gameType, score, rewardHxco)` | Calls `play_mini_game` RPC |
| `getMiniGamePlaysToday(userId, gameType)` | Count of today's plays for daily-limit UI |
| `getMiniGameStats()` | Admin: total plays, today's plays, HXCO paid, top 5 games |
| `getUserTasks(userId)` | Tasks with per-user completion status |
| `completeTask(userId, taskId)` | Calls `complete_task` RPC |
| `getWithdrawals(userId)` | User's withdrawal history |
| `createWithdrawal(userId, amount, address, currency)` | Calls `create_withdrawal` RPC |

### Admin Actions (`app/admin/actions/`)

| Action | Description |
|--------|-------------|
| `verifyAdmin(email, password)` | Validates against env vars, returns session |
| `getDashboardStats()` | Calls `get_dashboard_stats` RPC |
| `getUsersTableData()` | All users with balances |
| `updateUser(userId, data)` | Update user fields |
| `updateUserBalance(userId, hxco, ton)` | Manual balance adjustment |
| `getAllWithdrawals()` | All withdrawals for admin |
| `confirmWithdrawals(id, txHash)` | Set status = confirmed |
| `rejectWithdrawal(id, reason)` | Set status = rejected, refund balance |
| `getAllPermission()` | All hex permissions |
| `addHexPermission(data)` | Create new hex permission |
| `updateHexPermission(id, data)` | Update permission |
| `deleteHexPermission(id)` | Delete permission |
| `getTasks()` | All tasks |
| `createTask(data)` | Create new task |
| `updateTask(id, data)` | Update task |
| `deleteTask(id)` | Delete task |

---

## Telegram Bot

Located in `bot/start-bot.js`. Sends a launch button when a user starts the bot.

```js
// Listens for /start, replies with Web App button
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎮 Open Hexa Coin to start playing!', {
    reply_markup: {
      inline_keyboard: [[{
        text: '🚀 Open App',
        web_app: { url: process.env.NEXT_PUBLIC_APP_URL }
      }]]
    }
  })
})
```

Run the bot separately (not part of Next.js):

```bash
node bot/start-bot.js
```

Or deploy to a VPS / Railway / Fly.io alongside your Next.js app.

---

## Design System

### Color Palette (Cosmic Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `cosmic-bg` | `#080514` | Page background |
| `cosmic-card` | `#110D2A` | Card surfaces |
| `cosmic-surface` | `#1A1438` | Elevated elements |
| `cosmic-surface2` | `#221852` | Highest elevation |
| `cosmic-accent` | `#7C3AED` | Primary purple (CTA, active states) |
| `cosmic-highlight` | `#A855F7` | Bright purple (nav active, text) |
| `cosmic-secondary` | `#F43F5E` | Rose-red (error, locked states) |
| `cosmic-tertiary` | `#06B6D4` | Sky cyan (TON balance, cyan glow) |
| `cosmic-gold` | `#F59E0B` | Amber gold (HXCO, rewards) |
| `cosmic-text` | `#F1F5F9` | Primary text |
| `cosmic-muted` | `#94A3B8` | Secondary text, labels |
| `cosmic-border` | `#2D1B69` | Subtle borders |

### CSS Utilities

| Class | Effect |
|-------|--------|
| `.text-gradient` | Purple→violet→cyan gradient text |
| `.text-gradient-gold` | Amber→gold gradient text |
| `.text-gradient-cyan` | Cyan→sky gradient text |
| `.cosmic-glow` | Purple box shadow glow |
| `.cosmic-glow-gold` | Gold box shadow glow |
| `.cosmic-glow-cyan` | Cyan box shadow glow |
| `.glass-card` | Glassmorphism card (blur + gradient bg) |
| `.shimmer-card` | Animated diagonal shimmer sweep |
| `.hex-clip` | Hexagon clip-path shape |
| `.pulse-ring` | Expanding ring animation |
| `.float-slow/.med/.fast` | Vertical floating animations |

### Animation System (`lib/animations.ts`)

Framer Motion variants used across all pages:

| Variant | Usage |
|---------|-------|
| `fadeUp` | Page sections, cards |
| `staggerContainer` | Parent that staggers children by 75 ms |
| `scaleIn` | Modals, dialogs |
| `popIn` | Trophy, reward orbs |
| `cardEntrance` | Game cards, stats |
| `listItem` | List rows (task cards, withdrawal history) |
| `bounceIn` | Icon badges |
| `pageTransition` | Route change transitions |
| `dialogVariants` | Dialog open/close |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy

Vercel automatically handles Next.js Server Actions, no extra config needed.

### Environment Variables on Vercel

Set in **Project Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ADMIN_EMAIL
ADMIN_PASSWORD
NEXT_PUBLIC_APP_URL        (set after first deploy to get your URL)
BOT_TOKEN
```

### Telegram Mini App Registration

1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. `/newbot` → follow prompts to create your bot
3. `/newapp` → link your bot to the web app URL
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
5. Set `BOT_TOKEN` to the token BotFather gave you

### Production Checklist

- [ ] All 5 SQL migration files run in Supabase
- [ ] RLS enabled on all tables (`004_rls.sql`)
- [ ] `ADMIN_PASSWORD` set to a strong password (not `change-me-in-production`)
- [ ] `NEXT_PUBLIC_APP_URL` points to your production domain
- [ ] Telegram bot configured with the web app URL
- [ ] Supabase project is on a plan that supports your expected traffic

---

## Contributing

This is a private project. Branch: `nadir/pro-redesign`. Main branch: `main`.

---

*Built with Next.js 15, Supabase, TonConnect, and Framer Motion.*
