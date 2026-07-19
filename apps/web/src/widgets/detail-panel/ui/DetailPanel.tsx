import type { ReactNode } from 'react'
import type { GraphNode, PortfolioSnapshot } from '@/entities/portfolio'
import { Badge } from '@/shared/ui/Badge'
import { Chip } from '@/shared/ui/Chip'
import { ChipRow } from '@/shared/ui/ChipRow'
import { Eyebrow } from '@/shared/ui/Eyebrow'
import { Panel } from '@/shared/ui/Panel'
import { useDetailPanelModel } from '../hooks/useDetailPanelModel'

type DetailPanelProps = {
  /**
   * @alias 포트폴리오 스냅샷
   * @description React Query로 로드한 원본 데이터.
   */
  snapshot?: PortfolioSnapshot

  /**
   * @alias 선택 노드
   * @description 패널에 표시할 그래프 노드.
   */
  node: GraphNode | null

  /**
   * @alias 닫기
   * @description 패널 닫기 핸들러.
   */
  onClose: () => void
}

/**
 * @alias 디테일 패널
 * @description 선택 노드의 상세 정보를 보여준다. UI만 담당.
 */
export function DetailPanel({ snapshot, node, onClose }: DetailPanelProps) {
  const { detail, experienceLabel, formatCareerPeriod, formatDuration } =
    useDetailPanelModel(snapshot, node)

  const header = buildHeader(snapshot, node, detail)

  return (
    <Panel open={Boolean(node && detail)} onClose={onClose} header={header}>
      {detail?.type === 'me' && snapshot && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">{snapshot.profile.headline}</p>
          <p>{snapshot.profile.bio}</p>
          <Badge variant="accent">{experienceLabel}</Badge>
        </section>
      )}

      {detail?.type === 'career' && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">
            첫 회사부터 현재까지, 제품 화면을 만들며 쌓아온 실무 기간입니다.
          </p>
          <ol className="space-y-4 border-l border-white/10 pl-4">
            {detail.companies.map((company) => (
              <li key={company.id} className="space-y-1">
                <strong className="text-ink">{company.name}</strong>
                <span className="block text-[0.85rem] text-accent">
                  {formatCareerPeriod?.(company.period)} ·{' '}
                  {formatDuration?.(company.period)}
                </span>
                <p>{company.summary}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {detail?.type === 'company' && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">{detail.company.role}</p>
          <Badge variant="accent">
            {formatCareerPeriod?.(detail.company.period)} ·{' '}
            {formatDuration?.(detail.company.period)}
          </Badge>
          <p>{detail.company.summary}</p>
        </section>
      )}

      {detail?.type === 'project' && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">{detail.project.summary}</p>
          {detail.project.status === 'placeholder' && (
            <p className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent">
              역할·성과 상세는 이후 프로젝트 자료를 보고 보강 예정입니다.
            </p>
          )}
          <h3 className="pt-1 text-[0.92rem] font-semibold text-accent-2">
            Highlights
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {detail.project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="pt-1 text-[0.92rem] font-semibold text-accent-2">
            Stack
          </h3>
          <ChipRow>
            {detail.project.stack.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          {detail.project.links && detail.project.links.length > 0 && (
            <>
              <h3 className="pt-1 text-[0.92rem] font-semibold text-accent-2">
                Links
              </h3>
              <ChipRow>
                {detail.project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-accent-2/30 px-2 py-1 text-xs text-accent-2 hover:bg-accent-2/10"
                  >
                    {link.label}
                  </a>
                ))}
              </ChipRow>
            </>
          )}
        </section>
      )}

      {detail?.type === 'skills' && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">
            프론트엔드 구현과 제품 UX를 중심으로 쌓아온 역량입니다.
          </p>
          <h3 className="text-[0.92rem] font-semibold text-accent-2">Core</h3>
          <ChipRow>
            {detail.skills.core.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          <h3 className="text-[0.92rem] font-semibold text-accent-2">Product</h3>
          <ChipRow>
            {detail.skills.product.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          <h3 className="text-[0.92rem] font-semibold text-accent-2">Tooling</h3>
          <ChipRow>
            {detail.skills.tooling.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
        </section>
      )}

      {detail?.type === 'contact' && snapshot && (
        <section className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="text-base text-ink">
            이직 제안, 협업, 포트폴리오 관련 문의 환영합니다.
          </p>
          <ChipRow>
            <a
              href={`mailto:${snapshot.profile.email}`}
              className="rounded-md border border-white/12 px-2 py-1 text-xs text-ink hover:bg-white/5"
            >
              {snapshot.profile.email}
            </a>
            <a
              href={snapshot.profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/12 px-2 py-1 text-xs text-ink hover:bg-white/5"
            >
              GitHub
            </a>
            <a
              href={snapshot.profile.links.resume}
              className="rounded-md border border-white/12 px-2 py-1 text-xs text-ink hover:bg-white/5"
            >
              Resume
            </a>
          </ChipRow>
        </section>
      )}
    </Panel>
  )
}

function buildHeader(
  snapshot: PortfolioSnapshot | undefined,
  node: GraphNode | null,
  detail: ReturnType<typeof useDetailPanelModel>['detail'],
): ReactNode {
  if (!node || !detail || !snapshot) return null

  if (detail.type === 'me') {
    return (
      <>
        <Eyebrow variant="accent">{snapshot.profile.title}</Eyebrow>
        <h2>{snapshot.profile.name}</h2>
      </>
    )
  }
  if (detail.type === 'career') {
    return (
      <>
        <Eyebrow variant="accent">Career</Eyebrow>
        <h2>경력 타임라인</h2>
      </>
    )
  }
  if (detail.type === 'company') {
    return (
      <>
        <Eyebrow variant="accent">Company</Eyebrow>
        <h2>{detail.company.name}</h2>
      </>
    )
  }
  if (detail.type === 'project') {
    return (
      <>
        <Eyebrow variant="accent">{detail.project.company}</Eyebrow>
        <h2>{detail.project.name}</h2>
      </>
    )
  }
  if (detail.type === 'skills') {
    return (
      <>
        <Eyebrow variant="accent">Skills</Eyebrow>
        <h2>기술 스택</h2>
      </>
    )
  }
  return (
    <>
      <Eyebrow variant="accent">Contact</Eyebrow>
      <h2>연락하기</h2>
    </>
  )
}
