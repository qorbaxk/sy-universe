import { getApiBaseUrl } from '@/shared/config/api'

export type ChatCitation = {
  id: string
  source: string
}

type StreamHandlers = {
  onMeta?: (citations: ChatCitation[], sessionId?: string | null) => void
  onToken?: (text: string) => void
  onDone?: () => void
}

/**
 * @alias 가이드 챗 SSE
 * @description Nest `POST /chat/stream`을 통해 AI 서비스 응답을 받는다.
 */
export async function streamGuideChat(
  message: string,
  sessionId: string | undefined,
  handlers: StreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const base = getApiBaseUrl()
  if (!base) {
    throw new Error(
      'VITE_API_URL이 없습니다. Nest + AI 서비스를 켠 뒤 환경 변수를 설정해 주세요.',
    )
  }

  const response = await fetch(`${base}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ message, sessionId }),
    signal,
  })

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `채팅 실패 (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const line = part
        .split('\n')
        .find((item) => item.startsWith('data:'))
      if (!line) continue
      const raw = line.slice(5).trim()
      if (!raw) continue

      try {
        const event = JSON.parse(raw) as {
          type: string
          text?: string
          citations?: ChatCitation[]
          sessionId?: string | null
        }
        if (event.type === 'meta') {
          handlers.onMeta?.(event.citations ?? [], event.sessionId)
        } else if (event.type === 'token' && event.text) {
          handlers.onToken?.(event.text)
        } else if (event.type === 'done') {
          handlers.onDone?.()
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }

  handlers.onDone?.()
}
