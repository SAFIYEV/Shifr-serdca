<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { searchTracks } from '@/services/audius'
import { searchRecordings } from '@/services/musicbrainz'
import type { MarrTrack, MbRecordingHit } from '@/types/track'
import { usePlayerStore } from '@/stores/player'
import { useFavoritesStore } from '@/stores/favorites'
import TrackRow from '@/components/TrackRow.vue'

const q = ref('')
const loading = ref(false)
const audius = ref<MarrTrack[]>([])
const mb = ref<MbRecordingHit[]>([])

const player = usePlayerStore()
const fav = useFavoritesStore()

let timer: number | undefined

watch(q, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void run(), 280)
})

onUnmounted(() => {
  window.clearTimeout(timer)
})

async function run() {
  const query = q.value.trim()
  if (!query) {
    audius.value = []
    mb.value = []
    return
  }
  loading.value = true
  try {
    const [a, m] = await Promise.all([searchTracks(query, 25), searchRecordings(query, 8)])
    audius.value = a
    mb.value = m
  } finally {
    loading.value = false
  }
}

function play(t: MarrTrack) {
  player.playTrack(t, audius.value)
}
</script>

<template>
  <div class="page">
    <header class="top mf-glass">
      <div class="title">Поиск</div>
      <label class="field">
        <svg class="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 14-4.3-4.3 1.4-1.4L20.4 19z"
          />
        </svg>
        <input v-model="q" class="input" type="search" enterkeyhint="search" placeholder="Трек, артист, настроение…" />
      </label>
      <div class="micro">
        <span v-if="loading" class="dot">Ищем…</span>
      </div>
    </header>

    <section v-if="mb.length" class="block">
      <div class="h">Похожие записи</div>
      <div class="mb">
        <a
          v-for="r in mb"
          :key="r.id"
          class="mb__row"
          :href="`https://musicbrainz.org/recording/${r.id}`"
          target="_blank"
          rel="noreferrer"
        >
          <div class="mb__t">{{ r.title }}</div>
          <div class="mb__s">{{ r.artistCredit ?? 'Исполнитель неизвестен' }}</div>
        </a>
      </div>
    </section>

    <section class="block">
      <div class="h">Треки</div>
      <div v-if="!q.trim()" class="empty">Начните вводить запрос — покажем релевантные треки.</div>
      <div v-else-if="loading && !audius.length" class="empty">Ищем…</div>
      <div v-else-if="!audius.length" class="empty">Ничего не нашли. Попробуйте другую формулировку.</div>
      <div v-else class="list">
        <TrackRow
          v-for="t in audius"
          :key="t.id"
          :track="t"
          :active="player.current?.id === t.id"
          :favorited="fav.isFavorite(t)"
          @play="play(t)"
          @favorite="fav.toggleFavorite(t)"
        />
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

.top {
  border: 1px solid var(--mf-line);
  border-radius: 18px;
  padding: 14px 14px 12px;
  box-shadow: var(--mf-shadow);
}

.title {
  font-weight: 950;
  font-size: 22px;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.field {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: center;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid var(--mf-line);
  background: rgba(0, 0, 0, 0.22);
}

.ico {
  opacity: 0.85;
}

.input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--mf-text);
  font-size: 15px;
}

.micro {
  margin-top: 10px;
  font-size: 12px;
  color: var(--mf-muted);
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  color: var(--mf-blue);
}

.block {
  margin-top: 16px;
}

.h {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 4px 10px;
  font-weight: 900;
  font-size: 16px;
}

.hint {
  font-size: 12px;
  font-weight: 800;
  color: var(--mf-muted);
}

.mb {
  border: 1px solid var(--mf-line);
  border-radius: var(--mf-radius);
  overflow: hidden;
  background: rgba(44, 44, 46, 0.35);
}

.mb__row {
  display: block;
  padding: 12px 12px;
  border-top: 1px solid var(--mf-line);
  color: inherit;
}
.mb__row:first-child {
  border-top: 0;
}

.mb__t {
  font-weight: 750;
  font-size: 14px;
}

.mb__s {
  margin-top: 4px;
  font-size: 12px;
  color: var(--mf-muted);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty {
  padding: 14px 8px;
  color: var(--mf-muted);
  font-size: 14px;
}
</style>
