import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProjectEntity } from './entities/project.entity';
import { SkillEntity } from './entities/skill.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioSeedService } from './portfolio.seed';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfileEntity,
      CompanyEntity,
      ProjectEntity,
      SkillEntity,
    ]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioSeedService],
})
export class PortfolioModule {}
