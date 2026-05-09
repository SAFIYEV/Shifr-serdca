<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useFavoritesStore } from '@/stores/favorites'

const player = usePlayerStore()
const fav = useFavoritesStore()

const pct = computed(() => {
  const d = player.durationSec
  if (!d) return 0
  return Math.min(1, player.progressSec / d)
})

function onBarClick(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  player.seekRatio(x / r.width)
}

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function toggleLike() {
  const t = player.current
  if (t) void fav.toggleFavorite(t)
}

const liked = computed(() => (player.current ? fav.isFavorite(player.current) : false))
</script>

<template>
  <div v-if="player.current" class="wrap">
    <div class="player mf-glass">
      <button type="button" class="side" @click="player.prev()" aria-label="Назад">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M10 6 4 12l6 6V6zm9 0h-2v12h2V6z" />
        </svg>
      </button>

      <div class="meta">
        <div class="meta__top">
          <div class="cover" :style="{ backgroundImage: `url(${player.current.artworkUrl})` }" />
          <div class="titles">
            <div class="t1">{{ player.current.title }}</div>
            <div class="t2">{{ player.current.artistName }}</div>
          </div>
        </div>
        <button type="button" class="prog" @click="onBarClick" aria-label="Перемотка">
          <span class="prog__fill" :style="{ width: `${pct * 100}%` }" />
        </button>
        <div class="times">
          <span>{{ fmt(player.progressSec) }}</span>
          <span>{{ fmt(player.durationSec) }}</span>
        </div>
      </div>

      <button
        type="button"
        class="like"
        :class="{ 'like--on': liked }"
        aria-label="В избранное"
        @click="toggleLike"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            v-if="liked"
            fill="currentColor"
            d="M12 21s-6.7-4.35-9.3-8.2C.8 10.3 1.6 7.1 4.2 5.6 6.1 4.4 8.5 5 10 6.7c1.5-1.7 3.9-2.3 5.8-1.1 2.6 1.5 3.4 4.7 1.5 7.2C15 16.65 12 21 12 21z"
          />
          <path
            v-else
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            d="M12 21s-6.7-4.35-9.3-8.2C.8 10.3 1.6 7.1 4.2 5.6 6.1 4.4 8.5 5 10 6.7c1.5-1.7 3.9-2.3 5.8-1.1 2.6 1.5 3.4 4.7 1.5 7.2C15 16.65 12 21 12 21z"
          />
        </svg>
      </button>

      <button type="button" class="play" @click="player.toggle()" :aria-label="player.playing ? 'Пауза' : 'Играть'">
        <svg v-if="!player.playing" viewBox="0 0 24 24" width="26" height="26">
          <path fill="currentColor" d="M8 5v14l11-7-11-7z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="26" height="26">
          <path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
        </svg>
      </button>

      <button type="button" class="side" @click="player.next()" aria-label="Вперёд">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M6 18h2V6H6v12zm9-12-6 6 6 6V6z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(58px + var(--mf-safe-bottom));
  z-index: 35;
  padding: 0 12px;
  pointer-events: none;
}

.player {
  pointer-events: auto;
  display: grid;
  grid-template-columns: 40px 1fr 44px 48px 40px;
  gap: 6px;
  align-items: center;
  padding: 10px 8px;
  border-radius: 16px;
  border: 1px solid var(--mf-line);
  box-shadow: var(--mf-shadow);
}

.side {
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  height: 44px;
  border-radius: 12px;
  color: var(--mf-text);
  cursor: pointer;
}

.side:active {
  transform: scale(0.98);
}

.like {
  border: 0;
  height: 48px;
  width: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--mf-muted);
}

.like--on {
  color: #ff4d6d;
  background: rgba(255, 77, 109, 0.14);
}

.like:active {
  transform: scale(0.97);
}

.meta {
  min-width: 0;
}

.meta__top {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.cover {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2c2c2e, #1c1c1e);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--mf-line);
}

.titles {
  min-width: 0;
}

.t1 {
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t2 {
  margin-top: 2px;
  font-size: 12px;
  color: var(--mf-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prog {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.prog__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--mf-blue), #7aaefc);
}

.times {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--mf-muted);
}

.play {
  border: 0;
  height: 52px;
  border-radius: 16px;
  background: var(--mf-blue);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(51, 144, 236, 0.35);
}

.play:active {
  transform: translateY(1px);
}
</style>
