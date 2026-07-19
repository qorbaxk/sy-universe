# sy-universe

이직용 옵시디언형 3D 포트폴리오.

배포: https://qorbaxk.github.io/sy-universe/

---

## 모노레포 트리

```text
sy-universe/
├── apps/
│   ├── web/                          # 프론트 (Vite + React + FSD)
│   │   ├── public/
│   │   │   └── content/              # ★ 콘텐츠 문서 (여기만 수정해도 노드 증가)
│   │   │       ├── portfolio.json    # 프로필 + 회사 + 스킬
│   │   │       └── projects/
│   │   │           ├── manifest.json # 프로젝트 파일 목록
│   │   │           ├── sellfit.json
│   │   │           ├── samsung-hospital.json
│   │   │           └── reason-market.json
│   │   └── src/                      # 앱 코드 (아래 FSD 트리)
│   └── api/                          # NestJS + SQLite (로컬/서버용)
├── .github/workflows/                # GitHub Pages 배포
├── package.json                      # workspaces 루트
└── README.md
```

---

## 프론트 코드 트리 (FSD)

위에서 아래로만 의존한다. **UI는 `ui/`, 로직은 `hooks/`·`model/`·`api/`**.

```text
apps/web/src/
├── app/                              # 앱 셸
│   ├── App.tsx
│   ├── providers/QueryProvider.tsx   # React Query
│   └── styles/index.css              # Tailwind + 토큰
│
├── pages/
│   └── portfolio/ui/PortfolioPage.tsx  # 페이지 조합만 (쿼리+스토어+위젯)
│
├── widgets/                          # 페이지 단위 덩어리 UI
│   ├── portfolio-graph/
│   │   ├── ui/                       # 3D/2D 그래프 렌더
│   │   ├── hooks/useGraphViewport.ts
│   │   └── lib/focusNode.ts
│   ├── detail-panel/
│   │   ├── ui/DetailPanel.tsx
│   │   └── hooks/useDetailPanelModel.ts
│   └── app-topbar/ui/AppTopbar.tsx
│
├── features/                         # 사용자 상호작용 + 클라이언트 상태
│   ├── select-graph-node/model/      # Zustand: 선택 / 포커스
│   ├── graph-tour/                  # Zustand: 투어 + 컨트롤 UI
│   └── enable-webgl/                 # Zustand: 2D 폴백 + 안내 배너
│
├── entities/
│   └── portfolio/
│       ├── api/                      # React Query (fetch / usePortfolioQuery)
│       ├── lib/buildGraphFromPortfolio.ts  # JSON → 그래프 노드/링크
│       └── model/                    # 타입(JSDoc) · celestial · tour · selectors
│
└── shared/
    ├── ui/                           # atoms (Button, Input, Modal…) — Storybook 대상
    ├── lib/                          # cn, date, three, webgl
    └── config/theme.ts
```

### 데이터 흐름 (한 줄)

`public/content/*.json` → `usePortfolioQuery` → `buildGraphFromPortfolio` → 그래프 위젯  
선택/투어는 Zustand, 서버 데이터는 React Query.

---

## ★ 노드를 늘리려면 어디에 넣나?

콘텐츠는 **코드가 아니라 JSON 문서**다. 그래프 노드는 `buildGraphFromPortfolio`가 자동 생성한다.

### 1) 회사(경력) 노드 추가

파일: [`apps/web/public/content/portfolio.json`](apps/web/public/content/portfolio.json)

`companies` 배열에 객체를 추가한다.

```json
{
  "id": "new-company",
  "name": "새회사",
  "role": "Frontend Developer",
  "period": { "start": "2026-01-01", "end": null },
  "summary": "한 줄 설명",
  "sortOrder": 2
}
```

- `id` → 그래프 회사 노드 ID (`career` 아래 연결)
- `period.end`가 `null`이면 재직중, 라벨/기간은 **오늘 날짜 기준** 계산
- (선택) 행성 색: `src/entities/portfolio/model/celestial.ts`에 같은 `id` 매핑

### 2) 프로젝트 노드 추가

1. 파일 생성: `apps/web/public/content/projects/{id}.json`
2. 목록 등록: `apps/web/public/content/projects/manifest.json`의 `ids`에 `{id}` 추가

```json
{
  "id": "my-project",
  "companyId": "connectwave",
  "company": "커넥트웨이브",
  "name": "새 프로젝트",
  "period": { "start": "2026-02-01", "end": null },
  "summary": "요약",
  "highlights": ["성과 1"],
  "stack": ["React", "TypeScript"],
  "links": [{ "label": "링크", "href": "https://..." }],
  "status": "placeholder",
  "featured": false,
  "sortOrder": 3
}
```

- `companyId`는 **반드시** `portfolio.json`의 회사 `id`와 같아야 한다 (회사→프로젝트 링크)
- `featured: true`면 `me`와 하이라이트 링크
- (선택) 투어에 넣기: `src/entities/portfolio/model/tour.ts`
- (선택) 행성 비주얼: `celestial.ts`

### 3) 고정 허브 노드 (수정 거의 안 함)

코드가 항상 만드는 노드: `me`, `career`, `skills`, `contact`  
프로필/스킬 문구만 `portfolio.json`의 `profile` / `skills`에서 바꾼다.

```text
me
├── career
│   ├── connectwave      ← companies[]
│   │   └── sellfit      ← projects/*.json (companyId)
│   └── nextinnovation
│       ├── samsung-hospital
│       └── reason-market
├── skills
└── contact
```

---

## Storybook (공통 컴포넌트 목록)

atoms를 눈으로 확인하려면:

```bash
npm run storybook -w web
```

브라우저: http://localhost:6006  
스토리 위치: `apps/web/src/shared/ui/**/*.stories.tsx`

---

## 실행

```bash
# 프론트 (기본: 정적 content JSON → GitHub Pages와 동일)
npm run dev -w web

# Nest API 연동 시
VITE_API_URL=http://localhost:3000/api npm run dev -w web

# API
npm run start:dev -w api

# Storybook
npm run storybook -w web
```

API 스키마를 바꾼 뒤 로컬 SQLite를 갱신하려면:

```bash
rm -f apps/api/data/portfolio.sqlite
```

API: `GET /api/portfolio`

---

## SEO / AEO / GEO (현재 SPA에서 넣은 것)

| 구분 | 적용 |
|------|------|
| **SEO** | 메타/OG/Twitter, canonical, `robots.txt`, `sitemap.xml`, JSON-LD(`ProfilePage`/`Person`/`WebSite`/`ItemList`) |
| **AEO** | `FAQPage` JSON-LD + HTML FAQ 문단 |
| **GEO** | `public/llms.txt`, 크롤러용 `seo-content` 사실 블록, AI 봇 Allow |

한계: GitHub Pages SPA라 SSR은 없음. 그래프 UI보다 **정적 사실 텍스트**가 검색·답변·생성형 엔진에 먹힌다.

---

## 배포

- URL: https://qorbaxk.github.io/sy-universe/
- `main` push → GitHub Actions가 `apps/web`을 Pages로 배포
- Settings → Pages → Source = **GitHub Actions**
