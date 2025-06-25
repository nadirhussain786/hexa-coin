export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  }

  interface TelegramWebAppInitDataUnsafe {
    user?: TelegramWebAppUser;
    auth_date?: string;
    hash?: string;
    [key: string]: any;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramWebAppInitDataUnsafe;
    version: string;
    platform: string;
    isExpanded: boolean;
    isClosingConfirmationEnabled: boolean;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (message: string, callback: (ok: boolean) => void) => void;
    onEvent: (eventType: string, callback: (...args: any[]) => void) => void;
    offEvent: (eventType: string, callback: (...args: any[]) => void) => void;
    ready: () => void;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
