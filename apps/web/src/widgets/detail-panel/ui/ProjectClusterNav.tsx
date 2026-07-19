import type { ProjectDetail } from '@/entities/portfolio'
import { cn } from '@/shared/lib/cn'

type ProjectClusterNavProps = {
  /**
   * @alias 현재 프로젝트
   * @description 허브면 위성 목록, 위성이면 부모·형제 목록을 만든다.
   */
  project: ProjectDetail

  /**
   * @alias 전체 프로젝트
   * @description parentId 관계 조회용.
   */
  projects: ProjectDetail[]

  /**
   * @alias 노드 이동
   * @description 선택 + 카메라 포커스까지 페이지에서 처리.
   */
  onNavigate: (projectId: string) => void
}

/**
 * @alias 프로젝트 클러스터 내비
 * @description 셀핏 허브↔위성처럼 연결된 노드를 패널 안에서 바로 이동한다.
 */
export function ProjectClusterNav({
  project,
  projects,
  onNavigate,
}: ProjectClusterNavProps) {
  const parent = project.parentId
    ? projects.find((item) => item.id === project.parentId)
    : undefined
  const children = projects
    .filter((item) => item.parentId === project.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const siblings = parent
    ? projects
        .filter(
          (item) =>
            item.parentId === parent.id && item.id !== project.id,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : []

  if (!parent && children.length === 0) return null

  return (
    <nav
      aria-label="관련 기능 이동"
      className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
    >
      {parent && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            상위 프로젝트
          </p>
          <button
            type="button"
            onClick={() => onNavigate(parent.id)}
            className="inline-flex w-full items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-left text-sm text-accent transition hover:bg-accent/18"
          >
            <span aria-hidden className="text-xs">
              ←
            </span>
            <span className="font-medium">{parent.name}</span>
            <span className="ml-auto text-[11px] text-accent/80">돌아가기</span>
          </button>
        </div>
      )}

      {children.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            관련 기능 · 눌러서 이동
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {children.map((child) => (
              <li key={child.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(child.id)}
                  className="rounded-full border border-accent-2/35 bg-accent-2/10 px-2.5 py-1 text-xs text-accent-2 transition hover:bg-accent-2/20"
                >
                  {child.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {siblings.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            같은 프로젝트의 다른 기능
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(sibling.id)}
                  className={cn(
                    'rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-xs text-ink transition hover:border-accent/40 hover:bg-white/[0.07]',
                  )}
                >
                  {sibling.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
