import type { ReactNode, SyntheticEvent } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { useMediaQuery } from '@/shared/lib/media/useMediaQuery'
import { Button } from '@/shared/ui/Button'

type PanelProps = {
  /**
   * @alias 열림
   * @description true면 패널을 표시한다.
   */
  open: boolean

  /**
   * @alias 닫기 핸들러
   * @description 닫기 버튼/스와이프 시 호출.
   */
  onClose: () => void

  /**
   * @alias 헤더
   * @description 제목 영역 슬롯.
   */
  header?: ReactNode

  /**
   * @alias 본문
   * @description 패널 스크롤 영역 콘텐츠.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 상세 패널
 * @description PC는 우측 플로팅, 모바일은 바텀시트.
 */
export function Panel({
  open,
  onClose,
  header,
  children,
  className,
}: PanelProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const dragControls = useDragControls()

  const handleClose = (event?: SyntheticEvent) => {
    event?.stopPropagation()
    onClose()
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.aside
          key={isMobile ? 'panel-sheet' : 'panel-side'}
          className={cn(
            'pointer-events-auto fixed z-40 flex flex-col border border-white/10 bg-[#0b1118]/92 text-ink shadow-2xl backdrop-blur-xl',
            isMobile
              ? 'inset-x-0 bottom-0 max-h-[78vh] rounded-t-3xl'
              : 'top-20 right-5 bottom-6 w-[min(380px,calc(100vw-2rem))] rounded-2xl',
            className,
          )}
          initial={
            isMobile
              ? { y: '100%', opacity: 1, x: 0 }
              : { opacity: 0, x: 36, y: 0, scale: 0.98 }
          }
          animate={
            isMobile
              ? { y: 0, opacity: 1, x: 0 }
              : { opacity: 1, x: 0, y: 0, scale: 1 }
          }
          exit={
            isMobile
              ? { y: '100%', opacity: 1, x: 0 }
              : { opacity: 0, x: 36, y: 0, scale: 0.98 }
          }
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          drag={isMobile ? 'y' : false}
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={isMobile ? { top: 0, bottom: 280 } : false}
          dragElastic={isMobile ? { top: 0.05, bottom: 0.35 } : 0}
          onDragEnd={(_, info) => {
            if (!isMobile) return
            if (info.offset.y > 110 || info.velocity.y > 650) onClose()
          }}
        >
          <div className="shrink-0 border-b border-white/8 px-4 pt-3 pb-3">
            {isMobile && (
              <div
                className="mb-2 flex justify-center py-1"
                aria-hidden
                onPointerDown={(event) => dragControls.start(event)}
              >
                <span className="h-1 w-10 rounded-full bg-white/25" />
              </div>
            )}

            <div className="relative pr-14">
              <Button
                className="absolute top-0 right-0"
                variant="ghost"
                type="button"
                aria-label="닫기"
                onClick={handleClose}
                onPointerDown={(event) => event.stopPropagation()}
              >
                닫기
              </Button>
              <div className="space-y-1 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink">
                {header}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
