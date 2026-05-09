import {
  init,
  mountMiniAppSync,
  bindMiniAppCssVars,
  miniAppReady,
  mountViewport,
  expandViewport,
  mountSwipeBehavior,
  disableVerticalSwipes,
  initDataUser,
  isMiniAppDark,
  showPopup,
  openLink,
} from '@telegram-apps/sdk'
import { computed } from 'vue'

let initialized = false

/**
 * Инициализация Telegram Mini Apps через **@telegram-apps/sdk**
 * (документация: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x ).
 * Скрипт `telegram-web-app.js` подключён в index.html — SDK подписывается на события моста.
 */
export function initTelegramChrome(): void {
  if (initialized) return
  initialized = true

  try {
    init()
  } catch {
    return
  }

  try {
    mountMiniAppSync.ifAvailable()
  } catch {
    /* вне Telegram / старый клиент */
  }

  try {
    mountViewport.ifAvailable()
  } catch {
    /* */
  }

  try {
    mountSwipeBehavior.ifAvailable()
  } catch {
    /* */
  }

  try {
    disableVerticalSwipes.ifAvailable()
  } catch {
    /* */
  }

  try {
    bindMiniAppCssVars.ifAvailable()
  } catch {
    /* тема через CSS variables SDK */
  }

  try {
    miniAppReady.ifAvailable()
  } catch {
    /* */
  }

  try {
    expandViewport.ifAvailable()
  } catch {
    /* */
  }

  try {
    document.title = 'MarrFY'
  } catch {
    /* */
  }
}

export function useTelegramUser() {
  const user = computed(() => initDataUser())
  const colorScheme = computed(() => (isMiniAppDark() ? 'dark' : 'light'))

  function openRepo() {
    openLink.ifAvailable('https://github.com/SAFIYEV/Shifr-serdca', {})
  }

  function showWelcomePopup() {
    showPopup.ifAvailable({
      title: 'MarrFY',
      message: 'Приятного прослушивания!',
      buttons: [{ type: 'ok' }],
    })
  }

  return {
    user,
    colorScheme,
    showPopup,
    openLink,
    openRepo,
    showWelcomePopup,
  }
}
