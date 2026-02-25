import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from './UserEntity';
import { AppointmentEntity } from './AppointmentEntity';

@Entity('workers')
export class WorkerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'int', nullable: true })
  maxSimultaneous: number | null = null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.workers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => AppointmentEntity, (apt) => apt.worker)
  appointments!: AppointmentEntity[];
}
