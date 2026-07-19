import type { FeatureLayer, ProjectFeature } from '@/entities/portfolio'
import { Chip } from '@/shared/ui/Chip'
import { ChipRow } from '@/shared/ui/ChipRow'

const layerLabel: Record<FeatureLayer, string> = {
  frontend: '프론트',
  backend: '백엔드',
  ai: 'AI',
  infra: '인프라',
}

const layerClass: Record<FeatureLayer, string> = {
  frontend: 'border-accent/30 text-accent bg-accent/10',
  backend: 'border-accent-2/30 text-accent-2 bg-accent-2/10',
  ai: 'border-accent/40 text-accent bg-accent/12',
  infra: 'border-white/15 text-muted bg-white/5',
}

type ProjectFeaturesProps = {
  /**
   * @alias 기능 목록
   * @description 문제→해결→결과 스토리 카드.
   */
  features: ProjectFeature[]
}

/**
 * @alias 프로젝트 기능 목록
 * @description 면접관이 바로 읽도록 한글 라벨로 STAR를 풀어 쓴다.
 */
export function ProjectFeatures({ features }: ProjectFeaturesProps) {
  if (features.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="pt-1 text-[0.92rem] font-semibold text-accent-2">
        이렇게 만들었어요
      </h3>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li
            key={feature.id}
            className="space-y-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-sm text-ink">{feature.title}</strong>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${layerClass[feature.layer]}`}
              >
                {layerLabel[feature.layer]}
              </span>
            </div>

            <dl className="space-y-2 text-xs leading-relaxed">
              <div>
                <dt className="mb-0.5 font-semibold text-accent">문제</dt>
                <dd>{feature.star.situation}</dd>
              </div>
              <div>
                <dt className="mb-0.5 font-semibold text-muted">목표</dt>
                <dd>{feature.star.task}</dd>
              </div>
              <div>
                <dt className="mb-0.5 font-semibold text-accent-2">해결</dt>
                <dd>{feature.star.action}</dd>
              </div>
              <div>
                <dt className="mb-0.5 font-semibold text-ink">결과</dt>
                <dd className="text-ink/90">{feature.star.result}</dd>
              </div>
            </dl>

            {feature.stack && feature.stack.length > 0 && (
              <ChipRow>
                {feature.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ChipRow>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
