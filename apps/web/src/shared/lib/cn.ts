import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @alias 클래스 병합
 * @description clsx로 조건부 클래스를 모은 뒤 tailwind-merge로 충돌을 정리한다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
