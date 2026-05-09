export interface MarrTrack {
  id: string
  title: string
  artistName: string
  artworkUrl: string
  durationSec: number
  streamUrl: string
  genre?: string
}

export interface MbRecordingHit {
  id: string
  title: string
  artistCredit?: string
  releases?: { id: string; title: string }[]
}
