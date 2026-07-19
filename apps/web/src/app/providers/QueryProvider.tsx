import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @alias 쿼리 클라이언트
 * @description 앱 전역에서 공유하는 React Query 클라이언트 인스턴스.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

type QueryProviderProps = {
  /**
   * @alias 자식
   * @description Provider 하위에 렌더할 React 트리.
   */
  children: ReactNode
}

/**
 * @alias React Query Provider
 * @description 서버 상태(포트폴리오 스냅샷 등)를 위한하기 위한 QueryClientProvider 래퍼.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
