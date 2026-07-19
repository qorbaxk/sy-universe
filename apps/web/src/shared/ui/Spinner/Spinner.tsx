import { cn } from '@/shared/lib/cn'

type SpinnerProps = {
  className?: string
}

/**
 * @alias 스피너
 * @description 로딩 표시 atom.
 */
export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'size-8 animate-spin rounded-full border-2 border-white/15 border-t-accent-2',
        className,
      )}
      role="status"
      aria-label="로딩 중"
    />
  )
}
