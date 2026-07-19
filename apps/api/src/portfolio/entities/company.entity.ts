import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  role!: string;

  @Column()
  period!: string;

  @Column()
  duration!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
