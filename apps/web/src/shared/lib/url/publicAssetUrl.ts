/**
 * @alias public 에셋 URL
 * @description Vite `base`와 GitHub Pages 하위 경로를 맞춘 상대 경로.
 */
export function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || './'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${path.replace(/^\//, '')}`
}
