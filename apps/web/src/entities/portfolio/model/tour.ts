/**
 * @alias 투어 스텝
 * @description 가이드 투어의 한 단계.
 */
export type TourStep = {
  /**
   * @alias 노드 ID
   * @description 이 스텝에서 포커스할 그래프 노드.
   */
  id: string

  /**
   * @alias 제목
   * @description 투어 카드 제목.
   */
  title: string

  /**
   * @alias 설명
   * @description 투어 카드 본문.
   */
  description: string
}

/**
 * @alias 기본 투어 스텝
 * @description 면접관 시선 기준 추천 관람 순서. 프로젝트 추가 시 여기도 보강하면 된다.
 */
export const tourSteps: TourStep[] = [
  {
    id: 'me',
    title: '승연',
    description: '먼저 나를 소개할게요. 프론트엔드 개발자로서의 한 줄 요약입니다.',
  },
  {
    id: 'career',
    title: 'Career',
    description: '전체 경력 타임라인을 먼저 보고, 회사별로 내려가 볼게요.',
  },
  {
    id: 'connectwave',
    title: '커넥트웨이브',
    description: '현재 재직 중인 회사입니다.',
  },
  {
    id: 'sellfit',
    title: '셀핏AI',
    description: '지금 가장 적극적으로 보여줄 Featured 프로젝트예요.',
  },
  {
    id: 'nextinnovation',
    title: '넥스트이노베이션',
    description: '첫 회사에서 쌓은 실무 경험을 이어서 볼게요.',
  },
  {
    id: 'samsung-hospital',
    title: '강북삼성병원 예약',
    description: '복잡한 도메인 플로우를 정리한 웹예약 프로젝트입니다.',
  },
  {
    id: 'reason-market',
    title: '리즌마켓 어드민',
    description: '운영자가 쓰는 어드민 UX 경험입니다.',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: '화면을 만들며 쌓아온 핵심 스택을 정리했어요.',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: '마지막은 연락처와 이력서입니다.',
  },
]
