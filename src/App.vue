<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppChrome from '@/components/AppChrome.vue'
</script>

<template>
  <AppChrome>
    <RouterView v-slot="{ Component }">
      <Transition name="mf-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AppChrome>
</template>

<style scoped>
.mf-fade-enter-active,
.mf-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.mf-fade-enter-from,
.mf-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
