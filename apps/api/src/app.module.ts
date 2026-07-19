import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyEntity } from './portfolio/entities/company.entity';
import { ProfileEntity } from './portfolio/entities/profile.entity';
import { ProjectEntity } from './portfolio/entities/project.entity';
import { SkillEntity } from './portfolio/entities/skill.entity';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data', 'portfolio.sqlite'),
      entities: [ProfileEntity, CompanyEntity, ProjectEntity, SkillEntity],
      synchronize: true,
    }),
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
