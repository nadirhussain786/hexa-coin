-- ============================================================
-- 004_rls.sql
-- Row Level Security policies
-- Apply AFTER schema & functions are set up.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hex_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks     ENABLE ROW LEVEL SECURITY;

-- ─── users ────────────────────────────────────────────────────────────────────
-- Anyone can insert (registration). Users read their own row.
-- Service role (admin) bypasses RLS entirely.
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_select_own" ON users FOR SELECT
  USING (telegram_id::TEXT = current_setting('app.telegram_id', true));
CREATE POLICY "users_update_own" ON users FOR UPDATE
  USING (telegram_id::TEXT = current_setting('app.telegram_id', true));

-- ─── user_balances ────────────────────────────────────────────────────────────
CREATE POLICY "balances_select_own" ON user_balances FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- ─── hex_permissions ──────────────────────────────────────────────────────────
CREATE POLICY "permissions_select_own" ON hex_permissions FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- ─── game_sessions ────────────────────────────────────────────────────────────
CREATE POLICY "sessions_select_own" ON game_sessions FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- ─── withdrawals ──────────────────────────────────────────────────────────────
CREATE POLICY "withdrawals_select_own" ON withdrawals FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- ─── user_referrals ───────────────────────────────────────────────────────────
CREATE POLICY "referrals_select_own" ON user_referrals FOR SELECT
  USING (referrer_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- ─── tasks (public read) ──────────────────────────────────────────────────────
CREATE POLICY "tasks_select_all" ON tasks FOR SELECT USING (is_active = true);

-- ─── user_tasks ───────────────────────────────────────────────────────────────
CREATE POLICY "user_tasks_select_own" ON user_tasks FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE telegram_id::TEXT = current_setting('app.telegram_id', true)
  ));

-- NOTE: All INSERT/UPDATE/DELETE on protected tables go through
-- SECURITY DEFINER RPC functions (open_hex, create_withdrawal, complete_task)
-- which run as the service role and bypass RLS.
-- The anon key cannot directly mutate data — only read own rows.
