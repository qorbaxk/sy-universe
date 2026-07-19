import { useQuery } from '@tanstack/react-query'
import { buildGraphFromPortfolio } from '../lib/buildGraphFromPortfolio'
import type { GraphData, PortfolioSnapshot } from '../model/types'
import { fetchPortfolioSnapshot } from './portfolioApi'
import { portfolioKeys } from './portfolioKeys'

/**
 * @alias 포트폴리오 조회 결과
 * @description 스냅샷과 파생 그래프 데이터를 함께 담는다.
 */
export type PortfolioQueryData = {
  /**
   * @alias 원본 스냅샷
   * @description profile/companies/projects/skills.
   */
  snapshot: PortfolioSnapshot

  /**
   * @alias 그래프 데이터
   * @description 스냅샷에서 자동 생성된 nodes/links.
   */
  graph: GraphData
}

/**
 * @alias 포트폴리오 쿼리 훅
 * @description 서버(또는 정적 JSON) 상태를 React Query로 읽고 그래프까지 파생한다.
 */
export function usePortfolioQuery() {
  return useQuery({
    queryKey: portfolioKeys.snapshot(),
    queryFn: fetchPortfolioSnapshot,
    select: (snapshot): PortfolioQueryData => ({
      snapshot,
      graph: buildGraphFromPortfolio(snapshot),
    }),
  })
}
