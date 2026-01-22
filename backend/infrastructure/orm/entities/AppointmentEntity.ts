import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from './UserEntity';
import { PetEntity } from './PetEntity';
import { ServiceEntity } from './ServiceEntity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'int' })
  petId!: number;

  @Column({ type: 'int' })
  ownerId!: number;

  @Column({ type: 'int' })
  serviceId!: number;

  // Copias para evitar joins y mantener histórico
  @Column({ type: 'varchar', length: 100 })
  petName!: string;

  @Column({ type: 'varchar', length: 100 })
  breedName!: string;

  @Column({ type: 'varchar', length: 100 })
  ownerName!: string;

  @Column({ type: 'varchar', length: 50 })
  ownerPhone!: string;

  @Column({ type: 'varchar', length: 255 })
  serviceName!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  estimatedPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  finalPrice!: number;

  @Column({ type: 'datetime' })
  startTime!: Date;

  @Column({ type: 'datetime' })
  endTime!: Date;

  @Column({ type: 'int' })
  durationMinutes!: number;

  @Column({ type: 'varchar', length: 20, default: 'completed' })
  status!: 'completed' | 'no-show' | 'cancelled';

  @Column({ type: 'boolean', default: false })
  reminderSent!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => PetEntity, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: PetEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service!: ServiceEntity;
}
