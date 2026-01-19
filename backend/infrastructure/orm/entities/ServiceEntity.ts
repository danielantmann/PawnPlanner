import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { AppointmentEntity } from './AppointmentEntity';
import { UserEntity } from './UserEntity';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => UserEntity, (user) => user.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: UserEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.service)
  appointments!: AppointmentEntity[];
}
