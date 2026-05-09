/** Нативный Telegram WebApp без пакета @twa-dev/sdk — меньше точек отказа в WebView. */

export interface TgUser {
  id?: number
  first_name?: string
  last_name?: string
  username?: string
}

export interface TelegramWebAppLike {
  ready: () => void
  expand: () => void
  disableVerticalSwipes?: () => void
  themeParams: Record<string, string | undefined>
  initDataUnsafe?: { user?: TgUser }
  colorScheme?: 'light' | 'dark'
  showPopup?: (params: {
    title?: string
    message?: string
    buttons?: { id?: string; type?: string }[]
  }) => void
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void
}

export function getTelegramWebApp(): TelegramWebAppLike | undefined {
  const w = globalThis as unknown as {
    Telegram?: { WebApp?: TelegramWebAppLike }
  }
  return w.Telegram?.WebApp
}
