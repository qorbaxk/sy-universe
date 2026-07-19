import { companies, profile, projects, skills } from './data'
import type { GraphNode } from './types'

export function getNodeById(nodes: GraphNode[], id: string | null) {
  if (!id) return null
  return nodes.find((node) => node.id === id) ?? null
}

export function getDetailForNode(nodeId: string) {
  if (nodeId === 'me') return { type: 'me' as const }
  if (nodeId === 'career') return { type: 'career' as const, companies }
  if (nodeId === 'skills') return { type: 'skills' as const, skills }
  if (nodeId === 'contact') return { type: 'contact' as const, profile }

  const company = companies.find((item) => item.id === nodeId)
  if (company) return { type: 'company' as const, company }

  const project = projects.find((item) => item.id === nodeId)
  if (project) return { type: 'project' as const, project }

  return null
}
