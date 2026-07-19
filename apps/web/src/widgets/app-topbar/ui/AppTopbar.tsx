import { motion } from 'framer-motion'
import type { Profile } from '@/entities/portfolio'
import { cn } from '@/shared/lib/cn'

/**
 * @alias Contact CTA 톤
 * @description accent(골드 아웃라인) / neutral.
 */
export type AppTopbarCtaVariant = 'accent' | 'neutral'

type AppTopbarProps = {
  /**
   * @alias 프로필
   * @description 탑바에 표시할 이름·직함·이메일.
   */
  profile: Profile

  /**
   * @alias Contact CTA 스타일
   * @description 기본값은 accent(골드).
   */
  ctaVariant?: AppTopbarCtaVariant
}

const ctaClass: Record<AppTopbarCtaVariant, string> = {
  accent:
    'rounded-full border border-accent/45 px-4 py-2.5 text-sm text-accent transition hover:bg-accent hover:text-[#14110c]',
  neutral:
    'rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm text-ink transition hover:border-accent-2/40 hover:bg-white/[0.07]',
}

/**
 * @alias 앱 탑바
 * @description 브랜드·조작 힌트·Contact CTA.
 */
export function AppTopbar({
  profile,
  ctaVariant = 'accent',
}: AppTopbarProps) {
  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 py-4 pt-[calc(0.875rem+env(safe-area-inset-top,0px))]"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-auto flex items-center gap-3">
        <span
          className="size-3 animate-[pulse-mark_2.4s_ease-in-out_infinite] rounded-full bg-accent shadow-[0_0_0_6px_rgba(232,184,109,0.12)]"
          aria-hidden
        />
        <div className="flex flex-col leading-tight">
          <strong className="font-display text-[1.05rem] tracking-tight text-ink">
            {profile.name}
          </strong>
          <span className="text-[0.82rem] text-muted">{profile.title}</span>
        </div>
      </div>

      <p className="pointer-events-none hidden text-[0.82rem] text-muted md:block">
        드래그로 회전 · 스크롤 줌 · 노드를 잡아 옮겨보세요
      </p>

      <a
        className={cn('pointer-events-auto no-underline', ctaClass[ctaVariant])}
        href={`mailto:${profile.email}`}
      >
        Contact
      </a>
    </motion.header>
  )
}
