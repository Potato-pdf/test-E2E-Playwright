import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'todo' })
  status: 'todo' | 'inprogress' | 'done';

  @Column({ nullable: true })
  description?: string;
}
