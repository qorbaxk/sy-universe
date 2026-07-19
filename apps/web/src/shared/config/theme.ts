/**
 * @alias 테마 토큰
 * @description Tailwind 외 Three/캔버스 등 JS에서 직접 참조하는 색·크기 토큰.
 */
export const theme = {
  colors: {
    bg: '#070b10',
    ink: '#f3efe6',
    muted: '#9aa8b5',
    accent: '#e8b86d',
    accentSoft: '#7cdbd5',
    line: 'rgba(255,255,255,0.08)',
    node: {
      me: '#ffb347',
      career: '#c2b29a',
      company: '#3f8fdc',
      project: '#4d7cff',
      featured: '#e6c27a',
      skills: '#7ec8c8',
      contact: '#cfd6df',
    },
  },
  nodeSize: {
    me: 17,
    career: 7,
    company: 8,
    project: 10,
    featured: 12,
    skills: 9,
    contact: 7,
  },
} as const
