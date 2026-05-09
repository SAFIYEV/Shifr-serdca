import { defineStore } from 'pinia'
import { Howl } from 'howler'
import { computed, ref } from 'vue'
import type { MarrTrack } from '@/types/track'
import { useListeningStatsStore } from '@/stores/listeningStats'

export const usePlayerStore = defineStore('player', () => {
  const queue = ref<MarrTrack[]>([])
  const index = ref(0)
  const playing = ref(false)
  const progressSec = ref(0)
  let howl: Howl | null = null
  let raf = 0
  let lastListenTs = 0

  const current = computed(() => queue.value[index.value] ?? null)

  const durationSec = computed(() => {
    if (howl) {
      const d = howl.duration()
      if (d && !Number.isNaN(d)) return d
    }
    return current.value?.durationSec ?? 0
  })

  function stopRaf() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function tick() {
    if (howl?.playing()) {
      const now = performance.now()
      if (lastListenTs > 0) {
        const dt = (now - lastListenTs) / 1000
        if (dt > 0 && dt < 3) useListeningStatsStore().addSeconds(dt)
      }
      lastListenTs = now
      progressSec.value = Number(howl.seek())
      raf = requestAnimationFrame(tick)
    } else {
      lastListenTs = 0
    }
  }

  function unloadAudio() {
    stopRaf()
    lastListenTs = 0
    howl?.unload()
    howl = null
  }

  function setQueueAndIndex(track: MarrTrack, newQueue?: MarrTrack[]) {
    if (newQueue?.length) {
      queue.value = [...newQueue]
      const i = queue.value.findIndex((t) => t.id === track.id)
      index.value = i >= 0 ? i : 0
    } else {
      const i = queue.value.findIndex((t) => t.id === track.id)
      if (i >= 0) {
        index.value = i
      } else {
        queue.value = [track]
        index.value = 0
      }
    }
  }

  function loadHowl(track: MarrTrack) {
    unloadAudio()
    playing.value = false
    progressSec.value = 0

    howl = new Howl({
      src: [track.streamUrl],
      html5: true,
      format: ['mp3', 'mpeg', 'opus'],
      volume: 0.92,
      onload: () => {
        progressSec.value = 0
      },
      onloaderror: () => {
        playing.value = false
      },
      onplay: () => {
        playing.value = true
        lastListenTs = performance.now()
        tick()
      },
      onpause: () => {
        playing.value = false
        stopRaf()
      },
      onend: () => {
        playing.value = false
        stopRaf()
        next()
      },
      onstop: () => {
        playing.value = false
        stopRaf()
      },
    })

    howl.play()
  }

  function playTrack(track: MarrTrack, newQueue?: MarrTrack[]) {
    setQueueAndIndex(track, newQueue)
    const t = queue.value[index.value]
    if (t) loadHowl(t)
  }

  function toggle() {
    if (!howl) return
    if (howl.playing()) howl.pause()
    else howl.play()
  }

  function seekRatio(ratio: number) {
    if (!howl) return
    const d = durationSec.value
    if (!d) return
    const clamped = Math.min(1, Math.max(0, ratio))
    howl.seek(clamped * d)
    progressSec.value = Number(howl.seek())
  }

  function next() {
    if (!queue.value.length) return
    index.value = (index.value + 1) % queue.value.length
    const t = queue.value[index.value]
    if (t) loadHowl(t)
  }

  function prev() {
    if (!queue.value.length) return
    index.value = (index.value - 1 + queue.value.length) % queue.value.length
    const t = queue.value[index.value]
    if (t) loadHowl(t)
  }

  return {
    queue,
    index,
    playing,
    progressSec,
    durationSec,
    current,
    playTrack,
    toggle,
    seekRatio,
    next,
    prev,
    unloadAudio,
  }
})
