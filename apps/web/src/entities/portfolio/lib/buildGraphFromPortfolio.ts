import {
  formatCareerPeriod,
  formatTotalExperience,
} from '@/shared/lib/date/formatCareer'
import type {
  GraphData,
  GraphLink,
  GraphNode,
  PortfolioSnapshot,
} from '../model/types'

/**
 * @alias 포트폴리오 → 그래프 변환
 * @description 스냅샷의 회사·프로젝트 문서로부터 그래프 노드/링크를 자동 생성한다.
 * 프로젝트 JSON만 추가하면 노드가 늘어나는 확장 포인트.
 */
export function buildGraphFromPortfolio(
  snapshot: PortfolioSnapshot,
  today: Date = new Date(),
): GraphData {
  const companies = [...snapshot.companies].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )
  const projects = [...snapshot.projects].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )

  const experienceLabel = formatTotalExperience(
    companies.map((c) => c.period),
    today,
  )

  const nodes: GraphNode[] = [
    {
      id: 'me',
      kind: 'me',
      label: snapshot.profile.name,
      subtitle: snapshot.profile.title,
    },
    {
      id: 'career',
      kind: 'career',
      label: 'Career',
      subtitle: experienceLabel,
    },
    {
      id: 'skills',
      kind: 'skills',
      label: 'Skills',
      subtitle: snapshot.skills.core.slice(0, 2).join(' · ') || 'Skills',
    },
    {
      id: 'contact',
      kind: 'contact',
      label: 'Contact',
      subtitle: '이력서 · GitHub',
    },
  ]

  const links: GraphLink[] = [
    { source: 'me', target: 'career' },
    { source: 'me', target: 'skills', highlight: true },
    { source: 'me', target: 'contact' },
  ]

  for (const company of companies) {
    nodes.push({
      id: company.id,
      kind: 'company',
      label: company.name,
      subtitle: formatCareerPeriod(company.period, today),
    })
    links.push({ source: 'career', target: company.id })
  }

  for (const project of projects) {
    const company = companies.find((item) => item.id === project.companyId)
    const parent = project.parentId
      ? projects.find((item) => item.id === project.parentId)
      : undefined

    nodes.push({
      id: project.id,
      kind: 'project',
      label: project.name,
      subtitle: project.featured
        ? `${project.company} · Featured`
        : parent
          ? parent.name
          : (company?.name ?? project.company),
      featured: project.featured,
    })

    if (project.featured || !project.parentId) {
      links.push({
        source: 'me',
        target: project.id,
        highlight: Boolean(project.featured),
      })
    }

    if (project.parentId) {
      links.push({ source: project.parentId, target: project.id })
    } else if (project.companyId) {
      links.push({ source: project.companyId, target: project.id })
    }
  }

  return { nodes, links }
}
