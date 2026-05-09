<script setup lang="ts">
import type { MarrTrack } from '@/types/track'

defineProps<{
  track: MarrTrack
  subtitle?: string
  active?: boolean
  favorited?: boolean
}>()

defineEmits<{
  play: []
  favorite: []
}>()
</script>

<template>
  <div class="row" :class="{ 'row--active': active }">
    <button type="button" class="art" @click="$emit('play')" :aria-label="`Играть ${track.title}`">
      <span class="art__img" :style="{ backgroundImage: `url(${track.artworkUrl})` }" />
    </button>

    <button type="button" class="txt" @click="$emit('play')">
      <div class="t1">{{ track.title }}</div>
      <div class="t2">{{ subtitle ?? track.artistName }}</div>
    </button>

    <button
      type="button"
      class="heart"
      :class="{ 'heart--on': favorited }"
      @click.stop="$emit('favorite')"
      aria-label="Избранное"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          v-if="favorited"
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
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 52px 1fr 44px;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--mf-radius);
  border: 1px solid transparent;
  background: rgba(44, 44, 46, 0.55);
}

.row--active {
  border-color: rgba(51, 144, 236, 0.35);
  background: rgba(51, 144, 236, 0.12);
}

.art {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.art__img {
  display: block;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2c2c2e, #1c1c1e);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--mf-line);
}

.txt {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  min-width: 0;
}

.t1 {
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t2 {
  margin-top: 3px;
  font-size: 13px;
  color: var(--mf-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.heart {
  border: 0;
  height: 44px;
  width: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--mf-muted);
}

.heart--on {
  color: #ff4d6d;
  background: rgba(255, 77, 109, 0.12);
}

.heart:active {
  transform: scale(0.98);
}
</style>
