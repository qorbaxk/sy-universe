import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactMessageEntity } from './contact/entities/contact-message.entity';
import { ContactModule } from './contact/contact.module';
import { ChatModule } from './chat/chat.module';
import { CompanyEntity } from './portfolio/entities/company.entity';
import { ProfileEntity } from './portfolio/entities/profile.entity';
import { ProjectEntity } from './portfolio/entities/project.entity';
import { SkillEntity } from './portfolio/entities/skill.entity';
import { PortfolioModule } from './portfolio/portfolio.module';

function resolveDatabasePath() {
  // Render 등 PaaS: 쓰기 가능한 경로 사용 (에페메랄이어도 문의는 SMTP가 본선)
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  if (process.env.RENDER) {
    return join('/tmp', 'sy-universe-portfolio.sqlite');
  }
  const dir = join(__dirname, '..', 'data');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return join(dir, 'portfolio.sqlite');
}

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60,
      },
    ]),
    TypeOrmModule.forRoot({
      // sqlite3 네이티브 바인딩이 Render에서 자주 깨져 better-sqlite3 사용
      type: 'better-sqlite3',
      database: resolveDatabasePath(),
      entities: [
        ProfileEntity,
        CompanyEntity,
        ProjectEntity,
        SkillEntity,
        ContactMessageEntity,
      ],
      synchronize: true,
    }),
    PortfolioModule,
    ContactModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
