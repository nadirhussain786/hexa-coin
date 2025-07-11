export function getTelegramUser() {
  return window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}
