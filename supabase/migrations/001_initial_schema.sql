-- ============================================================
-- 001_initial_schema.sql
-- Core tables for Hexa Coin Telegram Mini App
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id     BIGINT UNIQUE NOT NULL,
  username        TEXT,
  first_name      TEXT,
  last_name       TEXT,
  avatar_url      TEXT,
  email           TEXT,
  referral_code   TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'inactive', 'banned', 'pending')),
  role            TEXT NOT NULL DEFAULT 'user'
                  CHECK (role IN ('admin', 'sub-admin', 'user')),
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate a referral code based on telegram_id if not provided
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'HEX' || UPPER(SUBSTRING(MD5(NEW.telegram_id::TEXT || gen_random_uuid()::TEXT), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- User balances (1:1 with users)
CREATE TABLE IF NOT EXISTS user_balances (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance_hxco  DECIMAL(18, 4) NOT NULL DEFAULT 0 CHECK (balance_hxco >= 0),
  balance_ton   DECIMAL(18, 8) NOT NULL DEFAULT 0 CHECK (balance_ton >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hex permissions (1:1 with users, controls game access)
CREATE TABLE IF NOT EXISTS hex_permissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  daily_limit  INTEGER NOT NULL DEFAULT 2 CHECK (daily_limit >= 0),
  ad_required  INTEGER NOT NULL DEFAULT 0 CHECK (ad_required >= 0),
  ton_cost     DECIMAL(10, 4) NOT NULL DEFAULT 0 CHECK (ton_cost >= 0),
  is_banned    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game sessions (every hex tile opening)
CREATE TABLE IF NOT EXISTS game_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hex_index    INTEGER NOT NULL,
  reward_type  TEXT NOT NULL
               CHECK (reward_type IN ('HXCO', 'TON', 'Discount', 'Free Hex', 'Empty')),
  reward_value DECIMAL(18, 8) NOT NULL DEFAULT 0,
  opened_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_date
  ON game_sessions (user_id, opened_at DESC);

-- Withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount                DECIMAL(18, 8) NOT NULL CHECK (amount > 0),
  currency              TEXT NOT NULL DEFAULT 'TON'
                        CHECK (currency IN ('TON', 'HXCO')),
  address               TEXT NOT NULL,
  request_date          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'processing', 'confirmed', 'rejected', 'failed')),
  tx_hash               TEXT,
  reason                TEXT,
  last_withdrawal_date  TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_status
  ON withdrawals (user_id, status, request_date DESC);

-- Referrals
CREATE TABLE IF NOT EXISTS user_referrals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  rewarded    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer
  ON user_referrals (referrer_id);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  reward_hxco  INTEGER NOT NULL DEFAULT 0 CHECK (reward_hxco >= 0),
  reward_ton   DECIMAL(10, 8) NOT NULL DEFAULT 0,
  task_type    TEXT NOT NULL DEFAULT 'one_time'
               CHECK (task_type IN ('one_time', 'daily')),
  action_url   TEXT,
  action_type  TEXT DEFAULT 'link'
               CHECK (action_type IN ('link', 'telegram', 'twitter', 'none')),
  icon         TEXT DEFAULT 'Star',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User task completions
CREATE TABLE IF NOT EXISTS user_tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id      UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rewarded     BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tasks_user
  ON user_tasks (user_id);
