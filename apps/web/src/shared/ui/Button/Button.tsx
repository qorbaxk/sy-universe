import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * @alias 버튼 variant
 * @description ghost / accent / outline 시각 스타일.
 */
export type ButtonVariant = 'ghost' | 'accent' | 'outline'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * @alias 스타일 variant
   * @description 기본값은 ghost.
   */
  variant?: ButtonVariant

  /**
   * @alias 자식
   * @description 버튼 라벨/아이콘.
   */
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  ghost:
    'bg-transparent text-muted border border-white/10 hover:text-ink hover:bg-white/5',
  accent:
    'bg-accent text-[#14110c] hover:brightness-105 border border-transparent font-semibold',
  outline:
    'bg-transparent text-accent border border-accent/45 hover:bg-accent hover:text-[#14110c]',
}

/**
 * @alias 공통 버튼
 * @description 포트폴리오 전역에서 쓰는 atom 버튼.
 */
export function Button({
  variant = 'ghost',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
