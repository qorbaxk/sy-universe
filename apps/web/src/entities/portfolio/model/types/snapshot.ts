import type { CompanyDetail } from './company'
import type { Profile } from './profile'
import type { ProjectDetail } from './project'
import type { Skills } from './skills'

/**
 * @alias 포트폴리오 스냅샷
 * @description API 또는 정적 JSON에서 한 번에 내려받는 포트폴리오 전체 데이터.
 */
export interface PortfolioSnapshot {
  /**
   * @alias 프로필
   * @description 주인공 기본 정보.
   */
  profile: Profile

  /**
   * @alias 회사 목록
   * @description 경력 회사들.
   */
  companies: CompanyDetail[]

  /**
   * @alias 프로젝트 목록
   * @description 문서(JSON)로 관리되는 프로젝트들. 추가하면 그래프 노드가 늘어난다.
   */
  projects: ProjectDetail[]

  /**
   * @alias 스킬
   * @description 카테고리별 기술 목록.
   */
  skills: Skills
}

/**
 * @alias 프로젝트 문서 매니페스트
 * @description `projects/*.json` 파일 목록을 알려주는 인덱스.
 */
export interface ProjectManifest {
  /**
   * @alias 프로젝트 파일 ID 목록
   * @description `public/content/projects/{id}.json`에 대응하는 id 배열.
   */
  ids: string[]
}
