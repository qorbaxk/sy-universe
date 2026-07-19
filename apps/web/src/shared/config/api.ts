/**
 * @alias Nest API base URL
 * @description `VITE_API_URL` (예: http://localhost:3000/api). 없으면 null.
 */
export function getApiBaseUrl(): string | null {
  const raw = import.meta.env.VITE_API_URL as string | undefined
  if (!raw?.trim()) return null
  return raw.replace(/\/$/, '')
}
