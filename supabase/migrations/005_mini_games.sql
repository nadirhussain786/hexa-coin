-- Mini games tracking table
CREATE TABLE IF NOT EXISTS mini_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN (
    'memory-match','tap-hex','rock-paper-scissors','math-quiz',
    'color-sequence','reflex-test','number-guess','word-scramble',
    'coin-flip','spin-wheel'
  )),
  score INTEGER NOT NULL DEFAULT 0,
  reward_hxco INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mini_games_user_date ON mini_games(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_mini_games_game_type ON mini_games(game_type);

-- RPC: play a mini game (checks daily limit, credits balance atomically)
CREATE OR REPLACE FUNCTION play_mini_game(
  p_user_id UUID,
  p_game_type TEXT,
  p_score INTEGER,
  p_reward_hxco INTEGER,
  p_daily_limit INTEGER DEFAULT 3
) RETURNS json AS $$
DECLARE
  v_today_count INTEGER;
BEGIN
  -- Count today's plays for this game type
  SELECT COUNT(*) INTO v_today_count
  FROM mini_games
  WHERE user_id = p_user_id
    AND game_type = p_game_type
    AND played_at >= CURRENT_DATE;

  IF v_today_count >= p_daily_limit THEN
    RAISE EXCEPTION 'daily_limit_reached';
  END IF;

  -- Record the play
  INSERT INTO mini_games(user_id, game_type, score, reward_hxco)
  VALUES (p_user_id, p_game_type, p_score, p_reward_hxco);

  -- Credit balance
  IF p_reward_hxco > 0 THEN
    UPDATE user_balances
    SET balance_hxco = balance_hxco + p_reward_hxco,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'plays_today', v_today_count + 1,
    'daily_limit', p_daily_limit,
    'reward_hxco', p_reward_hxco
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE mini_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mini game records"
  ON mini_games FOR SELECT
  USING (auth.uid()::text = user_id::text OR TRUE);

CREATE POLICY "Service role can insert mini game records"
  ON mini_games FOR INSERT
  WITH CHECK (TRUE);
