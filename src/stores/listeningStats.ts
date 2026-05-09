import { defineStore } from 'pinia'
import { ref } from 'vue'

const LS_KEY = 'marrfy:listened-sec:v1'

export const useListeningStatsStore = defineStore('listeningStats', () => {
  const totalListenedSec = ref(0)

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw == null) return
      const n = Number(raw)
      if (Number.isFinite(n) && n >= 0) totalListenedSec.value = Math.floor(n)
    } catch {
      /* */
    }
  }

  function addSeconds(delta: number) {
    if (!Number.isFinite(delta) || delta <= 0) return
    const d = Math.min(delta, 10)
    totalListenedSec.value = Math.floor(totalListenedSec.value + d)
    try {
      localStorage.setItem(LS_KEY, String(totalListenedSec.value))
    } catch {
      /* */
    }
  }

  load()

  return { totalListenedSec, addSeconds, load }
})
