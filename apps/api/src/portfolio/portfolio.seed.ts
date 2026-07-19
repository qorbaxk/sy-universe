import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProjectEntity } from './entities/project.entity';
import { SkillEntity } from './entities/skill.entity';

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
    const existing = await this.profileRepo.count();
    if (existing > 0) {
      this.logger.log('Portfolio seed skipped (already present)');
      return;
    }

    await this.profileRepo.save({
      id: 'me',
      name: '승연',
      nameEn: 'Seungyeon',
      title: 'Frontend Developer',
      experienceLabel: '실무 2년 11개월 · 3년차',
      headline: '제품의 흐름을 설계하고, 화면으로 설득하는 프론트엔드 개발자',
      bio: '커머스 AI 에디터와 병원 예약·어드민까지, 사용자가 실제로 쓰는 화면을 중심으로 일해왔습니다. 복잡한 플로우를 단순하게 보이게 만드는 일을 좋아합니다.',
      location: 'Korea',
      email: 'qorbaxk97@gmail.com',
      githubUrl: 'https://github.com/',
      resumeUrl: '#',
    });

    await this.companyRepo.save([
      {
        id: 'connectwave',
        name: '커넥트웨이브',
        role: 'Frontend Developer',
        period: '2025.05.20 — 현재',
        duration: '약 1년 2개월',
        summary:
          '플레이오토 셀핏AI에서 상품 상세페이지 AI 제작 경험을 고도화하는 프론트엔드 개발을 담당합니다.',
        sortOrder: 1,
      },
      {
        id: 'nextinnovation',
        name: '넥스트이노베이션',
        role: 'Frontend Developer',
        period: '2023.06.28 — 2025.03.19',
        duration: '약 1년 9개월',
        summary:
          '강북삼성병원 건강검진 웹예약과 리즌마켓(현 두타온) 어드민 등 B2B/내부 운영 제품을 구현했습니다.',
        sortOrder: 2,
      },
    ]);

    await this.projectRepo.save([
      {
        id: 'sellfit',
        company: '커넥트웨이브',
        name: '셀핏AI',
        period: '2025.05 — 현재',
        summary:
          '상품 정보와 키워드만으로 상세페이지를 생성하는 AI 에디터. AI 생성, 직접 제작, 템플릿 기반 제작 플로우를 하나의 제품 경험으로 연결합니다.',
        highlights: [
          'AI / 직접 제작 / MY 템플릿 진입 경로를 분리한 에디터 온보딩 UX',
          '블록·요소 단위 편집이 가능한 상세페이지 제작 인터페이스',
          '카테고리별 템플릿과 AI 이미지·텍스트 편집 경험 제공',
        ],
        stack: ['React', 'TypeScript', 'Editor UI', 'AI Product'],
        links: [
          { label: '소개 페이지', href: 'https://plto.com/additional/Sellfit/' },
          { label: '에디터', href: 'https://sellfit-ai.plto.com/editor' },
        ],
        status: 'placeholder',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'samsung-hospital',
        company: '넥스트이노베이션',
        name: '강북삼성병원 건강검진 웹예약',
        period: '넥스트이노베이션',
        summary:
          '건강검진 예약 과정을 웹에서 완료할 수 있도록 한 예약 시스템. 복잡한 병원 도메인 플로우를 사용자 기준으로 정리하는 것이 핵심이었습니다.',
        highlights: [
          '예약 단계별 정보 입력·검증 흐름 구성',
          '병원 서비스 특성에 맞는 상태/일정 UX 설계',
          '운영·사용자 모두가 이해할 수 있는 화면 구조 정리',
        ],
        stack: ['React', 'TypeScript', 'Form UX', 'Domain Workflow'],
        status: 'placeholder',
        featured: false,
        sortOrder: 2,
      },
      {
        id: 'reason-market',
        company: '넥스트이노베이션',
        name: '리즌마켓 (현 두타온) 어드민',
        period: '넥스트이노베이션',
        summary:
          '커머스 운영을 위한 어드민 화면 개발. 목록·상세·상태 관리처럼 반복되지만 실수 비용이 큰 운영 UX를 다뤘습니다.',
        highlights: [
          '운영자가 빠르게 상태를 파악하는 어드민 정보 구조',
          '목록/필터/상세 중심의 실무형 관리 화면',
          '현 두타온으로 이어지는 커머스 운영 도메인 경험',
        ],
        stack: ['React', 'TypeScript', 'Admin UI', 'Commerce'],
        status: 'placeholder',
        featured: false,
        sortOrder: 3,
      },
    ]);

    await this.skillRepo.save([
      { id: 'react', category: 'core', name: 'React', sortOrder: 1 },
      { id: 'typescript', category: 'core', name: 'TypeScript', sortOrder: 2 },
      { id: 'javascript', category: 'core', name: 'JavaScript', sortOrder: 3 },
      { id: 'html-css', category: 'core', name: 'HTML/CSS', sortOrder: 4 },
      { id: 'editor-ux', category: 'product', name: 'Editor UX', sortOrder: 1 },
      { id: 'admin-ux', category: 'product', name: 'Admin UX', sortOrder: 2 },
      {
        id: 'form-workflow',
        category: 'product',
        name: 'Form/Workflow',
        sortOrder: 3,
      },
      {
        id: 'design-collab',
        category: 'product',
        name: 'Design Collaboration',
        sortOrder: 4,
      },
      { id: 'vite', category: 'tooling', name: 'Vite', sortOrder: 1 },
      { id: 'git', category: 'tooling', name: 'Git', sortOrder: 2 },
      { id: 'rest-api', category: 'tooling', name: 'REST API', sortOrder: 3 },
      {
        id: 'github-actions',
        category: 'tooling',
        name: 'GitHub Actions',
        sortOrder: 4,
      },
    ]);

    this.logger.log('Portfolio seed completed');
  }
}
