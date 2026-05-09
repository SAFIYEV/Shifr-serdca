<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
import MiniPlayer from '@/components/MiniPlayer.vue'
</script>

<template>
  <div class="chrome">
    <main class="chrome__main mf-scroll">
      <slot />
    </main>
    <MiniPlayer />
    <BottomNav />
  </div>
</template>

<style scoped>
.chrome {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(1200px 600px at 50% -10%, rgba(51, 144, 236, 0.14), transparent),
    var(--tg-theme-bg-color, var(--mf-bg));
}

.chrome__main {
  flex: 1;
  padding-bottom: calc(132px + var(--mf-safe-bottom));
}
</style>
