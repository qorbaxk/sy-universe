import { getApiBaseUrl } from '@/shared/config/api'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export type ContactResponse = {
  id: number
  ok: boolean
  message: string
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string | string[]
    }
    if (Array.isArray(data.message)) return data.message.join('\n')
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message
    }
  } catch {
    // ignore
  }
  return `문의 전송에 실패했습니다. (${response.status})`
}

/**
 * @alias 문의 제출
 * @description Nest `POST /contact` → 서버가 SMTP로 수신 메일에 발송한다.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResponse> {
  const base = getApiBaseUrl()
  if (!base) {
    throw new Error(
      '문의 서버에 연결되지 않았어요. 잠시 후 다시 시도해 주세요.',
    )
  }

  const response = await fetch(`${base}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return response.json() as Promise<ContactResponse>
}
