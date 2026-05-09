import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { ensureAnonymousUser, getFirebase } from '@/firebase'
import { audiusStreamUrl } from '@/services/audius'
import type { MarrTrack } from '@/types/track'

const LS_KEY = 'marrfy:favorites:v1'

function ensurePlayable(t: MarrTrack): MarrTrack {
  return {
    ...t,
    streamUrl: t.streamUrl || audiusStreamUrl(t.id),
  }
}

function serializeFavorites(list: MarrTrack[]) {
  return list.map((t) => ({
    id: t.id,
    title: t.title,
    artistName: t.artistName,
    artworkUrl: t.artworkUrl,
    durationSec: t.durationSec,
    genre: t.genre ?? null,
    streamUrl: t.streamUrl || audiusStreamUrl(t.id),
  }))
}

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<MarrTrack[]>([])
  const loaded = ref(false)
  let unsub: (() => void) | null = null
  let firebaseUid: string | null = null

  const ids = computed(() => new Set(items.value.map((x) => x.id)))

  function persistLocal() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items.value))
    } catch {
      /* ignore */
    }
  }

  function loadLocal(): MarrTrack[] {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as MarrTrack[]
      return Array.isArray(parsed) ? parsed.map(ensurePlayable) : []
    } catch {
      return []
    }
  }

  async function pushFirebase() {
    const fb = getFirebase()
    const uid = firebaseUid
    if (!fb || !uid) return
    try {
      await setDoc(
        doc(fb.db, 'users', uid),
        { favorites: serializeFavorites(items.value), updatedAt: Date.now() },
        { merge: true },
      )
    } catch {
      /* сеть / правила Firestore */
    }
  }

  async function startFirebaseSync() {
    unsub?.()
    unsub = null

    items.value = loadLocal()
    loaded.value = true

    const fb = getFirebase()
    if (!fb) return

    try {
      firebaseUid = await ensureAnonymousUser()
    } catch {
      firebaseUid = null
      return
    }
    if (!firebaseUid) return

    try {
      unsub = onSnapshot(doc(fb.db, 'users', firebaseUid), (snap) => {
        if (!snap.exists()) return
        const data = snap.data() as { favorites?: MarrTrack[] }
        if (!Array.isArray(data.favorites)) return
        items.value = data.favorites.map(ensurePlayable)
        persistLocal()
      })
    } catch {
      unsub = null
    }
  }

  function bootstrap() {
    void startFirebaseSync()
  }

  async function toggleFavorite(track: MarrTrack) {
    const t = ensurePlayable(track)
    const has = ids.value.has(t.id)
    if (has) {
      items.value = items.value.filter((x) => x.id !== t.id)
    } else {
      items.value = [...items.value, t]
    }
    persistLocal()
    await pushFirebase()
  }

  function isFavorite(track: Pick<MarrTrack, 'id'>) {
    return ids.value.has(track.id)
  }

  function dispose() {
    unsub?.()
    unsub = null
  }

  return {
    items,
    loaded,
    ids,
    bootstrap,
    toggleFavorite,
    isFavorite,
    dispose,
  }
})
