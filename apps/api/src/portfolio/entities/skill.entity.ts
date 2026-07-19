import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('skills')
export class SkillEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  category!: 'core' | 'product' | 'tooling';

  @Column()
  name!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
