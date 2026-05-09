<script setup lang="ts">
import { computed } from 'vue'
import { useTelegramUser } from '@/composables/useTelegram'
import { useFavoritesStore } from '@/stores/favorites'
import { useListeningStatsStore } from '@/stores/listeningStats'

const { user } = useTelegramUser()
const fav = useFavoritesStore()
const listen = useListeningStatsStore()

const displayName = computed(() => {
  const u = user.value
  if (!u) return 'Гость'
  const parts = [u.first_name, u.last_name].filter(Boolean)
  if (parts.length) return parts.join(' ')
  if (u.username) return `@${u.username}`
  return 'Пользователь Telegram'
})

const avatarLetter = computed(() => displayName.value.slice(0, 1).toUpperCase())

const avatarUrl = computed(() => user.value?.photo_url ?? '')

const listenedPretty = computed(() => {
  const t = Math.floor(listen.totalListenedSec)
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  if (h > 0) return `${h} ч ${m} мин`
  if (m > 0) return `${m} мин`
  const s = t % 60
  return `${s} сек`
})
</script>

<template>
  <div class="page">
    <header class="hero mf-glass">
      <div class="avatar-wrap">
        <img v-if="avatarUrl" class="avatar avatar--img" :src="avatarUrl" alt="" />
        <div v-else class="avatar">{{ avatarLetter }}</div>
      </div>

      <div class="who">
        <h1 class="name">{{ displayName }}</h1>
        <p v-if="user?.username" class="username">@{{ user.username }}</p>
        <p v-else-if="user" class="muted">Имя пользователя скрыто</p>
        <p v-else class="muted">Откройте приложение из Telegram, чтобы подтянуть профиль</p>
      </div>
    </header>

    <section class="stats">
      <div class="stat mf-glass">
        <div class="stat__val">{{ listenedPretty }}</div>
        <div class="stat__lbl">Прослушано</div>
      </div>
      <div class="stat mf-glass">
        <div class="stat__val">{{ fav.items.length }}</div>
        <div class="stat__lbl">В избранном</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding: calc(12px + var(--mf-safe-top)) 14px 24px;
  max-width: 760px;
  margin: 0 auto;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 22px 18px 20px;
  border-radius: 20px;
  border: 1px solid var(--mf-line);
  box-shadow: var(--mf-shadow);
}

.avatar-wrap {
  margin-bottom: 14px;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 36px;
  background: radial-gradient(circle at 30% 25%, #7aaefc, #3390ec 55%, #175fb8);
  border: 2px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 32px rgba(51, 144, 236, 0.25);
}

.avatar--img {
  object-fit: cover;
  padding: 0;
}

.who {
  min-width: 0;
  width: 100%;
}

.name {
  margin: 0;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.username {
  margin: 8px 0 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--mf-blue);
}

.muted {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--mf-muted);
  line-height: 1.4;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.stat {
  padding: 16px 14px;
  border-radius: 16px;
  border: 1px solid var(--mf-line);
  text-align: center;
}

.stat__val {
  font-weight: 900;
  font-size: 20px;
  letter-spacing: -0.02em;
}

.stat__lbl {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 650;
  color: var(--mf-muted);
}
</style>
