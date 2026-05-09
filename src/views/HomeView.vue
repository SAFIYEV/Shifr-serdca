<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchTrending } from '@/services/audius'
import type { MarrTrack } from '@/types/track'
import { usePlayerStore } from '@/stores/player'
import { useFavoritesStore } from '@/stores/favorites'
import TrackRow from '@/components/TrackRow.vue'

const player = usePlayerStore()
const fav = useFavoritesStore()

const loading = ref(true)
const error = ref<string | null>(null)
const tracks = ref<MarrTrack[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    tracks.value = await fetchTrending(30)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Не удалось загрузить треки'
  } finally {
    loading.value = false
  }
})

function play(t: MarrTrack) {
  player.playTrack(t, tracks.value)
}

const chips = ['Сегодня', 'Неделя', 'Электро', 'Хип-хоп', 'Поп']

const activeChip = ref('Неделя')
</script>

<template>
  <div class="page">
    <header class="hero mf-glass">
      <div class="brand">
        <div class="logo">MarrFY</div>
        <div class="sub">Подборки и треки недели</div>
      </div>
      <div class="chips" role="tablist" aria-label="Категории">
        <button
          v-for="c in chips"
          :key="c"
          type="button"
          class="chip"
          :class="{ 'chip--on': activeChip === c }"
          @click="activeChip = c"
        >
          {{ c }}
        </button>
      </div>
    </header>

    <section class="section">
      <div class="h2">
        <span>В тренде</span>
      </div>

      <div v-if="loading" class="state">Загружаем волну…</div>
      <div v-else-if="error" class="state state--err">{{ error }}</div>
      <div v-else class="list">
        <TrackRow
          v-for="t in tracks"
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

.hero {
  border: 1px solid var(--mf-line);
  border-radius: 18px;
  padding: 16px 14px;
  box-shadow: var(--mf-shadow);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.logo {
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: 28px;
  background: linear-gradient(135deg, #fff, #cfe6ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub {
  color: var(--mf-muted);
  font-size: 13px;
}

.chips {
  display: flex;
  gap: 8px;
  overflow: auto;
  padding-top: 14px;
  margin: 0 -4px;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  border: 1px solid var(--mf-line);
  background: rgba(255, 255, 255, 0.04);
  color: var(--mf-text);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
}

.chip--on {
  border-color: rgba(51, 144, 236, 0.55);
  background: var(--mf-blue-soft);
  color: var(--mf-blue);
}

.section {
  margin-top: 18px;
}

.h2 {
  padding: 6px 4px 12px;
  font-weight: 900;
  font-size: 18px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.state {
  padding: 18px 8px;
  color: var(--mf-muted);
  font-size: 14px;
}

.state--err {
  color: #ffb4b4;
}
</style>
