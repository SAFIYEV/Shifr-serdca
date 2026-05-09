import {
  applyPolyfills,
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
import { computed, onMounted, ref } from 'vue'

let bridgeReady = false

/**
 * Ранняя инициализация моста Telegram (до монтирования Vue).
 * `miniAppReady` вызывается отдельно после mount — чтобы Telegram убрал заглушку, когда интерфейс уже отрисован.
 */
export function initTelegramBridge(): void {
  if (bridgeReady) return

  try {
    applyPolyfills()
  } catch {
    /* старые WebView */
  }

  try {
    init()
  } catch {
    return
  }

  bridgeReady = true

  try {
    mountMiniAppSync.ifAvailable()
  } catch {
    /* вне Telegram */
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

/** Сообщить клиенту Telegram, что Mini App можно показывать (после первого кадра Vue). */
export function signalTelegramAppReady(): void {
  try {
    miniAppReady.ifAvailable()
  } catch {
    /* */
  }
}

export function useTelegramUser() {
  const user = ref(initDataUser())
  const colorScheme = ref<'light' | 'dark'>(isMiniAppDark() ? 'dark' : 'light')

  onMounted(() => {
    user.value = initDataUser()
    colorScheme.value = isMiniAppDark() ? 'dark' : 'light'
  })

  const userDisplay = computed(() => user.value)

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
    user: userDisplay,
    colorScheme,
    showPopup,
    openLink,
    openRepo,
    showWelcomePopup,
  }
}
