/**
 * @alias 스킬 묶음
 * @description 코어·프로덕트·툴링으로 나눈 기술 스택 목록.
 */
export interface Skills {
  /**
   * @alias 코어 스택
   * @description 언어/프레임워크 등 기반 기술.
   */
  core: string[]

  /**
   * @alias 프로덕트 역량
   * @description UX·도메인·협업 관련 키워드.
   */
  product: string[]

  /**
   * @alias 툴링
   * @description 빌드·협업·배포 도구.
   */
  tooling: string[]
}
