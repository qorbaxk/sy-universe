import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /**
   * @alias 자식
   * @description 라벨 텍스트.
   */
  children: ReactNode
}

/**
 * @alias 공통 라벨
 * @description 폼 필드 레이블 atom.
 */
export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn('mb-1.5 block text-xs font-medium text-muted', className)}
      {...props}
    >
      {children}
    </label>
  )
}
