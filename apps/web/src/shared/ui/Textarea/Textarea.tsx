import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * @alias 공통 텍스트영역
 * @description 긴 텍스트 입력용 atom.
 */
export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full resize-y rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-accent-2/60',
        className,
      )}
      {...props}
    />
  )
}
