import type { ReactNode, SyntheticEvent } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useMediaQuery } from '@/shared/lib/media/useMediaQuery'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'
import './Panel.css'

type PanelProps = {
  open: boolean
  onClose: () => void
  header?: ReactNode
  children: ReactNode
  className?: string
}

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
          // PC ↔ 모바일 전환 시 transform/drag 상태가 꼬이지 않도록 모드별 리마운트
          key={isMobile ? 'panel-sheet' : 'panel-side'}
          className={cn(
            'ui-panel',
            isMobile && 'ui-panel--sheet',
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
            if (info.offset.y > 110 || info.velocity.y > 650) {
              onClose()
            }
          }}
        >
          <div className="ui-panel__chrome">
            {isMobile && (
              <div
                className="ui-panel__handle-wrap"
                aria-hidden
                onPointerDown={(event) => dragControls.start(event)}
              >
                <span className="ui-panel__handle" />
              </div>
            )}

            <div className="ui-panel__header">
              <Button
                className="ui-panel__close"
                variant="ghost"
                type="button"
                aria-label="닫기"
                onClick={handleClose}
                onPointerDown={(event) => event.stopPropagation()}
              >
                닫기
              </Button>
              {header}
            </div>
          </div>

          <div className="ui-panel__body">{children}</div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
