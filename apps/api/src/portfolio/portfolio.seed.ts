import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProjectEntity } from './entities/project.entity';
import { SkillEntity } from './entities/skill.entity';

type PortfolioBase = {
  profile: {
    name: string;
    nameEn: string;
    title: string;
    headline: string;
    bio: string;
    location: string;
    email: string;
    links: { github: string; resume: string };
  };
  companies: Array<{
    id: string;
    name: string;
    role: string;
    period: { start: string; end?: string | null };
    summary: string;
    sortOrder: number;
  }>;
  skills: {
    core: string[];
    product: string[];
    tooling: string[];
  };
};

type ProjectManifest = { ids: string[] };

@Injectable()
export class PortfolioSeedService implements OnModuleInit {
  private readonly logger = new Logger(PortfolioSeedService.name);

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

  async onModuleInit() {
    const contentRoot = this.resolveContentRoot();
    if (!contentRoot) {
      this.logger.warn('Content root not found; seed aborted');
      return;
    }

    const base = this.readJson<PortfolioBase>(
      join(contentRoot, 'portfolio.json'),
    );
    const manifest = this.readJson<ProjectManifest>(
      join(contentRoot, 'projects', 'manifest.json'),
    );
    const projects = manifest.ids.map((id) =>
      this.readJson<ProjectEntity>(
        join(contentRoot, 'projects', `${id}.json`),
      ),
    );

    await this.profileRepo.save({
      id: 'me',
      name: base.profile.name,
      nameEn: base.profile.nameEn,
      title: base.profile.title,
      experienceLabel: '',
      headline: base.profile.headline,
      bio: base.profile.bio,
      location: base.profile.location,
      email: base.profile.email,
      githubUrl: base.profile.links.github,
      resumeUrl: base.profile.links.resume,
    });

    await this.companyRepo.clear();
    await this.companyRepo.save(base.companies);

    await this.projectRepo.clear();
    await this.projectRepo.save(projects);

    await this.skillRepo.clear();
    const skillRows: Array<Partial<SkillEntity>> = [];
    let order = 1;
    for (const name of base.skills.core) {
      skillRows.push({
        id: `core-${order}`,
        category: 'core',
        name,
        sortOrder: order++,
      });
    }
    order = 1;
    for (const name of base.skills.product) {
      skillRows.push({
        id: `product-${order}`,
        category: 'product',
        name,
        sortOrder: order++,
      });
    }
    order = 1;
    for (const name of base.skills.tooling) {
      skillRows.push({
        id: `tooling-${order}`,
        category: 'tooling',
        name,
        sortOrder: order++,
      });
    }
    await this.skillRepo.save(skillRows);

    this.logger.log(
      `Portfolio SSOT synced from content JSON (${projects.length} projects)`,
    );
  }

  private resolveContentRoot(): string | null {
    const candidates = [
      join(process.cwd(), '../web/public/content'),
      join(process.cwd(), 'apps/web/public/content'),
      join(__dirname, '../../../../web/public/content'),
    ];
    return (
      candidates.find((path) => existsSync(join(path, 'portfolio.json'))) ??
      null
    );
  }

  private readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  }
}
