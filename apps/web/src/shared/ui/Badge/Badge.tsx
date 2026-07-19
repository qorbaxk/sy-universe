import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Badge.css'

type BadgeProps = {
  children: ReactNode
  tone?: 'accent' | 'soft'
  className?: string
}

export function Badge({ children, tone = 'accent', className }: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge--${tone}`, className)}>
      {children}
    </span>
  )
}
