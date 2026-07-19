import { Body, Controller, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  stream(@Body() dto: ChatRequestDto, @Res() res: Response) {
    return this.chatService.streamChat(dto, res);
  }
}
