import { KanbanStatus } from './kanban-status.model';
import { Kanban } from './kanban.model';
import { BaseEntity, Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity('tasks')
export class Task extends BaseEntity {
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
  @Column({ type: 'varchar', length: 38, nullable: false })
  lastModified: string;

  @ManyToOne((type) => KanbanStatus, (status) => status.tasks)
  @JoinColumn({ name: 'status' })
  @Column({ type: 'varchar', length: 38, nullable: false })
  status: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
