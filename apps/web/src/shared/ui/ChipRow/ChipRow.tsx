import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './ChipRow.css'

type ChipRowProps = {
  children: ReactNode
  className?: string
}

export function ChipRow({ children, className }: ChipRowProps) {
  return <div className={cn('ui-chip-row', className)}>{children}</div>
}
