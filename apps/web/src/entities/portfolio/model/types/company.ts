import type { DateRange } from './date'

/**
 * @alias 회사(경력)
 * @description 재직/경력 회사 상세. 기간은 DateRange로 보관하고 라벨은 런타임 계산한다.
 */
export interface CompanyDetail {
  /**
   * @alias 회사 ID
   * @description 그래프 노드·프로젝트 companyId와 매칭되는 고유 ID.
   */
  id: string

  /**
   * @alias 회사명
   * @description 화면에 표시할 회사 이름.
   */
  name: string

  /**
   * @alias 역할
   * @description 해당 회사에서의 직책/역할.
   */
  role: string

  /**
   * @alias 재직 기간
   * @description 입사·퇴사(또는 재직중) 날짜 범위.
   */
  period: DateRange

  /**
   * @alias 요약
   * @description 회사에서 담당한 일의 짧은 설명.
   */
  summary: string

  /**
   * @alias 정렬 순서
   * @description 작을수록 앞에 노출. 보통 최신 회사가 작은 값.
   */
  sortOrder: number
}
