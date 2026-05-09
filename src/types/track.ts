export interface MarrTrack {
  id: string
  title: string
  artistName: string
  artworkUrl: string
  durationSec: number
  /** Audius discovery stream URL */
  streamUrl: string
  genre?: string
}

export interface MbRecordingHit {
  id: string
  title: string
  artistCredit?: string
  releases?: { id: string; title: string }[]
}
