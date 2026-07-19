import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

type ModalProps = {
  /**
   * @alias 열림
   * @description true면 모달을 표시한다.
   */
  open: boolean

  /**
   * @alias 제목
   * @description 모달 헤더 텍스트.
   */
  title: string

  /**
   * @alias 닫기 핸들러
   * @description 백드롭/닫기 버튼 클릭 시 호출.
   */
  onClose: () => void

  /**
   * @alias 본문
   * @description 모달 콘텐츠.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 모달
 * @description 중앙 다이얼로그 atom. 안내·폼 등에 사용.
 */
export function Modal({ open, title, onClose, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label="닫기"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0c121a]/95 p-4 shadow-2xl',
              className,
            )}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              <Button variant="ghost" onClick={onClose}>
                닫기
              </Button>
            </div>
            <div className="text-sm leading-relaxed text-muted">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
