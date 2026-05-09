import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /**
   * GitHub Pages project site: без завершающего `/` в URL относительные `./assets/` резолвятся в корень домена
   * (`github.io/assets/…`) — скрипты не грузятся. Абсолютный `/ИмяРепо/` работает всегда.
   * Локально: `/`. Переопределение: VITE_BASE_PATH.
   */
  const base =
    env.VITE_BASE_PATH?.trim() || (mode === 'production' ? '/Shifr-serdca/' : '/')

  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/musicbrainz-ws': {
          target: 'https://musicbrainz.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/musicbrainz-ws/, '/ws/2'),
        },
      },
    },
  }
})
