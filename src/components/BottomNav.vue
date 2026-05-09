<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = computed(() => [
  { name: 'home', label: 'Главная', to: '/', icon: 'home' },
  { name: 'search', label: 'Поиск', to: '/search', icon: 'search' },
  { name: 'library', label: 'Медиатека', to: '/library', icon: 'library' },
  { name: 'profile', label: 'Профиль', to: '/profile', icon: 'user' },
])

function isActive(path: string) {
  return route.path === path
}

function go(to: string) {
  void router.push(to)
}
</script>

<template>
  <nav class="nav mf-glass" aria-label="Основные разделы">
    <button
      v-for="t in tabs"
      :key="t.name"
      type="button"
      class="nav__btn"
      :class="{ 'nav__btn--active': isActive(t.to) }"
      @click="go(t.to)"
    >
      <span class="nav__ico" aria-hidden="true">
        <svg v-if="t.icon === 'home'" viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.8L18 15v6h-2v-6H8v6H6v-6l6-9.2z"
          />
        </svg>
        <svg v-else-if="t.icon === 'search'" viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 14-4.3-4.3 1.4-1.4L20.4 19z"
          />
        </svg>
        <svg v-else-if="t.icon === 'library'" viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h8v2H6v-2zm0 4h12v2H6v-2z"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"
          />
        </svg>
      </span>
      <span class="nav__label">{{ t.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 8px 10px calc(10px + var(--mf-safe-bottom));
  border-top: 1px solid var(--mf-line);
}

.nav__btn {
  border: 0;
  background: transparent;
  padding: 8px 6px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--mf-muted);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, transform 0.12s ease;
}

.nav__btn:active {
  transform: scale(0.98);
}

.nav__btn--active {
  color: var(--mf-blue);
  background: var(--mf-blue-soft);
}

.nav__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.nav__ico {
  display: grid;
  place-items: center;
  opacity: 0.95;
}
</style>
