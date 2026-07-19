import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Chip.css'

type ChipProps = {
  children: ReactNode
  className?: string
}

export function Chip({ children, className }: ChipProps) {
  return <span className={cn('ui-chip', className)}>{children}</span>
}
