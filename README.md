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
│   ├── api/                          # NestJS + SQLite (portfolio / contact / chat BFF)
│   └── ai/                           # FastAPI portfolio RAG guide (SSE)
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
│   ├── guide-chat/                   # 포트폴리오 RAG 챗 UI (Nest SSE)
│   └── enable-webgl/                 # Zustand: 2D 폴백 + 안내 배너
│
├── entities/
│   └── portfolio/
│       ├── api/                      # React Query / contact / chat stream
│       ├── lib/buildGraphFromPortfolio.ts  # JSON → 그래프 노드/링크
│       └── model/                    # 타입(JSDoc) · celestial · tour · selectors
│
└── shared/
    ├── ui/                           # atoms (Button, Input, Modal…) — Storybook 대상
    ├── lib/                          # cn, date, three, webgl
    └── config/api.ts                 # VITE_API_URL
```

### 데이터 흐름 (한 줄)

`public/content/*.json` (또는 Nest `GET /portfolio`) → `usePortfolioQuery` → `buildGraphFromPortfolio` → 그래프 위젯  
문의는 `POST /contact`, 가이드 챗은 Nest SSE → FastAPI RAG.

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
  "parentId": "sellfit",
  "name": "새 프로젝트",
  "role": "본인 기여 한 줄",
  "period": { "start": "2026-02-01", "end": null },
  "summary": "요약",
  "architectureNote": "FE · Nest · AI 계층 요약",
  "highlights": ["성과 1"],
  "features": [],
  "stack": ["React", "TypeScript"],
  "links": [{ "label": "링크", "href": "https://..." }],
  "status": "ready",
  "featured": false,
  "sortOrder": 3
}
```

- `companyId`는 **반드시** `portfolio.json`의 회사 `id`와 같아야 한다
- `parentId`가 있으면 허브→위성 링크로 연결되고 company 링크는 생략
- `featured: true`면 `me`와 하이라이트 링크
- (선택) 투어에 넣기: `src/entities/portfolio/model/tour.ts`
- (선택) 행성 비주얼: `celestial.ts`

### 3) 고정 허브 노드 (수정 거의 안 함)

코드가 항상 만드는 노드: `me`, `career`, `skills`, `contact`  
프로필/스킬 문구만 `portfolio.json`의 `profile` / `skills`에서 바꾼다.

```text
me
├── career
│   ├── connectwave
│   │   └── sellfit                 ← hub (featured)
│   │       ├── sellfit-editor      ← parentId: sellfit
│   │       ├── sellfit-export
│   │       ├── sellfit-ai-gen
│   │       └── sellfit-guide-bot
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

# Nest API (portfolio SSOT sync + contact + chat BFF)
npm run dev:api

# Python RAG guide (port 8000)
npm run dev:ai

# Nest 연동 프론트
cp apps/web/.env.example apps/web/.env
npm run dev -w web

# Storybook
npm run storybook -w web
```

API:

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/portfolio` | 콘텐츠 SSOT 스냅샷 (기동 시 JSON sync) |
| POST | `/api/contact` | 문의 접수 → SMTP로 `CONTACT_TO_EMAIL`에 발송 |
| POST | `/api/chat/stream` | AI 가이드 SSE 프록시 (`AI_SERVICE_URL`) |

문의 메일 설정: `apps/api/.env.example`을 복사해 SMTP 값을 채운 뒤 `npm run dev:api`  
프론트는 `apps/web/.env`에 `VITE_API_URL=http://localhost:3000/api`

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

### 프론트 (GitHub Pages)

- URL: https://qorbaxk.github.io/sy-universe/
- `main` push → GitHub Actions가 `apps/web`을 Pages로 배포
- Settings → Pages → Source = **GitHub Actions**
- 문의 API 연동: repo **Settings → Secrets → Actions**에  
  `VITE_API_URL` = `https://<render-서비스명>.onrender.com/api`  
  (**끝에 `/api` 필수** — origin만 넣으면 문의/챗이 404납니다)

### API (Render Free)

1. [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**
2. GitHub 레포 `sy-universe` 연결 (Private이면 Render GitHub App 권한 허용)
3. 설정:
   - **Name**: `sy-universe-api` (원하는 이름)
   - **Region**: Singapore (또는 가까운 곳)
   - **Root Directory**: 비움 (모노레포 루트)
   - **Runtime**: Node
   - **Build Command**: `npm ci --include=dev && npm rebuild better-sqlite3 && npm run build -w api`
   - **Start Command**: `npm run start:prod -w api`
   - **Instance type**: **Free**
4. **Environment**에 추가 (Gmail 앱 비밀번호 권장):

| Key | 예시 |
|-----|------|
| `NODE_VERSION` | `20` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `qorbaxk97@gmail.com` |
| `SMTP_PASS` | Gmail 앱 비밀번호 |
| `SMTP_FROM` | `sy-universe <qorbaxk97@gmail.com>` |
| `CONTACT_TO_EMAIL` | `qorbaxk97@gmail.com` |

5. **Create Web Service** → 배포 로그에서 Live URL 확인  
   예: `https://sy-universe-api.onrender.com`
6. 브라우저에서 `https://…onrender.com/api` 열어보기 (첫 요청은 잠에서 깨어나느라 수십 초 걸릴 수 있음)
7. GitHub Secret `VITE_API_URL`을 `https://…onrender.com/api`로 넣고 `main`에 push (또는 Actions 수동 실행)

`render.yaml`을 쓰면 **New → Blueprint**로도 같은 서비스를 만들 수 있습니다. SMTP 값은 Dashboard에서 직접 입력합니다.
