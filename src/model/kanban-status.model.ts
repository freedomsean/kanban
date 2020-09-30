import { Task } from './task.model';
import { Kanban } from './kanban.model';
import { BaseEntity, Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.model';

@Entity('kanban_statuses')
export class KanbanStatus extends BaseEntity {
  @PrimaryColumn({ length: 38 })
  id: string;

  @Column({ length: 50, unique: true, nullable: false })
  name: string;

  @ManyToOne((type) => Kanban, (kanban) => kanban.statuses)
  @JoinColumn({ name: 'kanban_id' })
  @Column({ length: 38, nullable: false })
  kanbanId: string;

  @ManyToOne((type) => User, (user) => user.tasks)
  @JoinColumn({ name: 'last_modified' })
  @Column({ length: 38, nullable: false })
  lastModified: User;

  @OneToMany((type) => Task, (task) => task.status)
  tasks: Task[];

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
