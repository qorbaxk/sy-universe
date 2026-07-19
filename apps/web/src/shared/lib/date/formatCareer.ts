import type { DateRange } from '@/entities/portfolio/model/types'

/**
 * @alias ISO 날짜 파싱
 * @description `YYYY-MM-DD` 문자열을 Date로 변환한다. 실패 시 null.
 */
export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

/**
 * @alias 연·월 차이
 * @description from→to 구간의 경과를 년/개월로 계산한다.
 */
export function diffYearsMonths(from: Date, to: Date) {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  if (to.getDate() < from.getDate()) months -= 1
  if (months < 0) months = 0
  const years = Math.floor(months / 12)
  const restMonths = months % 12
  return { years, months: restMonths, totalMonths: months }
}

/**
 * @alias 기간 라벨
 * @description DateRange를 `2025.05 — 현재` 형태로 포맷한다.
 */
export function formatCareerPeriod(
  range: DateRange,
  today: Date = new Date(),
): string {
  const start = parseISODate(range.start)
  if (!start) return ''

  const startLabel = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(2, '0')}`
  if (!range.end) {
    return `${startLabel} — 현재`
  }

  const end = parseISODate(range.end)
  if (!end) return startLabel

  // end가 오늘 이후면 현재로 표기
  if (end.getTime() > today.getTime()) {
    return `${startLabel} — 현재`
  }

  const endLabel = `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, '0')}`
  return `${startLabel} — ${endLabel}`
}

/**
 * @alias 기간 길이 라벨
 * @description DateRange를 `약 1년 2개월` 형태로 포맷한다.
 */
export function formatDuration(
  range: DateRange,
  today: Date = new Date(),
): string {
  const start = parseISODate(range.start)
  if (!start) return ''

  const end = range.end ? (parseISODate(range.end) ?? today) : today
  const { years, months } = diffYearsMonths(start, end)

  if (years === 0 && months === 0) return '1개월 미만'
  if (years === 0) return `약 ${months}개월`
  if (months === 0) return `약 ${years}년`
  return `약 ${years}년 ${months}개월`
}

/**
 * @alias 총 경력 라벨
 * @description 여러 회사 기간을 합쳐 `실무 N년 N개월 · M년차` 형태로 만든다.
 */
export function formatTotalExperience(
  periods: DateRange[],
  today: Date = new Date(),
): string {
  let totalMonths = 0
  for (const period of periods) {
    const start = parseISODate(period.start)
    if (!start) continue
    const end = period.end ? (parseISODate(period.end) ?? today) : today
    totalMonths += diffYearsMonths(start, end).totalMonths
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const yearLabel = years > 0 ? `${years}년` : ''
  const monthLabel = months > 0 ? `${months}개월` : years > 0 ? '' : '1개월 미만'
  const experience = [yearLabel, monthLabel].filter(Boolean).join(' ')
  const careerYear = Math.max(1, years + (months > 0 ? 1 : 0))
  return `실무 ${experience} · ${careerYear}년차`
}
