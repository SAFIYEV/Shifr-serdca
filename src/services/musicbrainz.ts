import type { MbRecordingHit } from '@/types/track'

const UA = 'MarrFY/1.0 (+https://github.com/SAFIYEV/Shifr-serdca)'

/** В dev Vite проксирует на musicbrainz.org (обход CORS). В проде задайте свой прокси через VITE_MB_API_BASE. */
function mbApiRoot(): string {
  const custom = import.meta.env.VITE_MB_API_BASE
  if (custom) return custom.replace(/\/$/, '')
  if (import.meta.env.DEV) return '/musicbrainz-ws'
  return 'https://musicbrainz.org/ws/2'
}

export async function searchRecordings(query: string, limit = 8): Promise<MbRecordingHit[]> {
  const q = query.trim()
  if (!q) return []
  const root = mbApiRoot()
  const url = `${root}/recording?query=${encodeURIComponent(q)}&fmt=json&limit=${limit}`
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': UA },
    })
    if (!res.ok) return []
    const json = (await res.json()) as {
      recordings?: { id: string; title: string; 'artist-credit'?: { name?: string }[] }[]
    }
    const recs = json.recordings ?? []
    return recs.map((r) => ({
      id: r.id,
      title: r.title,
      artistCredit: r['artist-credit']?.[0]?.name,
      releases: [],
    }))
  } catch {
    return []
  }
}

export function coverArtUrl(releaseMbid: string, size: 250 | 500 = 250): string {
  return `https://coverartarchive.org/release/${releaseMbid}/front-${size}`
}
