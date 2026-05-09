import { computed } from 'vue'
import { getTelegramWebApp } from '@/lib/telegram-webapp'

export function initTelegramChrome(): void {
  const tg = getTelegramWebApp()
  try {
    tg?.ready()
    tg?.expand()
  } catch {
    /* ignore */
  }
  try {
    tg?.disableVerticalSwipes?.()
  } catch {
    /* ignore */
  }

  try {
    document.title = 'MarrFY'
  } catch {
    /* ignore */
  }

  const p = tg?.themeParams
  if (!p) return
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
  const user = computed(() => getTelegramWebApp()?.initDataUnsafe?.user)
  const colorScheme = computed(() => getTelegramWebApp()?.colorScheme)
  const webApp = computed(() => getTelegramWebApp())
  return { user, colorScheme, webApp }
}
