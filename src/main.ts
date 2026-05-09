import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initTelegramChrome } from './composables/useTelegram'
import { useFavoritesStore } from './stores/favorites'
import './styles/global.css'

try {
  initTelegramChrome()
} catch {
  /* не блокируем монтирование */
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const fav = useFavoritesStore(pinia)
fav.bootstrap()

app.mount('#app')
