const DEFAULT_LIVE_SITE_URL = 'https://mm88tv.live'

export const LIVE_SITE_URL = (
  (import.meta.env.VITE_LIVE_SITE_URL as string | undefined) || DEFAULT_LIVE_SITE_URL
).replace(/\/+$/, '')

export function liveSiteUrl(path: string) {
  return `${LIVE_SITE_URL}${path}`
}
