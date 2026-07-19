import type { DateRange } from './date'

/**
 * @alias 프로젝트 링크
 * @description 프로젝트 소개/데모 등 외부 링크 한 건.
 */
export interface ProjectLink {
  /**
   * @alias 링크 라벨
   * @description 버튼/앵커에 보일 텍스트.
   */
  label: string

  /**
   * @alias 링크 주소
   * @description 이동할 URL.
   */
  href: string
}

/**
 * @alias 프로젝트 작성 상태
 * @description placeholder면 내용 보강 예정, ready면 완성본.
 */
export type ProjectStatus = 'placeholder' | 'ready'

/**
 * @alias 기능 레이어
 * @description 프론트 / 백엔드 / AI / 인프라 중 어디에 가까운지.
 */
export type FeatureLayer = 'frontend' | 'backend' | 'ai' | 'infra'

/**
 * @alias STAR 프레임
 * @description 면접용 상황-과제-행동-결과.
 */
export interface FeatureStar {
  situation: string
  task: string
  action: string
  result: string
}

/**
 * @alias 프로젝트 기능 카드
 * @description 허브·위성 노드에 붙는 기능 단위 스토리.
 */
export interface ProjectFeature {
  id: string
  title: string
  layer: FeatureLayer
  star: FeatureStar
  stack?: string[]
}

/**
 * @alias 프로젝트 지표
 * @description 공개 가능한 수치만. 추측 금지.
 */
export interface ProjectMetric {
  label: string
  value: string
}

/**
 * @alias 프로젝트 미디어
 * @description 캡처·데모 이미지. `src`는 public 기준 경로.
 */
export interface ProjectMedia {
  /**
   * @alias 이미지 경로
   * @description 예: media/projects/sellfit-editor.png
   */
  src: string

  /**
   * @alias 대체 텍스트
   * @description 접근성·SEO용 설명.
   */
  alt: string

  /**
   * @alias 캡션
   * @description 이미지 아래 한 줄 설명.
   */
  caption?: string
}

/**
 * @alias 프로젝트
 * @description 포트폴리오에 노출할 개별 프로젝트 문서. JSON 파일 한 장 = 노드 하나.
 */
export interface ProjectDetail {
  /**
   * @alias 프로젝트 ID
   * @description 그래프 노드 ID와 동일한 고유 키. 파일명과 맞추는 것을 권장.
   */
  id: string

  /**
   * @alias 회사 ID
   * @description 소속 회사 `CompanyDetail.id`. 그래프에서 company→project 링크에 사용.
   */
  companyId: string

  /**
   * @alias 회사 표시명
   * @description UI에 바로 쓸 회사명(스냅샷 편의 필드).
   */
  company: string

  /**
   * @alias 부모 프로젝트 ID
   * @description 있으면 허브→위성 링크로 연결되고 company 링크는 생략한다.
   */
  parentId?: string

  /**
   * @alias 프로젝트명
   * @description 화면에 표시할 프로젝트 이름.
   */
  name: string

  /**
   * @alias 본인 기여
   * @description 팀 내 역할·책임 범위. 면접에서 말할 수 있는 수준으로.
   */
  role?: string

  /**
   * @alias 프로젝트 기간
   * @description 착수·종료(또는 진행중) 날짜. 없으면 회사명만 부제로 쓴다.
   */
  period?: DateRange

  /**
   * @alias 외부 링크 목록
   * @description 소개 페이지, 에디터 등 관련 링크.
   */
  links?: ProjectLink[]

  /**
   * @alias 요약
   * @description 프로젝트 한 단락 설명.
   */
  summary: string

  /**
   * @alias 아키텍처 한 줄
   * @description FE / Nest / Python / AWS 등 계층 요약.
   */
  architectureNote?: string

  /**
   * @alias 하이라이트
   * @description 성과/역할 bullet 목록.
   */
  highlights: string[]

  /**
   * @alias 기능 스토리
   * @description STAR 기반 기능 카드. 허브에는 보너스 기능, 위성에는 핵심 1~2개.
   */
  features?: ProjectFeature[]

  /**
   * @alias 화면 캡처
   * @description 면접관이 바로 이해할 수 있는 제품 스크린샷.
   */
  media?: ProjectMedia[]

  /**
   * @alias 공개 지표
   * @description 수치로 말할 수 있는 항목만.
   */
  metrics?: ProjectMetric[]

  /**
   * @alias 기술 스택
   * @description 사용한 기술·키워드 목록.
   */
  stack: string[]

  /**
   * @alias 작성 상태
   * @description 상세 콘텐츠 완성도.
   */
  status: ProjectStatus

  /**
   * @alias 피처드 여부
   * @description true면 me와 하이라이트 링크로 연결되고 강조 표시된다.
   */
  featured?: boolean

  /**
   * @alias 정렬 순서
   * @description 작을수록 앞에 노출.
   */
  sortOrder: number
}
