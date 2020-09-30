import { UserKanban } from './user-kanban.model';
import { KanbanStatus } from './kanban-status.model';
import { Task } from './task.model';
import { BaseEntity, Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';

@Entity('kanbans')
export class Kanban extends BaseEntity {
  @PrimaryColumn({ length: 38 })
  id: string;

  @Column({ length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany((type) => Task, (task) => task.kanbanId)
  tasks: Task[];

  @OneToMany((type) => KanbanStatus, (status) => status.kanbanId)
  statuses: KanbanStatus[];

  @OneToMany((type) => UserKanban, (userKanban) => userKanban.kanban)
  usersKanbans: UserKanban[];
}
