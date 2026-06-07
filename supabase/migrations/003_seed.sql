-- ============================================================
-- 003_seed.sql
-- Default data for Hexa Coin
-- ============================================================

-- Default tasks
INSERT INTO tasks (title, description, reward_hxco, reward_ton, task_type, action_url, action_type, icon, sort_order)
VALUES
  (
    'Follow us on Twitter',
    'Follow @HexaCoin on Twitter to stay updated and earn HXCO rewards',
    50, 0, 'one_time',
    'https://twitter.com/hexacoin',
    'twitter', 'Twitter', 1
  ),
  (
    'Join our Telegram Group',
    'Join the official Hexa Coin Telegram community group',
    100, 0, 'one_time',
    'https://t.me/hexacoin',
    'telegram', 'MessageCircle', 2
  ),
  (
    'Join our Telegram Channel',
    'Subscribe to the Hexa Coin announcement channel for news',
    50, 0, 'one_time',
    'https://t.me/hexacoinnews',
    'telegram', 'Bell', 3
  ),
  (
    'Invite a Friend',
    'Share your referral link and earn when a friend joins Hexa Coin',
    75, 0, 'one_time',
    null,
    'none', 'Users', 4
  ),
  (
    'Open Your First Hex',
    'Open any hex tile in the Hex Chase game for the first time',
    25, 0, 'one_time',
    null,
    'none', 'Hexagon', 5
  ),
  (
    'Open 5 Hex Tiles',
    'Open 5 hex tiles total across any sessions',
    50, 0, 'one_time',
    null,
    'none', 'Grid', 6
  ),
  (
    'Daily Login Bonus',
    'Log in and visit the app every day to claim your daily HXCO bonus',
    10, 0, 'daily',
    null,
    'none', 'Calendar', 7
  ),
  (
    'Daily Hex Open',
    'Open at least one hex tile today',
    5, 0, 'daily',
    null,
    'none', 'Zap', 8
  )
ON CONFLICT DO NOTHING;
