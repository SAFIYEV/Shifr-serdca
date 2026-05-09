import type { MarrTrack } from '@/types/track'

const APP_NAME = 'MarrFY'
const API = 'https://api.audius.co/v1'

function artworkFromTrack(t: Record<string, unknown>): string {
  const art = t.artwork as Record<string, string> | undefined
  if (art?.['480x480']) return art['480x480']
  if (art?.['150x150']) return art['150x150']
  const user = t.user as Record<string, unknown> | undefined
  const ua = user?.profile_picture as Record<string, string> | undefined
  if (ua?.['480x480']) return ua['480x480']
  if (ua?.['150x150']) return ua['150x150']
  return ''
}

function userName(t: Record<string, unknown>): string {
  const user = t.user as Record<string, string> | undefined
  return user?.name ?? 'Unknown Artist'
}

export function audiusStreamUrl(trackId: string): string {
  return `${API}/tracks/${trackId}/stream?app_name=${encodeURIComponent(APP_NAME)}`
}

export function mapAudiusTrack(t: Record<string, unknown>): MarrTrack {
  const id = String(t.id ?? '')
  return {
    id,
    title: String(t.title ?? 'Без названия'),
    artistName: userName(t),
    artworkUrl: artworkFromTrack(t),
    durationSec: Number(t.duration ?? 0),
    streamUrl: audiusStreamUrl(id),
    genre: t.genre ? String(t.genre) : undefined,
  }
}

export async function fetchTrending(limit = 24): Promise<MarrTrack[]> {
  const url = `${API}/tracks/trending?time=week&limit=${limit}&app_name=${encodeURIComponent(APP_NAME)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Audius trending: ${res.status}`)
  const json = (await res.json()) as { data?: Record<string, unknown>[] }
  const rows = json.data ?? []
  return rows.map(mapAudiusTrack)
}

/** Поиск треков; limit до ~100, offset для подгрузки страниц */
export async function searchTracks(query: string, limit = 40, offset = 0): Promise<MarrTrack[]> {
  const q = query.trim()
  if (!q) return []
  const lim = Math.min(Math.max(1, limit), 100)
  const off = Math.max(0, offset)
  const url = `${API}/tracks/search?query=${encodeURIComponent(q)}&limit=${lim}&offset=${off}&app_name=${encodeURIComponent(APP_NAME)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Audius search: ${res.status}`)
  const json = (await res.json()) as { data?: Record<string, unknown>[] }
  const rows = json.data ?? []
  return rows.map(mapAudiusTrack)
}
