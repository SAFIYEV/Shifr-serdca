<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { searchTracks } from '@/services/audius'
import { searchRecordings } from '@/services/musicbrainz'
import type { MarrTrack, MbRecordingHit } from '@/types/track'
import { usePlayerStore } from '@/stores/player'
import { useFavoritesStore } from '@/stores/favorites'
import TrackRow from '@/components/TrackRow.vue'

const q = ref('')
const loading = ref(false)
const mb = ref<MbRecordingHit[]>([])

const allTracks = ref<MarrTrack[]>([])
const nextFetchOffset = ref(0)
const lastBatchFull = ref(false)
const tracksShown = ref(10)
const PAGE_REMOTE = 40
const STEP = 10

const player = usePlayerStore()
const fav = useFavoritesStore()

const mbLoadingId = ref<string | null>(null)
const inlineHint = ref('')

const displayedTracks = computed(() => allTracks.value.slice(0, tracksShown.value))

const canLoadMore = computed(() => {
  if (tracksShown.value < allTracks.value.length) return true
  return lastBatchFull.value
})

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
  inlineHint.value = ''
  if (!query) {
    allTracks.value = []
    mb.value = []
    nextFetchOffset.value = 0
    lastBatchFull.value = false
    tracksShown.value = STEP
    return
  }
  loading.value = true
  try {
    const [a, m] = await Promise.all([
      searchTracks(query, PAGE_REMOTE, 0),
      searchRecordings(query, 12),
    ])
    allTracks.value = a
    nextFetchOffset.value = PAGE_REMOTE
    lastBatchFull.value = a.length >= PAGE_REMOTE
    tracksShown.value = a.length ? Math.min(STEP, a.length) : STEP
    mb.value = m
  } finally {
    loading.value = false
  }
}

async function loadMoreTracks() {
  inlineHint.value = ''
  if (tracksShown.value < allTracks.value.length) {
    tracksShown.value = Math.min(tracksShown.value + STEP, allTracks.value.length)
    return
  }
  const query = q.value.trim()
  if (!query || !lastBatchFull.value) return

  loading.value = true
  try {
    const more = await searchTracks(query, PAGE_REMOTE, nextFetchOffset.value)
    lastBatchFull.value = more.length >= PAGE_REMOTE
    const seen = new Set(allTracks.value.map((t) => t.id))
    for (const t of more) {
      if (!seen.has(t.id)) {
        seen.add(t.id)
        allTracks.value.push(t)
      }
    }
    nextFetchOffset.value += PAGE_REMOTE
    tracksShown.value = Math.min(tracksShown.value + STEP, allTracks.value.length)
  } finally {
    loading.value = false
  }
}

async function onMbRecordingPick(r: MbRecordingHit) {
  inlineHint.value = ''
  const sub = [r.title, r.artistCredit].filter(Boolean).join(' ').trim()
  if (!sub) return

  mbLoadingId.value = r.id
  try {
    const found = await searchTracks(sub, 25, 0)
    const first = found[0]
    if (!first) {
      inlineHint.value =
        'В каталоге потоков не нашлось совпадений. Попробуйте другую запись или переформулируйте поиск.'
      return
    }

    const seen = new Set<string>()
    const merged: MarrTrack[] = []
    for (const t of [...found, ...allTracks.value]) {
      if (seen.has(t.id)) continue
      seen.add(t.id)
      merged.push(t)
    }
    allTracks.value = merged
    lastBatchFull.value = found.length >= 25
    tracksShown.value = Math.min(Math.max(tracksShown.value, found.length, STEP), merged.length)

    player.playTrack(first, merged)
  } finally {
    mbLoadingId.value = null
  }
}

function play(t: MarrTrack) {
  player.playTrack(t, allTracks.value)
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

    <p v-if="inlineHint" class="hint-banner">{{ inlineHint }}</p>

    <!-- Сначала треки с потоком -->
    <section class="block">
      <div class="h">Треки</div>
      <div v-if="!q.trim()" class="empty">Начните вводить запрос.</div>
      <div v-else-if="loading && !allTracks.length" class="empty">Ищем…</div>
      <div v-else-if="!allTracks.length" class="empty">
        В потоковом каталоге по этому запросу пусто. Ниже — похожие записи: нажмите, мы попробуем найти трек для
        воспроизведения.
      </div>
      <template v-else>
        <div class="list">
          <TrackRow
            v-for="t in displayedTracks"
            :key="t.id"
            :track="t"
            :active="player.current?.id === t.id"
            :favorited="fav.isFavorite(t)"
            @play="play(t)"
            @favorite="fav.toggleFavorite(t)"
          />
        </div>
        <button v-if="canLoadMore" type="button" class="more" :disabled="loading" @click="loadMoreTracks">
          {{ loading ? 'Загрузка…' : 'Показать ещё' }}
        </button>
      </template>
    </section>

    <!-- Справочный блок ниже -->
    <section v-if="mb.length && q.trim()" class="block">
      <div class="h">Похожие записи</div>
      <p class="mb-hint">Нажмите строку — поиск потока по названию и исполнителю, затем воспроизведение.</p>
      <div class="mb">
        <button
          v-for="r in mb"
          :key="r.id"
          type="button"
          class="mb__row"
          :disabled="mbLoadingId === r.id"
          @click="onMbRecordingPick(r)"
        >
          <div class="mb__t">{{ r.title }}</div>
          <div class="mb__s">{{ r.artistCredit ?? 'Исполнитель неизвестен' }}</div>
          <div v-if="mbLoadingId === r.id" class="mb__load">Ищем поток…</div>
        </button>
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

.hint-banner {
  margin: 12px 4px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 180, 100, 0.12);
  border: 1px solid rgba(255, 180, 100, 0.25);
  color: #ffc896;
  font-size: 13px;
  line-height: 1.4;
}

.block {
  margin-top: 16px;
}

.h {
  padding: 6px 4px 10px;
  font-weight: 900;
  font-size: 16px;
}

.mb-hint {
  margin: 0 4px 10px;
  font-size: 12px;
  color: var(--mf-muted);
  line-height: 1.35;
}

.mb {
  border: 1px solid var(--mf-line);
  border-radius: var(--mf-radius);
  overflow: hidden;
  background: rgba(44, 44, 46, 0.35);
}

.mb__row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 12px;
  border-top: 1px solid var(--mf-line);
  color: inherit;
  background: transparent;
  cursor: pointer;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
.mb__row:first-child {
  border-top: 0;
}

.mb__row:disabled {
  opacity: 0.65;
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

.mb__load {
  margin-top: 6px;
  font-size: 11px;
  color: var(--mf-blue);
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
  line-height: 1.45;
}

.more {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--mf-line);
  background: rgba(255, 255, 255, 0.06);
  color: var(--mf-blue);
  font-weight: 750;
  font-size: 14px;
  cursor: pointer;
}

.more:disabled {
  opacity: 0.6;
}
</style>
