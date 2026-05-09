import { createRouter, createWebHashHistory } from 'vue-router'

/** Hash + base из Vite — корректный путь под GitHub Pages */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
    { path: '/library', name: 'library', component: () => import('@/views/LibraryView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
  ],
})

export default router
