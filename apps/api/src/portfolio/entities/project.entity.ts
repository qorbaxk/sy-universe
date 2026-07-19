import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  company!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  period?: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'simple-json' })
  highlights!: string[];

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
