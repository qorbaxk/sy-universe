import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * @alias 공통 인풋
 * @description 폼(react-hook-form 등)에서 재사용하는 텍스트 입력 atom.
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-accent-2/60',
        className,
      )}
      {...props}
    />
  )
}
