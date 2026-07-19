import {
  getDetailForNode,
  type GraphNode,
  type PortfolioSnapshot,
} from '@/entities/portfolio'
import {
  formatCareerPeriod,
  formatDuration,
  formatTotalExperience,
} from '@/shared/lib/date/formatCareer'

/**
 * @alias 디테일 패널 뷰모델 훅
 * @description 스냅샷 + 선택 노드로 패널에 필요한 파생 데이터를 만든다.
 */
export function useDetailPanelModel(
  snapshot: PortfolioSnapshot | undefined,
  node: GraphNode | null,
) {
  if (!snapshot || !node) {
    return { detail: null, experienceLabel: '' }
  }

  const detail = getDetailForNode(snapshot, node.id)
  const experienceLabel = formatTotalExperience(
    snapshot.companies.map((company) => company.period),
  )

  return {
    detail,
    experienceLabel,
    formatCareerPeriod,
    formatDuration,
  }
}
