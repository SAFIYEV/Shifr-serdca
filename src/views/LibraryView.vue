<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { useFavoritesStore } from '@/stores/favorites'
import TrackRow from '@/components/TrackRow.vue'
import type { MarrTrack } from '@/types/track'

const player = usePlayerStore()
const fav = useFavoritesStore()

function play(t: MarrTrack) {
  player.playTrack(t, fav.items)
}
</script>

<template>
  <div class="page">
    <header class="top mf-glass">
      <div class="title">Медиатека</div>
      <div class="sub">
        Избранное хранится локально и при наличии Firebase — в облаке (анонимный вход в Firebase Auth).
      </div>
    </header>

    <section class="block">
      <div class="h">
        Избранное
        <span class="hint">{{ fav.items.length }}</span>
      </div>

      <div v-if="!fav.items.length" class="empty">Добавляйте сердечком — соберём коллекцию MarrFY.</div>

      <div v-else class="list">
        <TrackRow
          v-for="t in fav.items"
          :key="t.id"
          :track="t"
          :active="player.current?.id === t.id"
          favorited
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
  padding: 16px 14px;
  box-shadow: var(--mf-shadow);
}

.title {
  font-weight: 950;
  font-size: 22px;
  letter-spacing: -0.02em;
}

.sub {
  margin-top: 8px;
  color: var(--mf-muted);
  font-size: 13px;
  line-height: 1.35;
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
  font-weight: 900;
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
