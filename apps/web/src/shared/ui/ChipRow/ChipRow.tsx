import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type ChipRowProps = {
  /**
   * @alias 자식
   * @description Chip 또는 링크들의 나열.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 칩 행
 * @description Chip들을 wrap하며 가로로 배치하는 레이아웃 atom.
 */
export function ChipRow({ children, className }: ChipRowProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
  )
}
