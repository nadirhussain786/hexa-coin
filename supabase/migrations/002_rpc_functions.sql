-- ============================================================
-- 002_rpc_functions.sql
-- Stored procedures for atomic game & withdrawal operations
-- ============================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS set_updated_at_balances
  BEFORE UPDATE ON user_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS set_updated_at_permissions
  BEFORE UPDATE ON hex_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── open_hex RPC ────────────────────────────────────────────────────────────
-- Called when a user opens a hex tile.
-- Checks daily limit, records the session, credits balance.
-- Returns JSON with result or raises an exception on failure.
CREATE OR REPLACE FUNCTION open_hex(
  p_user_id     UUID,
  p_hex_index   INTEGER,
  p_reward_type TEXT,
  p_reward_value DECIMAL
) RETURNS JSON AS $$
DECLARE
  v_perm        hex_permissions%ROWTYPE;
  v_today_count INTEGER;
BEGIN
  -- Fetch permission
  SELECT * INTO v_perm FROM hex_permissions WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'permission_not_found';
  END IF;

  -- Check ban
  IF v_perm.is_banned THEN
    RAISE EXCEPTION 'user_banned';
  END IF;

  -- Count today's openings
  SELECT COUNT(*) INTO v_today_count
  FROM game_sessions
  WHERE user_id = p_user_id
    AND opened_at >= CURRENT_DATE
    AND opened_at < CURRENT_DATE + INTERVAL '1 day';

  -- Enforce daily limit
  IF v_today_count >= v_perm.daily_limit THEN
    RAISE EXCEPTION 'daily_limit_reached';
  END IF;

  -- Record the session
  INSERT INTO game_sessions (user_id, hex_index, reward_type, reward_value)
  VALUES (p_user_id, p_hex_index, p_reward_type, p_reward_value);

  -- Credit balance
  IF p_reward_type = 'HXCO' AND p_reward_value > 0 THEN
    UPDATE user_balances
    SET balance_hxco = balance_hxco + p_reward_value, updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF p_reward_type = 'TON' AND p_reward_value > 0 THEN
    UPDATE user_balances
    SET balance_ton = balance_ton + p_reward_value, updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN json_build_object(
    'success',      true,
    'opens_today',  v_today_count + 1,
    'daily_limit',  v_perm.daily_limit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── create_withdrawal RPC ───────────────────────────────────────────────────
-- Atomically deducts balance and inserts a withdrawal record.
CREATE OR REPLACE FUNCTION create_withdrawal(
  p_user_id  UUID,
  p_amount   DECIMAL,
  p_address  TEXT,
  p_currency TEXT DEFAULT 'TON'
) RETURNS VOID AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  IF p_currency = 'TON' THEN
    UPDATE user_balances
    SET balance_ton = balance_ton - p_amount, updated_at = NOW()
    WHERE user_id = p_user_id AND balance_ton >= p_amount;
  ELSE
    UPDATE user_balances
    SET balance_hxco = balance_hxco - p_amount, updated_at = NOW()
    WHERE user_id = p_user_id AND balance_hxco >= p_amount;
  END IF;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated = 0 THEN
    RAISE EXCEPTION 'insufficient_balance';
  END IF;

  INSERT INTO withdrawals (user_id, amount, currency, address)
  VALUES (p_user_id, p_amount, p_currency, p_address);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── complete_task RPC ───────────────────────────────────────────────────────
-- Atomically marks a task complete and credits reward.
CREATE OR REPLACE FUNCTION complete_task(
  p_user_id UUID,
  p_task_id UUID
) RETURNS JSON AS $$
DECLARE
  v_task       tasks%ROWTYPE;
  v_already    BOOLEAN;
BEGIN
  SELECT * INTO v_task FROM tasks WHERE id = p_task_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'task_not_found';
  END IF;

  -- Check if already completed (for one_time tasks)
  IF v_task.task_type = 'one_time' THEN
    SELECT EXISTS (
      SELECT 1 FROM user_tasks WHERE user_id = p_user_id AND task_id = p_task_id
    ) INTO v_already;
    IF v_already THEN
      RAISE EXCEPTION 'already_completed';
    END IF;
  END IF;

  -- For daily tasks, check if completed today already
  IF v_task.task_type = 'daily' THEN
    SELECT EXISTS (
      SELECT 1 FROM user_tasks
      WHERE user_id = p_user_id AND task_id = p_task_id
        AND completed_at >= CURRENT_DATE
    ) INTO v_already;
    IF v_already THEN
      RAISE EXCEPTION 'already_completed_today';
    END IF;
  END IF;

  -- Record completion
  INSERT INTO user_tasks (user_id, task_id, rewarded)
  VALUES (p_user_id, p_task_id, true)
  ON CONFLICT (user_id, task_id) DO UPDATE SET completed_at = NOW(), rewarded = true;

  -- Credit HXCO reward
  IF v_task.reward_hxco > 0 THEN
    UPDATE user_balances
    SET balance_hxco = balance_hxco + v_task.reward_hxco, updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  -- Credit TON reward
  IF v_task.reward_ton > 0 THEN
    UPDATE user_balances
    SET balance_ton = balance_ton + v_task.reward_ton, updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN json_build_object(
    'success',      true,
    'reward_hxco',  v_task.reward_hxco,
    'reward_ton',   v_task.reward_ton
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── get_dashboard_stats RPC ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  v_total_users         INTEGER;
  v_active_users        INTEGER;
  v_total_withdrawals   DECIMAL;
  v_pending_withdrawals DECIMAL;
  v_completed_withdrawals DECIMAL;
  v_hxco_distributed   DECIMAL;
  v_opens_today        INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total_users FROM users;
  SELECT COUNT(*) INTO v_active_users FROM users
    WHERE status = 'active'
      AND registered_at >= NOW() - INTERVAL '30 days';
  SELECT COALESCE(SUM(amount), 0) INTO v_total_withdrawals FROM withdrawals;
  SELECT COALESCE(SUM(amount), 0) INTO v_pending_withdrawals
    FROM withdrawals WHERE status = 'pending';
  SELECT COALESCE(SUM(amount), 0) INTO v_completed_withdrawals
    FROM withdrawals WHERE status = 'confirmed';
  SELECT COALESCE(SUM(reward_value), 0) INTO v_hxco_distributed
    FROM game_sessions WHERE reward_type = 'HXCO';
  SELECT COUNT(*) INTO v_opens_today
    FROM game_sessions WHERE opened_at >= CURRENT_DATE;

  RETURN json_build_object(
    'totalUsers',            v_total_users,
    'activeUsers',           v_active_users,
    'totalWithdrawals',      v_total_withdrawals,
    'pendingWithdrawals',    v_pending_withdrawals,
    'completedWithdrawals',  v_completed_withdrawals,
    'totalHxcoDistributed',  v_hxco_distributed,
    'hexOpensToday',         v_opens_today
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
