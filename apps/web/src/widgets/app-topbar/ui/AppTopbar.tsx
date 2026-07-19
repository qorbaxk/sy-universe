import { motion } from 'framer-motion'
import type { Profile } from '@/entities/portfolio'

type AppTopbarProps = {
  /**
   * @alias 프로필
   * @description 탑바에 표시할 이름·직함·이메일.
   */
  profile: Profile
}

/**
 * @alias 앱 탑바
 * @description 브랜드·조작 힌트·Contact CTA.
 */
export function AppTopbar({ profile }: AppTopbarProps) {
  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 py-4"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-auto flex items-center gap-3">
        <span
          className="size-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(232,184,109,0.7)]"
          aria-hidden
        />
        <div className="flex flex-col leading-tight">
          <strong className="font-display text-sm text-ink">{profile.name}</strong>
          <span className="text-xs text-muted">{profile.title}</span>
        </div>
      </div>

      <p className="pointer-events-none hidden text-xs text-muted md:block">
        드래그로 회전 · 스크롤 줌 · 노드를 잡아 옮겨보세요
      </p>

      <a
        className="pointer-events-auto rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm text-ink transition hover:border-accent-2/40 hover:bg-white/[0.07]"
        href={`mailto:${profile.email}`}
      >
        Contact
      </a>
    </motion.header>
  )
}
