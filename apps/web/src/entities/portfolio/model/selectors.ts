import type {
  GraphNode,
  PortfolioSnapshot,
} from './types'

/**
 * @alias 노드 ID 조회
 * @description 그래프 노드 배열에서 id로 노드를 찾는다.
 */
export function getNodeById(nodes: GraphNode[], id: string | null) {
  if (!id) return null
  return nodes.find((node) => node.id === id) ?? null
}

/**
 * @alias 노드 상세 타입
 * @description 디테일 패널이 렌더할 상세 유니온.
 */
export type NodeDetail =
  | { type: 'me' }
  | { type: 'career'; companies: PortfolioSnapshot['companies'] }
  | { type: 'skills'; skills: PortfolioSnapshot['skills'] }
  | { type: 'contact'; profile: PortfolioSnapshot['profile'] }
  | {
      type: 'company'
      company: PortfolioSnapshot['companies'][number]
    }
  | {
      type: 'project'
      project: PortfolioSnapshot['projects'][number]
    }

/**
 * @alias 노드 상세 조회
 * @description 스냅샷과 노드 ID로 디테일 패널 뷰모델을 만든다.
 */
export function getDetailForNode(
  snapshot: PortfolioSnapshot,
  nodeId: string,
): NodeDetail | null {
  if (nodeId === 'me') return { type: 'me' }
  if (nodeId === 'career') {
    return { type: 'career', companies: snapshot.companies }
  }
  if (nodeId === 'skills') return { type: 'skills', skills: snapshot.skills }
  if (nodeId === 'contact') {
    return { type: 'contact', profile: snapshot.profile }
  }

  const company = snapshot.companies.find((item) => item.id === nodeId)
  if (company) return { type: 'company', company }

  const project = snapshot.projects.find((item) => item.id === nodeId)
  if (project) return { type: 'project', project }

  return null
}
