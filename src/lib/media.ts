// Project media is one ordered list so images and videos can be interleaved.
// The kind is derived from the string itself — a file extension for self-hosted
// clips, a recognizable URL for YouTube — so the `screenshots` column stays a
// plain string[] and nothing needs a migration.

export type MediaItem =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string }
  | { kind: 'youtube'; src: string; id: string }

const VIDEO_FILE = /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i

// youtu.be/<id>, /watch?v=<id>, /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
const YOUTUBE_ID =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/

// What the admin panel may upload to Vercel Blob. The extension is what decides
// how a stored URL renders later (see VIDEO_FILE), so every accepted type must
// map onto one of the extensions above.
export const UPLOAD_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
] as const
export const UPLOAD_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'] as const
export const UPLOAD_CONTENT_TYPES: string[] = [...UPLOAD_IMAGE_TYPES, ...UPLOAD_VIDEO_TYPES]

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024

// Uploads land on a Blob store subdomain; committed files and YouTube links do
// not. Deleting a file is only offered for the former.
export function isBlobUrl(src: string): boolean {
  try {
    return new URL(src).hostname.endsWith('.blob.vercel-storage.com')
  } catch {
    return false // relative path under public/
  }
}

export function toMedia(src: string): MediaItem {
  const yt = YOUTUBE_ID.exec(src)
  if (yt) return { kind: 'youtube', src, id: yt[1] }
  if (VIDEO_FILE.test(src)) return { kind: 'video', src }
  return { kind: 'image', src }
}

export const toMediaList = (sources: string[]): MediaItem[] => sources.map(toMedia)

export const isVideo = (m: MediaItem) => m.kind !== 'image'

// The still frame shown before playback. YouTube publishes one; hqdefault is
// 4:3 with letterbox bars around a centered 16:9 frame, so `object-cover` in a
// 16:9 box crops back to exactly the video — hence `object-center` below and
// `object-top` for real screenshots, which are cropped from the top.
export const youtubePoster = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

export const posterFit = (m: MediaItem) =>
  m.kind === 'youtube' ? 'object-center' : 'object-top'

// A self-hosted file has no poster, and browsers paint an empty box until a
// frame is decoded. Seeking a hair past the start forces the first frame.
export const firstFrame = (src: string) => `${src}#t=0.1`

export function youtubeEmbed(id: string, autoplay = false): string {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

export function mediaLabel(m: MediaItem, title: string, index: number): string {
  const noun = m.kind === 'image' ? 'screenshot' : 'video'
  return `${title} ${noun} ${index + 1}`
}

// Split a media list into its counts, for the "3 images · 1 video" card badge.
export function countMedia(items: MediaItem[]) {
  const videos = items.filter(isVideo).length
  return { images: items.length - videos, videos }
}
