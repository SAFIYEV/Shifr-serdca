import WebApp from '@twa-dev/sdk'
import { computed } from 'vue'

export function initTelegramChrome(): void {
  try {
    WebApp.ready()
    WebApp.expand()
  } catch {
    /* вне Telegram или старый клиент */
  }
  try {
    WebApp.disableVerticalSwipes?.()
  } catch {
    /* optional API */
  }

  try {
    document.title = 'MarrFY'
  } catch {
    /* ignore */
  }

  const p = WebApp.themeParams
  if (p.bg_color) {
    document.documentElement.style.setProperty('--tg-theme-bg-color', p.bg_color)
  }
  if (p.text_color) {
    document.documentElement.style.setProperty('--tg-theme-text-color', p.text_color)
  }
  if (p.hint_color) {
    document.documentElement.style.setProperty('--tg-theme-hint-color', p.hint_color)
  }
  if (p.button_color) {
    document.documentElement.style.setProperty('--tg-theme-button-color', p.button_color)
  }
}

export function useTelegramUser() {
  const user = computed(() => WebApp.initDataUnsafe?.user)
  const colorScheme = computed(() => WebApp.colorScheme)
  return { WebApp, user, colorScheme }
}
