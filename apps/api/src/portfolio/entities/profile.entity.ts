import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'name_en' })
  nameEn!: string;

  @Column()
  title!: string;

  @Column({ name: 'experience_label' })
  experienceLabel!: string;

  @Column()
  headline!: string;

  @Column({ type: 'text' })
  bio!: string;

  @Column()
  location!: string;

  @Column()
  email!: string;

  @Column({ name: 'github_url' })
  githubUrl!: string;

  @Column({ name: 'resume_url' })
  resumeUrl!: string;
}
