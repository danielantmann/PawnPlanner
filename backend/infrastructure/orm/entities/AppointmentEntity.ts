import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { PetEntity } from './PetEntity';
import { ServiceEntity } from './ServiceEntity';
import { UserEntity } from './UserEntity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'datetime' })
  startTime!: Date;

  @Column({ type: 'datetime' })
  endTime!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => UserEntity, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: UserEntity;

  @ManyToOne(() => PetEntity, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: PetEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service!: ServiceEntity;
}
