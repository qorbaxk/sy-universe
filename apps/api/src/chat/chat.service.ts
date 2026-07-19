import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly aiBaseUrl =
    process.env.AI_SERVICE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  async streamChat(
    body: { message: string; sessionId?: string },
    res: Response,
  ) {
    let upstream: globalThis.Response;
    try {
      upstream = await fetch(`${this.aiBaseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      this.logger.error(`AI service unreachable: ${String(error)}`);
      throw new ServiceUnavailableException(
        'AI 가이드 서비스에 연결할 수 없습니다. `npm run dev:ai`로 실행해 주세요.',
      );
    }

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => '');
      throw new BadGatewayException(
        text || `AI service error (${upstream.status})`,
      );
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
    } catch (error) {
      this.logger.error(`SSE proxy failed: ${String(error)}`);
      if (!res.writableEnded) {
        res.end();
      }
    }
  }
}
