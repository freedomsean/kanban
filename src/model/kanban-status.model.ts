import { Task } from './task.model';
import { Kanban } from './kanban.model';
import { BaseEntity, Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { User } from './user.model';

@Entity('kanban_statuses')
@Unique('order_kanban_id', ['order', 'kanbanId'])
@Unique('name_kanban_id', ['name', 'kanbanId'])
export class KanbanStatus extends BaseEntity {
  @PrimaryColumn({ length: 38 })
  id: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @ManyToOne((type) => Kanban, (kanban) => kanban.statuses)
  @JoinColumn({ name: 'kanban_id' })
  @Column({ type: 'varchar', length: 38, nullable: false })
  kanbanId: string;

  @ManyToOne((type) => User, (user) => user.tasks)
  @JoinColumn({ name: 'last_modified' })
  @Column({ type: 'varchar', length: 38, nullable: true })
  lastModified: string;

  @OneToMany((type) => Task, (task) => task.status)
  tasks: Task[];

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
