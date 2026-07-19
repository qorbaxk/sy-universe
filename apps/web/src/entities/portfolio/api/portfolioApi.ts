import type {
  PortfolioSnapshot,
  ProjectDetail,
  ProjectManifest,
  Profile,
  CompanyDetail,
  Skills,
} from '../model/types'

/**
 * @alias 콘텐츠 base path
 * @description Vite `base: './'`와 GitHub Pages 하위 경로를 고려한 상대 경로.
 */
function contentUrl(path: string) {
  const base = import.meta.env.BASE_URL || './'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${path.replace(/^\//, '')}`
}

/**
 * @alias JSON fetch
 * @description 실패 시 명확한 에러 메시지를 던지는 JSON GET.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.json() as Promise<T>
}

type PortfolioBase = {
  profile: Profile
  companies: CompanyDetail[]
  skills: Skills
}

/**
 * @alias 정적 콘텐츠 스냅샷 로드
 * @description `public/content`의 portfolio.json + projects/*.json을 합쳐 스냅샷을 만든다.
 */
export async function fetchPortfolioFromContent(): Promise<PortfolioSnapshot> {
  const base = await fetchJson<PortfolioBase>(contentUrl('content/portfolio.json'))
  const manifest = await fetchJson<ProjectManifest>(
    contentUrl('content/projects/manifest.json'),
  )

  const projects = await Promise.all(
    manifest.ids.map((id) =>
      fetchJson<ProjectDetail>(contentUrl(`content/projects/${id}.json`)),
    ),
  )

  return {
    profile: base.profile,
    companies: base.companies,
    skills: base.skills,
    projects,
  }
}

/**
 * @alias Nest API 스냅샷 로드
 * @description `VITE_API_URL`이 있을 때 Nest `GET /portfolio`를 호출한다.
 */
export async function fetchPortfolioFromApi(
  apiBaseUrl: string,
): Promise<PortfolioSnapshot> {
  const url = `${apiBaseUrl.replace(/\/$/, '')}/portfolio`
  return fetchJson<PortfolioSnapshot>(url)
}

/**
 * @alias 포트폴리오 스냅샷 로드
 * @description API URL이 있으면 Nest, 없으면 정적 JSON을 사용한다.
 */
export async function fetchPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined
  if (apiUrl) {
    return fetchPortfolioFromApi(apiUrl)
  }
  return fetchPortfolioFromContent()
}
