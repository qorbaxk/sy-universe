import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contact_messages')
export class ContactMessageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ nullable: true })
  ip?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
