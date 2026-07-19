import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * @alias 자식
   * @description 아이콘 또는 짧은 라벨.
   */
  children: ReactNode
}

/**
 * @alias 아이콘 버튼
 * @description 정사각에 가까운 아이콘용 버튼 atom.
 */
export function IconButton({ className, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-ink transition hover:bg-white/[0.08]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
