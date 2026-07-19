/**
 * @alias 재직/프로젝트 기간
 * @description 시작·종료일로 표현하는 커리어/프로젝트 기간. end가 없으면 재직중으로 간주한다.
 */
export interface DateRange {
  /**
   * @alias 시작일
   * @description ISO `YYYY-MM-DD` 형식의 시작일.
   */
  start: string

  /**
   * @alias 종료일
   * @description ISO `YYYY-MM-DD` 형식의 종료일. 없으면(또는 null이면) 재직중.
   */
  end?: string | null
}
