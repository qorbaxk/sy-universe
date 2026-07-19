# sy-universe

이직용 옵시디언형 3D 포트폴리오.

## Apps

- `apps/web` — React + TypeScript (FSD) + 3D Force Graph / GitHub Pages
- `apps/api` — NestJS + TypeORM (SQLite)

## Frontend (FSD)

```text
src/
  app/        # 앱 엔트리, 글로벌 스타일
  pages/      # 페이지 조합
  widgets/    # 그래프, 디테일 패널, 탑바
  features/   # 노드 선택 등 상호작용
  entities/   # portfolio 도메인 모델/데이터
  shared/     # 공통 UI, three 유틸, theme
```

## 실행

```bash
# 프론트
npm run dev -w web

# API
npm run start:dev -w api
```

API: `GET /api/portfolio`

## 배포

`main`/`master` push 시 GitHub Actions가 `apps/web`을 GitHub Pages로 배포합니다.
Settings → Pages → Source를 **GitHub Actions**로 설정하세요.
