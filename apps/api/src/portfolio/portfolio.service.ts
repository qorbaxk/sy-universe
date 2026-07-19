import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProjectEntity } from './entities/project.entity';
import { SkillEntity } from './entities/skill.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
  ) {}

  async getSnapshot() {
    const [profile, companies, projects, skills] = await Promise.all([
      this.profileRepo.findOneBy({ id: 'me' }),
      this.companyRepo.find({ order: { sortOrder: 'ASC' } }),
      this.projectRepo.find({ order: { sortOrder: 'ASC' } }),
      this.skillRepo.find({ order: { sortOrder: 'ASC' } }),
    ]);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      profile: {
        name: profile.name,
        nameEn: profile.nameEn,
        title: profile.title,
        experienceLabel: profile.experienceLabel,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        email: profile.email,
        links: {
          github: profile.githubUrl,
          resume: profile.resumeUrl,
        },
      },
      companies,
      projects,
      skills: {
        core: skills
          .filter((skill) => skill.category === 'core')
          .map((skill) => skill.name),
        product: skills
          .filter((skill) => skill.category === 'product')
          .map((skill) => skill.name),
        tooling: skills
          .filter((skill) => skill.category === 'tooling')
          .map((skill) => skill.name),
      },
    };
  }
}
