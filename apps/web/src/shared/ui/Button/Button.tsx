import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'ghost' | 'accent' | 'outline'
  children: ReactNode
}

export function Button({
  variant = 'ghost',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn('ui-button', `ui-button--${variant}`, className)}
      {...props}
    >
      {children}
    </button>
  )
}
