import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initTelegramBridge, signalTelegramAppReady } from './composables/useTelegram'
import { useFavoritesStore } from './stores/favorites'
import { useListeningStatsStore } from './stores/listeningStats'
import './styles/global.css'

try {
  initTelegramBridge()
} catch {
  /* не блокируем приложение вне Telegram */
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const fav = useFavoritesStore(pinia)
fav.bootstrap()
useListeningStatsStore(pinia)

app.mount('#app')

requestAnimationFrame(() => {
  signalTelegramAppReady()
})
