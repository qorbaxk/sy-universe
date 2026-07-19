import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Eyebrow.css'

type EyebrowProps = {
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={cn('ui-eyebrow', className)}>{children}</p>
}
