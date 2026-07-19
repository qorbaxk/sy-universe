/**
 * @alias 프로필 링크
 * @description 외부로 연결되는 이력서·GitHub 등 URL 모음.
 */
export interface ProfileLinks {
  /**
   * @alias GitHub URL
   * @description GitHub 프로필 주소.
   */
  github: string

  /**
   * @alias 이력서 URL
   * @description 이력서/포트폴리오 PDF 또는 페이지 주소.
   */
  resume: string
}

/**
 * @alias 프로필
 * @description 포트폴리오 주인공(나)의 기본 소개 정보.
 */
export interface Profile {
  /**
   * @alias 이름
   * @description 한글 표시 이름.
   */
  name: string

  /**
   * @alias 영문 이름
   * @description 영문 표기 이름.
   */
  nameEn: string

  /**
   * @alias 직함
   * @description 예: Frontend Developer.
   */
  title: string

  /**
   * @alias 헤드라인
   * @description 한 줄 소개 문구.
   */
  headline: string

  /**
   * @alias 소개
   * @description 상세 자기소개 본문.
   */
  bio: string

  /**
   * @alias 위치
   * @description 거주/활동 지역 표기.
   */
  location: string

  /**
   * @alias 이메일
   * @description 연락용 이메일 주소.
   */
  email: string

  /**
   * @alias 외부 링크
   * @description GitHub·이력서 등 외부 링크.
   */
  links: ProfileLinks
}
