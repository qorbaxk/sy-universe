import { useEffect, useId, useRef, useState } from 'react'
import {
  streamGuideChat,
  type ChatCitation,
} from '@/entities/portfolio/api/chatApi'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { cn } from '@/shared/lib/cn'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: ChatCitation[]
}

type GuideChatPanelProps = {
  /**
   * @alias 열림
   * @description 탑바 AI 가이드 버튼과 동기화.
   */
  open: boolean

  /**
   * @alias 열림 변경
   * @description 닫기/토글 시 호출.
   */
  onOpenChange: (open: boolean) => void

  /**
   * @alias 우측 디테일 패널 열림
   * @description true면 채팅을 디테일 왼쪽 여백에 붙인다.
   */
  detailPanelOpen?: boolean
}

/**
 * @alias 포트폴리오 가이드 챗
 * @description 탑바에서 열고, 우측 디테일 패널과 겹치지 않게 배치한다.
 */
export function GuideChatPanel({
  open,
  onOpenChange,
  detailPanelOpen = false,
}: GuideChatPanelProps) {
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '안녕하세요. 포트폴리오 문서 기반 가이드입니다. 셀핏AI, 경력, 스택을 물어보세요.',
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, open])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  if (!open) return null

  const send = async () => {
    const text = input.trim()
    if (!text || pending) return

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }
    const assistantId = `a-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setInput('')
    setPending(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamGuideChat(
        text,
        sessionId,
        {
          onMeta: (citations) => {
            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantId ? { ...item, citations } : item,
              ),
            )
          },
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantId
                  ? { ...item, content: item.content + token }
                  : item,
              ),
            )
          },
        },
        controller.signal,
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                content:
                  item.content ||
                  (error as Error).message ||
                  '응답을 받지 못했습니다.',
              }
            : item,
        ),
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      id="portfolio-guide-chat"
      aria-labelledby={titleId}
      className={cn(
        'pointer-events-auto fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1118]/95 shadow-2xl backdrop-blur-xl',
        'top-[4.75rem] h-[min(440px,calc(100vh-6rem))] w-[min(360px,calc(100vw-1.5rem))]',
        // 디테일 패널(약 520px) 왼쪽에 붙여 겹침 방지 / 닫혀 있으면 우측 상단
        detailPanelOpen
          ? 'right-[min(540px,calc(100vw-1.25rem))] max-md:right-3 max-md:left-3 max-md:w-auto'
          : 'right-5 max-md:right-3 max-md:left-3 max-md:w-auto',
      )}
    >
      <header className="flex items-center justify-between border-b border-white/8 px-3 py-2.5">
        <div>
          <h2 id={titleId} className="text-sm font-semibold text-ink">
            AI 가이드
          </h2>
          <p className="text-[11px] text-muted">포트폴리오 문서 기반 답변</p>
        </div>
        <Button
          variant="ghost"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          닫기
        </Button>
      </header>

      <div
        ref={listRef}
        className="panel-scroll min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap',
              message.role === 'user'
                ? 'ml-auto bg-accent/20 text-ink'
                : 'bg-white/[0.05] text-muted',
            )}
          >
            {message.content || (pending ? '…' : '')}
            {message.citations && message.citations.length > 0 && (
              <p className="mt-2 text-[10px] tracking-wide text-accent-2 uppercase">
                sources:{' '}
                {message.citations
                  .map((item) => item.source)
                  .slice(0, 3)
                  .join(' · ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-white/8 p-2.5"
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="셀핏 에디터에 대해 알려줘"
          disabled={pending}
        />
        <Button type="submit" variant="accent" disabled={pending}>
          전송
        </Button>
      </form>
    </section>
  )
}
