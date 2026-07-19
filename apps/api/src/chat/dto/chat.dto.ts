import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  sessionId?: string;
}
