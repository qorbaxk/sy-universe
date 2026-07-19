/**
 * @alias 포트폴리오 쿼리 키
 * @description React Query 캐시 키 팩토리.
 */
export const portfolioKeys = {
  all: ['portfolio'] as const,
  snapshot: () => [...portfolioKeys.all, 'snapshot'] as const,
}
