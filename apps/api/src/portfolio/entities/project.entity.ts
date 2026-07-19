import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  companyId!: string;

  @Column()
  company!: string;

  @Column({ type: 'varchar', nullable: true })
  parentId?: string | null;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  role?: string | null;

  @Column({ type: 'simple-json', nullable: true })
  period?: { start: string; end?: string | null };

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text', nullable: true })
  architectureNote?: string | null;

  @Column({ type: 'simple-json' })
  highlights!: string[];

  @Column({ type: 'simple-json', nullable: true })
  features?: Array<{
    id: string;
    title: string;
    layer: 'frontend' | 'backend' | 'ai' | 'infra';
    star: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    stack?: string[];
  }> | null;

  @Column({ type: 'simple-json', nullable: true })
  metrics?: Array<{ label: string; value: string }> | null;

  @Column({ type: 'simple-json', nullable: true })
  media?: Array<{ src: string; alt: string; caption?: string }> | null;

  @Column({ type: 'simple-json' })
  stack!: string[];

  @Column({ type: 'simple-json', nullable: true })
  links?: { label: string; href: string }[];

  @Column({ default: 'placeholder' })
  status!: 'placeholder' | 'ready';

  @Column({ default: false })
  featured!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
