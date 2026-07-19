import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  role!: string;

  /** ISO 기간 { start, end? } */
  @Column({ type: 'simple-json' })
  period!: { start: string; end?: string | null };

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
