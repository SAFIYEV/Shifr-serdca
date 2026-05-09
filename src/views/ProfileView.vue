<script setup lang="ts">
import { computed } from 'vue'
import WebApp from '@twa-dev/sdk'
import { useTelegramUser } from '@/composables/useTelegram'

const { user, colorScheme } = useTelegramUser()

const name = computed(() => {
  const u = user.value
  if (!u) return 'Гость'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || 'Telegram'
})

function openAudius() {
  window.open('https://audius.co', '_blank', 'noopener,noreferrer')
}

function openMb() {
  window.open('https://musicbrainz.org', '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="page">
    <header class="card mf-glass">
      <div class="avatar" aria-hidden="true">
        {{ name.slice(0, 1).toUpperCase() }}
      </div>
      <div class="meta">
        <div class="t1">{{ name }}</div>
        <div class="t2">
          Telegram Mini App • {{ colorScheme }}
          <span v-if="user?.username"> • @{{ user.username }}</span>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="h">MarrFY</div>
      <p class="p">
        Плеер на <strong>Howler.js</strong>, каталог через <strong>Audius</strong>, метаданные через
        <strong>MusicBrainz</strong>, избранное — <strong>Firebase Firestore</strong> (опционально).
      </p>

      <div class="actions">
        <button type="button" class="btn" @click="WebApp.showPopup?.({ title: 'MarrFY', message: 'Приятного прослушивания!', buttons: [{ id: 'ok', type: 'ok' }] })">
          Тест Telegram UI
        </button>
        <button type="button" class="btn btn--ghost" @click="WebApp.openLink?.('https://github.com/SAFIYEV/Shifr-serdca')">
          Репозиторий
        </button>
      </div>
    </section>

    <section class="section">
      <div class="h">Источники</div>
      <div class="links">
        <button type="button" class="link" @click="openAudius">Audius</button>
        <button type="button" class="link" @click="openMb">MusicBrainz</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding: calc(12px + var(--mf-safe-top)) 14px 18px;
  max-width: 760px;
  margin: 0 auto;
}

.card {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--mf-line);
  box-shadow: var(--mf-shadow);
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 950;
  font-size: 22px;
  background: radial-gradient(circle at 30% 25%, #7aaefc, #3390ec 55%, #175fb8);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.meta {
  min-width: 0;
}

.t1 {
  font-weight: 950;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.t2 {
  margin-top: 6px;
  font-size: 12px;
  color: var(--mf-muted);
  line-height: 1.35;
}

.section {
  margin-top: 16px;
  border: 1px solid var(--mf-line);
  border-radius: 18px;
  padding: 14px;
  background: rgba(44, 44, 46, 0.22);
}

.h {
  font-weight: 950;
  font-size: 15px;
  margin-bottom: 10px;
}

.p {
  margin: 0;
  color: var(--mf-muted);
  font-size: 13px;
  line-height: 1.55;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid rgba(51, 144, 236, 0.35);
  background: var(--mf-blue-soft);
  color: var(--mf-text);
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 750;
}

.btn--ghost {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--mf-line);
}

.links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link {
  border: 1px solid var(--mf-line);
  background: rgba(255, 255, 255, 0.05);
  color: var(--mf-blue);
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
}
</style>
