import type { ReactNode } from 'react'
import {
  getDetailForNode,
  profile,
  skills,
  type GraphNode,
} from '@/entities/portfolio'
import { Badge } from '@/shared/ui/Badge'
import { Chip } from '@/shared/ui/Chip'
import { ChipRow } from '@/shared/ui/ChipRow'
import { Eyebrow } from '@/shared/ui/Eyebrow'
import { Panel } from '@/shared/ui/Panel'
import './DetailPanel.css'

type DetailPanelProps = {
  node: GraphNode | null
  onClose: () => void
}

function buildHeader(node: GraphNode): ReactNode {
  const detail = getDetailForNode(node.id)
  if (!detail) return null

  if (detail.type === 'me') {
    return (
      <>
        <Eyebrow>{profile.title}</Eyebrow>
        <h2>{profile.name}</h2>
      </>
    )
  }
  if (detail.type === 'career') {
    return (
      <>
        <Eyebrow>Career</Eyebrow>
        <h2>경력 타임라인</h2>
      </>
    )
  }
  if (detail.type === 'company') {
    return (
      <>
        <Eyebrow>Company</Eyebrow>
        <h2>{detail.company.name}</h2>
      </>
    )
  }
  if (detail.type === 'project') {
    return (
      <>
        <Eyebrow>{detail.project.company}</Eyebrow>
        <h2>{detail.project.name}</h2>
      </>
    )
  }
  if (detail.type === 'skills') {
    return (
      <>
        <Eyebrow>Skills</Eyebrow>
        <h2>기술 스택</h2>
      </>
    )
  }
  return (
    <>
      <Eyebrow>Contact</Eyebrow>
      <h2>연락하기</h2>
    </>
  )
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  const detail = node ? getDetailForNode(node.id) : null
  const header = node ? buildHeader(node) : null

  return (
    <Panel
      open={Boolean(node && detail)}
      onClose={onClose}
      header={header}
    >
      {detail?.type === 'me' && (
        <section className="detail-content">
          <p className="detail-content__lead">{profile.headline}</p>
          <p>{profile.bio}</p>
          <Badge>{profile.experienceLabel}</Badge>
        </section>
      )}

      {detail?.type === 'career' && (
        <section className="detail-content">
          <p className="detail-content__lead">
            첫 회사부터 현재까지, 제품 화면을 만들며 쌓아온 실무 기간입니다.
          </p>
          <ol className="detail-timeline">
            {detail.companies.map((company) => (
              <li key={company.id}>
                <strong>{company.name}</strong>
                <span>
                  {company.period} · {company.duration}
                </span>
                <p>{company.summary}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {detail?.type === 'company' && (
        <section className="detail-content">
          <p className="detail-content__lead">{detail.company.role}</p>
          <Badge>
            {detail.company.period} · {detail.company.duration}
          </Badge>
          <p>{detail.company.summary}</p>
        </section>
      )}

      {detail?.type === 'project' && (
        <section className="detail-content">
          <p className="detail-content__lead">{detail.project.summary}</p>
          {detail.project.status === 'placeholder' && (
            <p className="detail-content__note">
              역할·성과 상세는 이후 프로젝트 자료를 보고 보강 예정입니다.
            </p>
          )}
          <h3>Highlights</h3>
          <ul>
            {detail.project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Stack</h3>
          <ChipRow>
            {detail.project.stack.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          {detail.project.links && detail.project.links.length > 0 && (
            <>
              <h3>Links</h3>
              <ChipRow>
                {detail.project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
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
        <section className="detail-content">
          <p className="detail-content__lead">
            프론트엔드 구현과 제품 UX를 중심으로 쌓아온 역량입니다.
          </p>
          <h3>Core</h3>
          <ChipRow>
            {skills.core.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          <h3>Product</h3>
          <ChipRow>
            {skills.product.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
          <h3>Tooling</h3>
          <ChipRow>
            {skills.tooling.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ChipRow>
        </section>
      )}

      {detail?.type === 'contact' && (
        <section className="detail-content">
          <p className="detail-content__lead">
            이직 제안, 협업, 포트폴리오 관련 문의 환영합니다.
          </p>
          <ChipRow>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.links.resume}>Resume</a>
          </ChipRow>
        </section>
      )}
    </Panel>
  )
}
